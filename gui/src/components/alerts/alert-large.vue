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
    <button type="button" class="mt-3 mb-2 eos-btn-primary" v-if="tabsInfo.selectedTab === 1">Acknowledge All</button>
    <v-data-table
      calculate-widths
      :items="alertData"
      :single-expand="singleExpand"
      item-key="created_time"
      show-expand
      class="mt-2 eos-table"
      :items-per-page.sync="itemsPerPage"
      :footer-props="{
        'items-per-page-options': [5, 10, 15]
        }"
      :page.sync="page"
      :update:page="page"
      :server-items-length="totalRecordsCount"
      hide-default-header
      @update:items-per-page="onSortPaginate('', null, page, itemsPerPage)"
      @update:page="onSortPaginate('', null, page, itemsPerPage)"
    >
      <template v-slot:header="{props}">
        <tr>
          <th
            v-for="header in alertHeader"
            :key="header.text"
            class="tableheader"
            @click="onSortPaginate(header.value, header, props.options.page, props.options.itemsPerPage)"
          >
            <span
              class="headerText"
              :class="(header.value === sortColumnName && isSortActive) ? 'active' : ''"
            >{{ header.text }}</span>
            <span
              :class="(header.value === sortColumnName && isSortActive) ? 'active' : 'notActive'"
            >
              <img
                v-if="header.sortable && header.sortDir === alertStatus.desc"
                :src="require('@/assets/widget/table-sort-desc.svg/')"
                class="d-inline-block"
                style="vertical-align: bottom; margin-left: -0.3em;"
                height="20"
                width="20"
              />
              <img
                v-if="header.sortable && header.sortDir === alertStatus.asc"
                :src="require('@/assets/widget/table-sort-asc.svg/')"
                class="d-inline-block"
                style="vertical-align: bottom; margin-left: -0.3em;"
                height="20"
                width="20"
              />
            </span>
          </th>
          <th class="tableheader"></th>
        </tr>
      </template>
      <template v-slot:item="props">
        <tr style="color: #000000;">
          <td style="white-space: nowrap;">{{ new Date(props.item.created_time*1000) | timeago }}</td>
          <td>
            <div>
              <span>Resource Type: {{ props.item.module_name }} | State: {{ props.item.state }}</span>
            </div>
            <div>
              <span v-if="props.item.module_type === 'logical_volume'">Volume Group: {{ props.item.volume_group }} | Volume Name: {{ props.item.name }}</span>
              <span v-else-if="props.item.module_type === 'system'">Version: {{ props.item.version }} | Nodename: {{ props.item.name }}</span>
              <span v-else-if="props.item.module_type === 'volume'">Size: {{ props.item.volume_size }} | Total Size: {{ props.item.volume_total_size }}</span>
              <span v-else-if="props.item.module_type === 'current'">Sensor Name: {{ props.item.name }}</span>
              <span v-else-if="props.item.module_type === 'psu'">Location: {{ props.item.location }}</span>
              <span v-else-if="props.item.module_type === 'fan' || props.item.module_type === 'sideplane'">Name: {{ props.item.name }} | Location: {{ props.item.location }}</span>
              <span v-else-if="props.item.module_type === 'disk'">Serial Number: {{ props.item.serial_number }} | Size: {{ props.item.volume_size }}</span>
              <span v-else-if="props.item.module_type === 'controller'">Serial Number: {{ props.item.serial_number }}</span>
            </div>
          </td>
          <td>
            <div
              style="margin: auto;"
              v-if="props.item.severity === alertStatus.warning"
              class="eos-status-chip eos-chip-offline"
            ></div>
            <div
              style="margin: auto;"
              v-else-if="props.item.severity ===alertStatus.critical || props.item.severity === alertStatus.error"
              class="eos-status-chip eos-chip-alert"
            ></div>
            <div
              style="margin: auto;"
              v-else-if="props.item.severity ===alertStatus.warning"
              class="eos-status-chip eos-chip-warning"
            ></div>
            <div
              style="margin: auto;"
              v-if="props.item.severity === alertStatus.informational"
              class="eos-status-chip eos-chip-ok"
            ></div>
          </td>
          <td>{{props.item.description ? props.item.description : "--"}}</td>
          <td>      
            <img :src="require('@/assets/zoom-in.svg')" style="cursor: pointer;" @click="$router.push('/alerts/' + props.item.alert_uuid)" />
            <img v-if="props.item.resolved" :src="require('@/assets/resolved-filled-default.svg')" />
            <img v-if="props.item.comment" :src="require('@/assets/comment-filled-default.svg')" />
            <img v-if="props.item.acknowledged" :src="require('@/assets/acknowledge-default.svg')" />
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";
import AlertsMixin from "./../../mixins/alerts";
import EosTabs, { TabsInfo } from "./../widgets/eos-tabs.vue";

@Component({
  name: "eos-alert-large",
  components: { EosTabs }
})
export default class EosAlertLarge extends Mixins(AlertsMixin) {
  public alertPageFilter: "new" | "active" = "new";

  public tabsInfo: TabsInfo = {
    tabs: [{ id: 1, label: "New Alerts" }, { id: 2, label: "Active Alerts" }],
    selectedTab: 1
  };

  @Watch("tabsInfo.selectedTab")
  public onPropertyChanged(value: number, oldValue: number) {
    this.alertPageFilter = value === 1 ? "new" : "active";
    this.onSortPaginate("", null, this.page, this.itemsPerPage);
  }

  public mounted() {
    // Call action to get all alert data
    this.onSortPaginate("", null, this.page, this.itemsPerPage);
    this.$store.commit("alerts/setOnboardingFlag", true);
    // Set Alert table default header options
    const headers = [
      {
        text: "Time",
        value: "created_time",
        sortable: true,
        sortDir: "desc"
      },
      {
        text: "Alert Target",
        value: "alertTarget",
        sortable: false
      },
      {
        text: "Severity",
        value: "severity",
        sortable: false
      },
      {
        text: "Description",
        value: "description",
        sortable: false
      }
    ];
    // Mutate header data in store
    this.$store.commit("alerts/alertHeaderMutation", headers);
  }
  public data() {
    return {
      isColaps: false,
      singleExpand: false, // Expande single row property
      isSortActive: false, // Set table column sorting flag to default inactive
      sortColumnName: "", // Set sorting column name to none
      alertStatus: require("./../../common/const-string.json")
    };
  }

  public async acknowledgeAll() {
    this.$store.dispatch("systemConfig/showLoaderMessage", {
      show: true,
      message: "Acknowledging alerts..."
    });
    try {
      await this.$store.dispatch("alerts/acknowledgeAll");
      this.$store.commit("alerts/setPage", 1);
      this.onSortPaginate("", null, this.page, this.itemsPerPage);
    } catch (e) {
        // tslint:disable-next-line: no-console
        console.log(e);
    }
    this.$store.dispatch("systemConfig/showLoaderMessage", {
      show: false,
      message: ""
    });
  }
}
</script>

<style lang="scss" scoped >
</style>
