<!--
* CORTX-CSM: CORTX Management web.
* Copyright (c) 2022 Seagate Technology LLC and/or its Affiliates
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU Affero General Public License for more details.
* You should have received a copy of the GNU Affero General Public License
* along with this program. If not, see <https://www.gnu.org/licenses/>.
* For any questions about this software or licensing,
* please email opensource@seagate.com.
-->
<template>
  <div class="maintenance-support-bundle-page">
    <div class="top-section">
      <div class="page-title">Support bundle</div>
      <div class="description">
        Generate and download support bundle for Seagate support
      </div>
    </div>
    <div class="filters-section">
      <v-divider></v-divider>
      <div class="form-element-container">
        <div class="form-element">
          <label for="">Node</label>
          <SgtDropdown
            placeholder="Node"
            :dropdownOptions="nodeOptions"
            v-model="selectedNode"
          />
        </div>
        <div class="form-element">
          <label for="">Time Period</label>
          <v-menu
            ref="menu"
            v-model="timePeriodMenu"
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                :value="dates"
                name="time-period"
                placeholder="Time Period"
                color="green"
                readonly
                v-bind="attrs"
                v-on="on"
                class="pt-0"
                outlined
                dense
                :class="{ 'invalid-range': timePeriod.length === 1 }"
              >
                <template v-slot:append>
                  <v-icon
                    color="primary"
                    @click="timePeriodMenu = !timePeriodMenu"
                    >mdi-calendar-month-outline</v-icon
                  >
                </template>
              </v-text-field>
            </template>
            <v-date-picker
              color="csmprimary"
              v-model="timePeriod"
              :max="new Date().toISOString().slice(0, 10)"
              range
            ></v-date-picker>
          </v-menu>
        </div>
      </div>

      <v-divider></v-divider>

      <div class="form-element-container">
        <div class="form-element">
          <label for="">Component</label>
          <SgtDropdown
            placeholder="Component"
            :dropdownOptions="['CSM', 'S3']"
            v-model="selectedComponent"
            @download="downloadBundle(data)"
          />
        </div>
        <div class="form-element">
          <label for="">Text</label>
          <v-text-field
            v-model="filterText"
            placeholder="Text"
            outlined
            dense
          ></v-text-field>
        </div>
      </div>
      <v-divider></v-divider>
    </div>
    <v-btn
      color="primary"
      class="bundle-cta-btn"
      :disabled="isDisableCTA"
      elevation="0"
      @click="generateSupportBundle"
      >Generate</v-btn
    >

    <SgtDataTable
      :headers="supportBundleConfig.supportBundleTable.headers"
      :records="supportBundleData"
      :searchConfig="supportBundleConfig.searchConfig"
      @zoom="moreInfoHandler"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import SgtDropdown from "@/lib/components/SgtDropdown/SgtDropdown.vue";
import SgtDataTable from "@/lib/components/SgtDataTable/SgtDataTable.vue";
import { Api } from "../../services/Api";
import { lrMaintenanceSupportBundleConst } from "./LrMaintenance.constant";
import SgtDialog from "@/lib/components/SgtDialog/SgtDialog.vue";
import { SgtDialogModel } from "@/lib/components/SgtDialog/SgtDialog.model";
import { create } from "vue-modal-dialogs";
import { formatTime } from "@/utils/CommonUtilFunctions";
import moment from "moment";
@Component({
  name: "LrMaintenanceSupportBundle",
  components: { SgtDropdown, SgtDataTable, SgtDialog },
})
export default class LrMaintenanceSupportBundle extends Vue {
  selectedNode: string = "";
  selectedComponent: string = "";
  filterText: string = "";
  dates: string = "";
  timePeriod: string[] = [];
  timePeriodMenu: boolean = false;
  supportBundleData = [];
  nodeOptions = [];
  supportBundleConfig = lrMaintenanceSupportBundleConst;
  moreInfoModel = create<SgtDialogModel>(SgtDialog);

  get isDisableCTA() {
    let isDisable = true;
    if (
      this.selectedNode &&
      this.selectedComponent &&
      this.timePeriod.length === 2
    ) {
      isDisable = false;
    }
    return isDisable;
  }

  public dateRange = {
    startDate: 0,
    endDate: 0,
  };

  @Watch("timePeriod")
  public printDates() {
    if (this.timePeriod.length === 2) {
      if (this.timePeriod[0] > this.timePeriod[1]) {
        this.dateRange.startDate = moment(
          moment(this.timePeriod[1]).toDate()
        ).unix();
        this.dateRange.endDate =
          moment(moment(this.timePeriod[0]).toDate()).unix() + 86399;
      } else {
        this.dateRange.startDate = moment(
          moment(this.timePeriod[0]).toDate()
        ).unix();
        this.dateRange.endDate =
          moment(moment(this.timePeriod[1]).toDate()).unix() + 86399;
      }
    }

    switch (this.timePeriod.length) {
      case 1:
        this.dates = this.dates[0];
        break;
      case 2:
        this.dates =
          this.timePeriod[0] > this.timePeriod[1]
            ? this.timePeriod.reverse().join(" ~ ")
            : this.timePeriod.join(" ~ ");
        break;
    }
  }

  async mounted() {
    const supportBundleRes: any = await Api.getData(
      "maintenance/support-bundle",
      {
        isDummy: true,
      }
    );
    this.supportBundleData = supportBundleRes.data;

    const nodeListRes: any = await Api.getData("maintenance/node-list", {
      isDummy: true,
    });
    this.nodeOptions = nodeListRes.data;
  }

  async moreInfoHandler(data: any) {
    const result = await this.moreInfoModel({
      modalTitle: "Bundle detail view",
      modalContent: `
        <b>Bundle Id:</b> ${data.bundleId}<br>
        <b>Timestamp:</b> ${formatTime(data.timestamp)}<br>
        <b>Status: </b> ${data.status}<br>
        <b>Parameters<br>
        <b>Component: </b> ${data.parameters.component}<br>
        <b>Node: </b> ${data.parameters.node}<br>
      `,
      modalType: "message",
      modalContentType: "html",
      okButtonLabel: "Close",
    });
  }

  generateSupportBundle() {
    //API call to generate the support bundle
  }

  downloadBundle(data: any) {
    //API call to receive the support bundle
  }
}
</script>
<style lang="scss" scoped>
.maintenance-support-bundle-page {
  .page-title {
    font-weight: bold;
  }

  .bundle-cta-btn {
    margin-bottom: 1em;
  }

  .v-divider {
    margin: 20px 0;
  }

  .form-element-container {
    display: flex;
    align-items: center;
    gap: 6em;
    .form-element {
      max-width: 550px;
      display: flex;
      justify-content: space-between;
      flex-grow: 1;
      label {
        margin-top: 8px;
        font-weight: bold;
        width: 140px;
      }

      & > div {
        max-width: 400px;
      }
    }
  }
}
.v-picker {
  width: 100%;
}
</style>
