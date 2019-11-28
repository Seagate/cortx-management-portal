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
  <v-card class="elevation-0 mediumAlert pa-0 ma-0" tile>
    <v-system-bar height="40em">
      <span id="title" class="text-uppercase font-weight-medium text--black">ALERTS</span>
      <v-spacer></v-spacer>
      <router-link :to="'alertlarge'">
        <img src="@/assets/widget/view-slideover-off.png" id="navLargeMode" style />
      </router-link>
    </v-system-bar>

    <v-container>
      <v-row>
        <v-card height="6em" align="center" class="mx-auto col-3 elevation-0" tile>
          <v-card-text
            class="ml-0 ma-auto py-0 text-center caption font-weight-bold col-12"
          >SYSTEM HEALTH</v-card-text>
          <v-row class="ma-auto pt-0 text-center col-12">
            <div class="col-12">
              <v-img
                class="d-inline-block"
                height="16"
                width="16"
                src="@/assets/status/healthy-icon.png"
              />
              <div class="pl-2 d-inline-block">Healthy</div>
            </div>
          </v-row>
        </v-card>
        <v-divider vertical class="mx-4"></v-divider>
        <v-card height="6em" class="mx-auto pa-0 col-3 elevation-0" tile>
          <v-card-text
            class="ma-auto py-0 text-center caption font-weight-bold pt-2"
          >UNHEALTHY COMPONENTS</v-card-text>
          <v-card-text class="ma-auto py-1 display-1 pt-3" align="center" justify="center">0</v-card-text>
        </v-card>
        <v-divider vertical class="mx-4"></v-divider>
        <v-card height="6em" class="mx-auto pa-0 col-3 elevation-0" tile>
          <v-card-text
            class="ma-auto py-0 text-center caption font-weight-bold pt-2"
          >ALERTS TO ACKNOWLEDGE</v-card-text>
          <v-card-text class="ma-auto py-1 display-1 pt-3" align="center" justify="center">0</v-card-text>
        </v-card>
      </v-row>
    </v-container>
    <v-data-table
      calculate-widths
      :items="alertData"
      item-key="created_time"
      height="147"
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
        <th
          v-for="header in alertHeader"
          :key="header.text"
          class="tableheader text-capitalize font-weight-medium text--black"
          @click="onSortPaginate(header.value, header, props.options.page, props.options.itemsPerPage)"
        >
          <span
            class="headerText"
            :class="(header.value === sortColumnName && isSortActive) ? 'active' : ''"
          >{{ header.text }}</span>
          <span :class="(header.value === sortColumnName && isSortActive) ? 'active' : 'notActive'">
            <img
              v-if="header.sortable && header.sortDir === alertStatus.desc"
              src="./../../assets/table-caret-green-down.png"
            />
            <img
              v-if="header.sortable && header.sortDir === alertStatus.asc"
              src="./../../assets/table-caret-green-up.png"
            />
          </span>
        </th>
      </template>
      <template v-slot:item="props">
        <tr class="font-weight-small">
          <td>{{ new Date(props.item.created_time*1000) | timeago}}</td>
          <td>
            <v-img
              height="20"
              v-if="props.item.severity===alertStatus.critical "
              width="20"
              class="ml-2"
              src="./../../assets/status/error-fault.png"
            />
            <v-img
              height="20"
              v-if="props.item.severity=== alertStatus.error"
              width="20"
              class="ml-2"
              src="./../../assets/status/warning.png"
            />
            <v-img
              height="20"
              v-if="props.item.severity=== alertStatus.warning"
              width="20"
              class="ml-2"
              src="./../../assets/status/degraded.png"
            />
            <v-img
              height="20"
              v-if="props.item.severity=== alertStatus.informational"
              width="20"
              class="ml-2"
              src="./../../assets/status/info-alert.png"
            />
          </td>
          <td>
            <div v-if="props.item.location">Location: {{props.item.location}}</div>
            <div>
              <label v-if="props.item.state">State: {{props.item.state}}</label>
              <label v-if="props.item.state && props.item.module_name">,&nbsp;</label>
              <label v-if="props.item.module_name">Resource Type: {{props.item.module_name}}</label>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
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
    this.$store.dispatch("alerts/alertDataAction");
    this.$store.commit("alerts/setOnboardingFlag", true);
    // Set Alert table default header options
    const headers = [
      {
        text: "Active Time",
        value: "created_time",
        sortable: true,
        sortDir: "desc"
      },
      {
        text: "Alert Severity",
        value: "severity",
        sortable: true,
        sortDir: "desc"
      },
      {
        text: "Component",
        value: "component",
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
#navLargeMode {
  height: 1.4em;
  width: 1.4em;
}
#title {
  color: black;
}
.tableheader {
  height: 2.5em;
  background-color: #e3e3e3;
  border-top: 1px solid whitesmoke;
  padding-top: 0.5em;
}
.active {
  display: inline-block;
  color: green !important;
}
.notActive {
  opacity: 0;
}
.headerText {
  color: black;
}
.tableheader:hover {
  .notActive {
    opacity: 1;
  }
}
.mediumAlert {
  border: 2px solid #e3e3e3 !important;
}
tbody tr {
  background-color: #ebf1e9 !important ;
}
tbody tr:hover {
  border-top: 2px solid darkgray !important;
  border-bottom: 2px solid darkgray !important;
}
</style>
