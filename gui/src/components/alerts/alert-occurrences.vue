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
          <th class="tableheader"></th>
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
              title="warning"
            ></div>
            <div
              style="margin: auto;"
              v-else-if="props.item.severity ===alertStatus.critical || props.item.severity === alertStatus.error"
              class="eos-status-chip eos-chip-alert"
              v-bind:title="props.item.severity"
            ></div>
            <div
              style="margin: auto;"
              v-else-if="props.item.severity ===alertStatus.warning"
              class="eos-status-chip eos-chip-warning"
              title="warning"
            ></div>
            <div
              style="margin: auto;"
              v-if="props.item.severity === alertStatus.informational"
              class="eos-status-chip eos-chip-ok"
              title="info"
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
          <td>{{props.item.description ? props.item.description : "--"}}</td>
          <td>
            <img
              :src="require('@/assets/zoom-in.svg')"
              class="eos-cursor-pointer"
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
import EosHealthSummary from "../system/health-summary.vue";
import { Api } from "./../../services/api";
import apiRegister from "./../../services/api-register";
import { AlertQueryParam, AlertObject } from "./../../models/alert";
@Component({
  name: "eos-alert-occurrences",
  components: {}
})
export default class EosAlertOccurrences extends Vue {
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
