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
  <div class="pa-5">
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
        :items="alertData"
        item-key="created_time"
        height="250"
        :items-per-page.sync="itemsPerPage"
        :footer-props="{
        'items-per-page-options': [5, 10, 15]
        }"
        :page.sync="page"
        :update:page="page"
        :server-items-length="totalRecordsCount"
        hide-default-header
        @update:items-per-page="onSortPaginate(null, null, page, itemsPerPage)"
        @update:page="onSortPaginate(null, null, page, itemsPerPage)"
        id="tblAlertMedium"
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
          </tr>
        </template>
        <template v-slot:item="props">
          <tr style="color: #000000;">
            <td style="white-space: nowrap;">{{ new Date(props.item.created_time*1000) | timeago }}</td>
            <td style="white-space: nowrap;">
              <span >{{ props.item.module_type + " | " + props.item.state }}</span>
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
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";
import AlertsMixin from "./../../mixins/alerts";

@Component({
  name: "eos-alert-medium"
})
export default class EosAlertMedium extends Mixins(AlertsMixin) {
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
        text: "Alert target",
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
      isSortActive: false, // Set table column sorting flag to default inactive
      sortColumnName: "", // Set sorting column name to none
      alertStatus: require("./../../common/const-string.json"),
      rowsPerPageItems: [5, 10, 15]
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
</style>
