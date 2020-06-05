/*****************************************************************************
 Filename:          alert-large.vue
 Description:       Alert Large Component

 Creation Date:     30/08/2019
 Author:            Piyush Gupte

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <div class="eos-p-2">
    <eos-tabs :tabsInfo="tabsInfo" />
    <eos-has-access
      :to="$eosUserPermissions.alerts + $eosUserPermissions.update"
    >
    <div class="mt-3" id="lblDnsMsg" v-if="tabsInfo.selectedTab === 1">
     All the alerts which are generated, by default are displayed under New Alerts.
    </div> 
     <div class="mt-3" id="lblDnsMsg" v-if="tabsInfo.selectedTab === 2">
       Displays alerts which are either acknowledged or resolved.
    </div> 
     <div class="mt-3" id="lblDnsMsg" v-if="tabsInfo.selectedTab === 3">
       Displays alerts which are both, acknowledged and resolved.
    </div> 

      <button
        type="button"
        class="mt-3 mb-2 eos-btn-primary"
        v-if="tabsInfo.selectedTab === 1"
        @click="showConfirmationDialog = true"
        :disabled="alertObject.alerts.length === 0"
      >
        Acknowledge all
      </button>
    </eos-has-access>
    <v-data-table
      calculate-widths
      :items="alertObject.alerts"
      item-key="created_time"
      class="eos-table"
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
              header.sortable ? 'eos-cursor-pointer' : ''
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
          <td style="white-space: nowrap;">
            {{ new Date(props.item.created_time * 1000) | timeago }}
          </td>
          <td>
            <div>
              <span
                >Resource type: {{ props.item.module_name }} | State:
                {{ props.item.state }}</span
              >
            </div>
            <div>
              <span v-if="props.item.module_type === 'logical_volume'"
                >Volume group: {{ props.item.volume_group }} | Volume name:
                {{ props.item.name }}</span
              >
              <span v-else-if="props.item.module_type === 'system'"
                >Version: {{ props.item.version }} | Nodename:
                {{ props.item.name }}</span
              >
              <span v-else-if="props.item.module_type === 'volume'"
                >Size: {{ props.item.volume_size }} | Total size:
                {{ props.item.volume_total_size }}</span
              >
              <span v-else-if="props.item.module_type === 'current'"
                >Sensor name: {{ props.item.name }}</span
              >
              <span v-else-if="props.item.module_name === 'enclosure:fru:psu'"
                >Location: {{ props.item.location }}</span
              >
              <span
                v-else-if="
                  props.item.module_name === 'enclosure:fru:fan' ||
                    props.item.module_type === 'enclosure:fru:sideplane'
                "
                >Name: {{ props.item.name }} | Location:
                {{ props.item.location }}</span
              >
              <span v-else-if="props.item.module_name === 'enclosure:fru:disk'"
                >Serial number: {{ props.item.serial_number }} | Size:
                {{ props.item.volume_size }}</span
              >
              <span v-else-if="props.item.module_type === 'controller'"
                >Serial number: {{ props.item.serial_number }}</span
              >
              <div>
              <span v-if="props.item.module_type === 'iem'"
                >Source Id : {{ props.item.source_id  }} | Component Id: {{ props.item.component_id }} | Module Id:{{ props.item.module_id }} </span
              ></div>
            </div>
          </td>
          <td>
            <div
              style="margin: auto;"
              v-if="
                props.item.severity === alertStatus.critical ||
                  props.item.severity === alertStatus.error
              "
              v-bind:title="props.item.severity"
              class="eos-status-chip eos-chip-alert"
            ></div>
            <div
              style="margin: auto;"
              title="warning"
              v-else-if="props.item.severity === alertStatus.warning"
              class="eos-status-chip eos-chip-warning"
            ></div>
            <div
              style="margin: auto;"
              v-if="props.item.severity === alertStatus.informational"
              title="info"
              class="eos-status-chip eos-chip-information"
            ></div>
             <div
              style="margin: auto;"
              v-if="(props.item.severity !== alertStatus.informational) 
              && (props.item.severity !== alertStatus.warning)
              && (props.item.severity !== alertStatus.critical && props.item.severity !== alertStatus.error)"
              title="other"
              class="eos-status-chip eos-chip-others"
            ></div>
          </td>
          <td>{{ props.item.description ? props.item.description : "--" }}</td>
          <td>
            <img
              :src="require('@/assets/zoom-in.svg')"
              class="eos-cursor-pointer"
              @click="$router.push('/alerts/' + props.item.alert_uuid)"
            />
            <eos-has-access
              :to="$eosUserPermissions.alerts + $eosUserPermissions.update"
            >
              <img
                v-if="!(props.item.acknowledged && props.item.resolved)"
                :src="require('@/assets/comment-filled-default.svg')"
                class="eos-cursor-pointer"
                @click="showAlertCommentsDialog(props.item.alert_uuid)"
              />
            </eos-has-access>
            <img
              v-if="props.item.acknowledged"
              :src="require('@/assets/acknowledge-default.svg')"
            />
            <img
              v-if="props.item.resolved"
              :src="require('@/assets/resolved-filled-default.svg')"
            />
          </td>
        </tr>
      </template>
    </v-data-table>
    <eos-alert-comments
      v-model="isShowCommentsDialog"
      :alertId="alertIdForComments"
    />
    <eos-confirmation-dialog
      :show="showConfirmationDialog"
      title="Confirmation"
      message="Are you sure you want to acknowledge all alerts?"
      severity="warning"
      @closeDialog="closeConfirmationDialog"
      cancelButtonText="No"
    ></eos-confirmation-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";
import AlertsMixin from "./../../mixins/alerts";
import EosTabs, { TabsInfo } from "./../widgets/eos-tabs.vue";
import EosAlertComments from "./alert-comments.vue";

@Component({
  name: "eos-alert-large",
  components: { EosTabs, EosAlertComments }
})
export default class EosAlertLarge extends Mixins(AlertsMixin) {
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
.eos-audit-log-switch-container {
  height: 34px;
}
.eos-audit-log-switch {
  margin: 2px 5px 0px 0px;
}
</style>
