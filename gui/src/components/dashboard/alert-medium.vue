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
  <v-card class="my-5" width="60%" tile>
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
            class="ml-4 ma-auto py-0 text-center caption font-weight-medium"
          >SYSTEM HEALTH</v-card-text>
          <v-row class="ml-n1">
            <v-col>
              <v-img class="mr-n12" height="20" width="20" src="@/assets/status/degraded.png" />
            </v-col>
            <v-col>
              <v-card-text class="ml-n1 mt-n4">Degraded</v-card-text>
            </v-col>
          </v-row>
        </v-card>
        <v-divider vertical class="mx-4"></v-divider>
        <v-card height="6em" class="mx-auto pa-0 col-3 elevation-0" tile>
          <v-card-text
            class="ma-auto py-0 text-center caption font-weight-medium"
          >UNHEALTHY COMPONENTS</v-card-text>
          <v-card-text class="ma-auto py-1 display-1" align="center" justify="center">1</v-card-text>
        </v-card>
        <v-divider vertical class="mx-4"></v-divider>
        <v-card height="6em" class="mx-auto pa-0 col-3 elevation-0" tile>
          <v-card-text
            class="ma-auto py-0 text-center caption font-weight-medium"
          >ALERTS TO ACKNOWLEDGE</v-card-text>
          <v-card-text class="ma-auto py-1 display-1" align="center" justify="center">1</v-card-text>
        </v-card>
      </v-row>
    </v-container>
    <v-data-table
      calculate-widths
      :items="alertData.alerts"
      item-key="created_time"
      :items-per-page="5"
      :server-items-length="totalRecordsCount"
      hide-default-header
    >
      <template v-slot:header="{props}">
        <th
          v-for="header in alertHeader"
          :key="header.text"
          class="tableheader text-capitalize font-weight-medium grey lighten-5 text--black pt-2"
          @click="onSort(header.value, header, props.options.page, props.options.itemsPerPage)"
        >
          {{ header.text }}
          <img
            v-if="header.sortable && header.sortDir === 'desc'"
            src="./../../assets/caret-green-down.png"
          />
          <img
            v-if="header.sortable && header.sortDir === 'asc'"
            src="./../../assets/caret-green-up.png"
          />
        </th>
      </template>
      <template v-slot:item="props">
        <tr class="font-weight-medium">
          <td>{{props.item.created_time}}</td>
          <td>
            <v-img
              height="20"
              v-if="props.item.state=='missing'"
              width="20"
              src="./../../assets/status/critical-icon.png"
            />
            <v-img
              height="20"
              v-if="props.item.state=='fault'"
              width="20"
              src="./../../assets/status/error-fault.png"
            />
            <v-img
              height="20"
              v-if="props.item.state=='insertion' || item.state=='fault resolved'"
              width="20"
              src="./../../assets/status/healthy-icon.png"
            />
          </td>
          <td>
            <div>{{props.item.location}}</div>
            <div>State:{{props.item.state}}</div>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import store from "./../../store/store";

@Component({
  name: "eos-alert-medium"
})
export default class EosAlertMedium extends Vue {
  public mounted() {
    // Call action to get all alert data
    this.$store.dispatch("alerts/alertDataAction");

    // Set Alert table default header options
    const header = [
      {
        text: "Active Time",
        align: "left",
        value: "created_time",
        class: "grey lighten-2",
        sortable: true,
        sortDir: "desc"
      },
      {
        text: "Alert Severity",
        value: "severity",
        align: "left",
        class: "grey lighten-2",
        sortable: true,
        sortDir: "desc"
      },
      {
        text: "Component",
        value: "component",
        class: "grey lighten-2",
        align: "right",
        sortable: false
      }
    ];
    // Mutate header data in store
    this.$store.commit("alerts/alertHeaderMutation", header);
  }

  // Column sort handler
  public onSort(
    sortby: string,
    sortedHeader: any,
    offset: number,
    limit: number
  ) {
    // Check if current column is sortable
    if (!sortedHeader.sortable) {
      return;
    }
    // Create query parameter for API request
    const queryParams = {
      sortby,
      dir: sortedHeader.sortDir,
      offset,
      limit
    };

    // Change sort direction in alertHeader data for current selected/sorted column
    for (const header of this.alertHeader) {
      if (header.value === sortby) {
        header.sortDir = sortedHeader.sortDir === "desc" ? "asc" : "desc";
      }
    }
    // Update alert header data set with updated sort direction
    this.$store.commit("alerts/alertHeaderMutation", this.alertHeader);
    this.$store.dispatch("alerts/alertDataAction", queryParams);
  }

  private data() {
    return {};
  }

  // Get total_records from alert API
  get totalRecordsCount() {
    return this.$store.getters["alerts/alertTotalRecordCount"];
  }
  // Get the header data from store
  get alertHeader() {
    return this.$store.getters["alerts/alertHeader"];
  }
  // Get all alerts from API
  get alertData() {
    return this.$store.getters["alerts/alertData"];
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
}
</style>
