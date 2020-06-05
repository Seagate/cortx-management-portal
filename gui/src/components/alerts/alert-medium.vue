/*****************************************************************************
 Filename:          alert-medium.vue
 Description:       Alert Medium Component

 Creation Date:     30/08/2019
 Author:            Sanjeevan Bhave

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <div id="alertMediumContainer">
    <eos-health-summary />
    <div style="height: 30px;">
      <div class="eos-alert-title">New alerts</div>
      <img
        :src="require('@/assets/zoom-in.svg')"
        class="eos-alert-navigate"
        @click="$router.push('/alerts')"
      />
    </div>
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
                v-if="props.item.severity ===alertStatus.critical || props.item.severity === alertStatus.error"
                v-bind:title="props.item.severity"
                class="eos-status-chip eos-chip-alert"
              ></div>
              <div
                style="margin: auto;"
                v-else-if="props.item.severity === alertStatus.warning"
                title="warning"
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
            <td>{{props.item.description ? props.item.description : "--"}}</td>
          </tr>
        </template>
      </v-data-table>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";
import AlertsMixin from "./../../mixins/alerts";
import EosHealthSummary from "../system/health-summary.vue";

@Component({
  name: "eos-alert-medium",
  components: { EosHealthSummary }
})
export default class EosAlertMedium extends Mixins(AlertsMixin) {
  public async mounted() {
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
    await this.onSortPaginate();
  }

  get sortInfo() {
    return this.$store.getters["alerts/getSortInfo"];
  }

  public data() {
    return {
      alertStatus: require("./../../common/const-string.json")
    };
  }
}
</script>
<style lang="scss" scoped>
.eos-alert-title {
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.87);
  float: left;
}
.eos-alert-navigate {
  float: right;
  cursor: pointer;
}
@media screen and (min-height: 600px) {
  #alertMediumContainer {
    padding-left: 20px;
  }
}
@media screen and (min-height: 900px) {
  #alertMediumContainer {
    padding: 20px;
  }
}
</style>
