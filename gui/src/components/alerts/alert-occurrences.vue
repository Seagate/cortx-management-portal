/*****************************************************************************
 Filename:          alert-occurrences.vue
 Description:       Alert Occurrences Component

 Creation Date:     2/3/2020
 Author:            Jayshree .A. More

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
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
        :hide-default-footer="hidePagination"
        @update:items-per-page="onSortPaginate()"
        @update:page="onSortPaginate()"
        id="tblAlertMedium"
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
          </tr>
        </template>
      </v-data-table>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";
import AlertsMixin from "./../../mixins/alerts";
import EosHealthSummary from "../system/health-summary.vue";
import { Api } from "./../../services/api";
import apiRegister from "./../../services/api-register";
import { AlertQueryParam, AlertObject } from "./../../models/alert";
@Component({
  name: "eos-alert-occurrences",
  components: { }
})
export default class EosAlertOccurrences  extends  Mixins(AlertsMixin) {
  public alert_page_filter: string = "new";
  public items_per_page: number = 200;
  public current_page: number = 1;
  public sort_info: any = {
    header: "created_time",
    sort_dir: "desc"
  };
    public resetAlertQueryParams() {
    this.items_per_page = 200;
    this.current_page = 1;
    this.sort_info = {
      header: "created_time",
      sort_dir: "desc"
    };
  }
     public async mounted() {
         this.resetAlertQueryParams;
         
    if (this.alertPageFilter !== "new") {
      this.alertPageFilter = "new";
      this.$store.commit("alerts/resetAlertQueryParams");
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
    // await this.onSortPaginate();
  }
   // Column sort handler
  public async onSortPaginate() {
    const alertQueryParam: AlertQueryParam = {} as AlertQueryParam;

    // switch (this.alertPageFilter) {
    //   case "new":
    //     alertQueryParam.acknowledged = false;
    //     alertQueryParam.resolved = false;
    //     break;
    //   case "active":
    //     alertQueryParam.show_active = true;
    //     break;
    //   case "history":
    //     alertQueryParam.acknowledged = true;
    //     alertQueryParam.resolved = true;
    //     alertQueryParam.show_all = true;
    //     break;
    // }
 
    alertQueryParam.sortby = this.$data.sortInfo.header;
    alertQueryParam.dir = this.$data.sortInfo.sort_dir;
    alertQueryParam.offset = this.currentPage;
    alertQueryParam.limit = this.itemsPerPage;

    this.$store.dispatch(
      "systemConfig/showLoader",
      "Fetching alerts..."
    );

    const res = await Api.getAll(apiRegister.all_alerts, alertQueryParam);
    if (res && res.data) {
      this.alertObject = res.data;
      if (this.alertObject.total_records > 200) {
        this.hidePagination = false;
      }
    }
    this.$store.dispatch("systemConfig/hideLoader");
  }


//   get sortInfo() {
//     return this.$store.getters["alerts/getSortInfo"];
//   }

  public data() {
    return {
      alertStatus: require("./../../common/const-string.json")
    };
  } 
}
</script>
<style lang="scss" scoped>
</style>
