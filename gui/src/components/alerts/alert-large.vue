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
  <div class="cortx-p-1">
    <cortx-tabs :tabsInfo="tabsInfo" />
    <cortx-has-access
      :to="$cortxUserPermissions.alerts + $cortxUserPermissions.update"
    >
    <div class="mt-3" id="lblDnsMsg" v-if="tabsInfo.selectedTab === 1">
      {{ $t("alerts.alertsByDefault") }}
    </div> 
    <div class="mt-3" id="lblDnsMsg" v-if="tabsInfo.selectedTab === 2">
      {{ $t("alerts.displayAcknowledgedOrResolved") }}
    </div>
    <div class="mt-3" id="lblDnsMsg" v-if="tabsInfo.selectedTab === 3">
      {{ $t("alerts.displayAcknowledgedAndResolved") }}
    </div> 

      <button id="alert-acknowlegeall"
        type="button"
        class="mt-3 mb-2 cortx-btn-primary"
        v-if="tabsInfo.selectedTab === 1"
        @click="showConfirmationDialog = true"
        :disabled="alertObject.alerts.length === 0"
      >
        {{ $t("alerts.acknowledgeAll") }}
      </button>
    </cortx-has-access>
    <v-data-table
      calculate-widths
      :items="alertObject.alerts"
      item-key="updated_time"
      class="cortx-table"
      :items-per-page.sync="itemsPerPage"
      :footer-props="{
        'items-per-page-options': [50, 100, 150, 200]
      }"
      :page.sync="currentPage"
      :update:page="currentPage"
      :server-items-length="alertObject.total_records"
      hide-default-header
      :hide-default-footer="hidePagination"
      @update:items-per-page="onSortPaginate()"
      @update:page="onSortPaginate()"
      id="tblAlertLarge"
    >
      <template v-slot:header="{}">
        <tr>
          <th
            v-for="header in alertTableHeaders"
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
          <th class="tableheader" style="min-width: 90px;">{{ $t("alerts.action") }}</th>
        </tr>
      </template>
      <template v-slot:item="props">
        <tr style="color: #000000;">
          <td style="white-space: nowrap;">
            {{ new Date(props.item.updated_time * 1000) | timeago }}
          </td>
          <td style="white-space: nowrap;">
            <div>
              <span>{{ $t("alerts.resourceType") }}: {{ props.item.module_name }}</span><br />
              <span>{{ $t("alerts.resourceId") }}: {{ props.item.resource_id }} | {{ $t("alerts.state") }}: {{ props.item.state }}</span><br />
              <span>{{ $t("alerts.host_name") }}: {{ props.item.hostname }}</span>
            </div>
            <div>
              <span v-if="props.item.module_type === 'logical_volume'"
                >{{ $t("alerts.volumeGroup") }}: {{ props.item.volume_group }} | {{ $t("alerts.volumeName") }}:
                {{ props.item.name }}</span
              >
              <span v-else-if="props.item.module_type === 'system'"
                >{{ $t("alerts.version") }}: {{ props.item.version }} | {{ $t("alerts.nodeName") }}:
                {{ props.item.name }}</span
              >
              <span v-else-if="props.item.module_type === 'volume'"
                >{{ $t("alerts.size") }}: {{ props.item.volume_size }} | {{ $t("alerts.totalSize") }}:
                {{ props.item.volume_total_size }}</span
              >
              <span v-else-if="props.item.module_type === 'current'"
                >{{ $t("alerts.sensorName") }}: {{ props.item.name }}</span
              >
              <span v-else-if="props.item.module_name === 'enclosure:fru:psu'"
                >{{ $t("alerts.location") }}: {{ props.item.location }}</span
              >
              <span
                v-else-if="
                  props.item.module_name === 'enclosure:fru:fan' ||
                    props.item.module_type === 'enclosure:fru:sideplane'
                "
                >{{ $t("common.name") }}: {{ props.item.name }} | {{ $t("alerts.location") }}:
                {{ props.item.location }}</span
              >
              <span v-else-if="props.item.module_name === 'enclosure:fru:disk'"
                >{{ $t("alerts.serialNumber") }}: {{ props.item.serial_number }} | {{ $t("alerts.size") }}:
                {{ props.item.volume_size }}</span
              >
              <span v-else-if="props.item.module_type === 'controller'"
                >{{ $t("alerts.serialNumber") }}: {{ props.item.serial_number }}</span
              >
              <div>
              <span v-if="props.item.module_type === 'iem'"
                >{{ $t("alerts.source") }}: {{ props.item.source  }} | {{ $t("alerts.component") }}: {{ props.item.component }} | {{ $t("alerts.module") }}: {{ props.item.module }} </span
              ></div>
            </div>
          </td>
          <td>
            <div
              style="margin: auto;"
              :title="props.item.severity"
              :class="getAlertSeverityStyleClass(props.item.severity)"
            ></div>
          </td>
          <td v-cortx-alert-tbl-description="props.item"></td>
          <td style="min-width: 8.4em;">
            <v-tooltip left>
              <template v-slot:activator="{ on, attrs }">
                <img
                  :src="require('@/assets/zoom-in.svg')"
                  class="cortx-float-l cortx-cursor-pointer"
                  v-bind="attrs"
                  v-on="on"
                  @click="$router.push('/alerts/' + props.item.alert_uuid)"
                />
              </template>
              <span>{{ $t("alerts.goToDetailsPage") }}</span>
            </v-tooltip>
            <div v-if="!(props.item.acknowledged && props.item.resolved)" class="cortx-float-l">
                <v-tooltip left>
                  <template v-slot:activator="{ on, attrs }">
                    <div
                      class="cortx-icon-btn cortx-comment-icon"
                      v-bind="attrs"
                      v-on="on"
                      @click="showAlertCommentsDialog(props.item.alert_uuid)">
                    </div>
                  </template>
                  <span>{{ $t("alerts.addComments") }}</span>
                </v-tooltip>
                <cortx-has-access :to="$cortxUserPermissions.alerts + $cortxUserPermissions.update">
                <v-tooltip left>
                  <template v-slot:activator="{ on, attrs }">
                    <div
                      class="cortx-icon-btn cortx-acknowledge-icon"
                      v-bind="attrs"
                      v-on="on"
                      @click="acknowledgeAlert(props.item)">
                    </div>
                  </template>
                  <span>{{ props.item.acknowledged ? "Unacknowledge alert" : "Acknowledge alert" }}</span>
                </v-tooltip>
                </cortx-has-access>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
    <cortx-alert-comments
      v-model="isShowCommentsDialog"
      :alertId="alertIdForComments"
    />
    <cortx-confirmation-dialog
      :show="showConfirmationDialog"
      title="Confirmation"
      message="Are you sure you want to acknowledge all alerts?"
      severity="warning"
      @closeDialog="closeConfirmationDialog"
      cancelButtonText="No"
      id="alrtlarge-conirmationbox"
    ></cortx-confirmation-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";
import AlertsMixin from "./../../mixins/alerts";
import CortxTabs, { TabsInfo } from "./../widgets/cortx-tabs.vue";
import CortxAlertComments from "./alert-comments.vue";
import { alertTblDescriptionDirective } from "./alert-description-directive";
import i18n from "./alert.json";

@Component({
  name: "cortx-alert-large",
  components: { CortxTabs, CortxAlertComments },
  directives: { "cortx-alert-tbl-description": alertTblDescriptionDirective },
  i18n: {
    messages: i18n
  }
})
export default class CortxAlertLarge extends Mixins(AlertsMixin) {
  public isShowCommentsDialog: boolean = false;
  public alertIdForComments: string = "";
  public showConfirmationDialog: boolean = false;
  public tabsInfo: TabsInfo = {
    tabs: [
      { id: 1, label: "New alerts", show: true },
      { id: 2, label: "Active alerts", show: true },
      { id: 3, label: "Alert history", show: true }
    ],
    selectedTab: 1
  };

  @Watch("tabsInfo.selectedTab")
  public onPropertyChanged(value: number, oldValue: number) {
    switch (value) {
      case 1:
        this.alertPageFilter = "new";
        break;
      case 2:
        this.alertPageFilter = "active";
        break;
      case 3:
        this.alertPageFilter = "history";
        break;
    }
    this.$store.commit("alerts/resetAlertQueryParams");
    this.onSortPaginate();
  }

  public mounted() {
    switch (this.alertPageFilter) {
      case "new":
        this.tabsInfo.selectedTab = 1;
        break;
      case "active":
        this.tabsInfo.selectedTab = 2;
        break;
      case "history":
        this.tabsInfo.selectedTab = 3;
        break;
    }
    // Set Alert table default header options
    this.alertTableHeaders = [
      {
        text: "Updated time",
        value: "updated_time",
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
    this.onSortPaginate();
  }

  get sortInfo() {
    return this.$store.getters["alerts/getSortInfo"];
  }

  public data() {
    return {
      alertStatus: require("./../../common/const-string.json")
    };
  }

  public showAlertCommentsDialog(alertId: string) {
    this.alertIdForComments = alertId;
    this.isShowCommentsDialog = true;
  }

  public async closeConfirmationDialog(confirmation: boolean) {
    this.showConfirmationDialog = false;
    if (confirmation) {
      await this.acknowledgeAll();
      this.$store.dispatch("alertDataAction");
    }
  }

  @Watch("$route.query.tm")
  public queryParamChangeHandler(id: any) {
    // Call action to get all alert data
    this.onSortPaginate();
  }
}
</script>

<style lang="scss" scoped>
.cortx-audit-log-switch-container {
  height: 34px;
}
.cortx-audit-log-switch {
  margin: 2px 5px 0px 0px;
}
</style>
