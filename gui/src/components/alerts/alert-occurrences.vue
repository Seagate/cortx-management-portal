/*
* CORTX-CSM: CORTX Management web and CLI interface.
* Copyright (c) 2020 Seagate Technology LLC and/or its Affiliates
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
* please email opensource@seagate.com or cortx-questions@seagate.com.
*/
<template>
  <div class="mt-3">
    <v-data-table
      calculate-widths
      :items="alertObject.alerts"
      item-key="created_time"
      height="250"
      :items-per-page.sync="itemsPerPage"
      :footer-props="{
        'items-per-page-options': [50, 100, 150, 200]
        }"
      :page.sync="currentPage"
      :update:page="currentPage"
      :server-items-length="alertObject.total_records"
      hide-default-header
      @update:items-per-page="onSortPaginate()"
      @update:page="onSortPaginate()"
      id="tblAlertoccurenes"
    >
      <template v-slot:header="{}">
        <tr>
          <th
            v-for="header in alertOccurrencesTableHeaders"
            :key="header.text"
            :class="[
                'tableheader',
                header.sortable ? 'cortx-cursor-pointer' : ''
              ]"
            @click="onSort(header)"
          >
            <span>{{ header.text }}</span>
            <span v-if="header.value === sortInfo.header">
              <img
                v-if="sortInfo.sort_dir === alertStatus.desc"
                :src="require('@/assets/widget/table-sort-desc.svg/')"
                class="d-inline-block"
                style="vertical-align: bottom; margin-left: -0.3em;"
                height="20"
                width="20"
              />
              <img
                v-if="sortInfo.sort_dir === alertStatus.asc"
                :src="require('@/assets/widget/table-sort-asc.svg/')"
                class="d-inline-block"
                style="vertical-align: bottom; margin-left: -0.3em;"
                height="20"
                width="20"
              />
            </span>
          </th>
          <th class="tableheader">Action</th>
        </tr>
      </template>
      <template v-slot:item="props">
        <tr style="color: #000000;">
          <td style="white-space: nowrap;">{{ new Date(props.item.created_time*1000) | timeago }}</td>
          <td style="white-space: nowrap;">
            <span>{{ props.item.module_type + " | " + props.item.state }}</span>
          </td>
          <td>
            <div
              style="margin: auto;"
              v-if="props.item.severity === alertStatus.warning"
              class="cortx-status-chip cortx-chip-warning"
              title="warning"
            ></div>
            <div
              style="margin: auto;"
              v-else-if="props.item.severity ===alertStatus.critical || props.item.severity === alertStatus.error"
              class="cortx-status-chip cortx-chip-alert"
              v-bind:title="props.item.severity"
            ></div>
            <div
              style="margin: auto;"
              v-else-if="props.item.severity ===alertStatus.warning"
              class="cortx-status-chip cortx-chip-warning"
              title="warning"
            ></div>
            <div
              style="margin: auto;"
              v-if="props.item.severity === alertStatus.informational"
              class="cortx-status-chip cortx-chip-information"
              title="info"
            ></div>
             <div
              style="margin: auto;"
              v-if="(props.item.severity !== alertStatus.informational) 
              && (props.item.severity !== alertStatus.warning)
              && (props.item.severity !== alertStatus.critical && props.item.severity !== alertStatus.error)"
              title="other"
              class="cortx-status-chip cortx-chip-others"
            ></div>
          </td>
          <td v-cortx-alert-tbl-description="props.item"></td>
          <td>
            <img
              :src="require('@/assets/zoom-in.svg')"
              class="cortx-cursor-pointer"
              @click="$router.push('/alerts_history/' + props.item.alert_uuid)"
            />
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";
import AlertsMixin from "./../../mixins/alerts";
import CortxHealthSummary from "../system/health-summary.vue";
import { Api } from "./../../services/api";
import apiRegister from "./../../services/api-register";
import { AlertQueryParam, AlertObject } from "./../../models/alert";
import { alertTblDescriptionDirective } from "./alert-description-directive";

@Component({
  name: "cortx-alert-occurrences",
  directives: { "cortx-alert-tbl-description": alertTblDescriptionDirective }
})
export default class CortxAlertOccurrences extends Vue {
  public alertObject: AlertObject = {} as AlertObject;
  public hidePagination: boolean = true;
  public alertOccurrencesTableHeaders: any = [];
  public itemsPerPage: number = 200;
  public currentPage: number = 1;
  @Prop({ required: true })
  public sensor_info: string;
  public sortInfo: any = {
    header: "created_time",
    sort_dir: "desc"
  };

  public async mounted() {
    this.onSortPaginate();
    // Set Alert table default header options
    this.alertOccurrencesTableHeaders = [
      {
        text: "Time",
        value: "created_time",
        sortable: true,
        sortDir: "desc"
      },
      {
        text: "Alert target",
        value: "alertTarget",
        sortable: false
      },
      {
        text: "Severity",
        value: "severity",
        sortable: true
      },
      {
        text: "Description",
        value: "description",
        sortable: false
      }
    ];
    // Call action to get all alert data
    // await this.onSortPaginate();
  }
  // Column sort handler
  public async onSortPaginate() {
    const alertQueryParam: AlertQueryParam = {} as AlertQueryParam;
    const sortInfo = this.$store.getters["alerts/getSortInfo"];
    alertQueryParam.sortby = sortInfo.header;
    alertQueryParam.dir = sortInfo.sort_dir;
    alertQueryParam.offset = this.currentPage;
    alertQueryParam.limit = this.itemsPerPage;
    alertQueryParam.sensor_info = this.sensor_info;

    this.$store.dispatch("systemConfig/showLoader", "Fetching alerts...");
    const res = await Api.getAll(apiRegister.alerts_history, alertQueryParam);
    if (res && res.data) {
      this.alertObject = res.data;
      if (this.alertObject.total_records > 200) {
        this.hidePagination = false;
      }
    }
    this.$store.dispatch("systemConfig/hideLoader");
  }
  public async onSort(header: any) {
    if (header.sortable) {
      if (this.sortInfo.header === header) {
        this.sortInfo.sort_dir =
          this.sortInfo.sort_dir === "asc" ? "desc" : "asc";
      } else {
        this.sortInfo.header = header;
        this.sortInfo.sort_dir = "asc";
      }
      this.onSortPaginate();
    }
  }
  public data() {
    return {
      alertStatus: require("./../../common/const-string.json")
    };
  }
}
</script>
<style lang="scss" scoped>
</style>
