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
  <div>
    <span
      class="green--text ml-5 font-weight-medium text-uppercase backoverview"
      @click="$router.push('/')"
    >
      <v-img height="20" width="20" src="./../../assets/move-back.png" class="backoverviewimg" />
      <span class="pl-2 backoverviewtxt">Back to Overview</span>
    </span>
    <v-card class="ma-5 elevation-0 largeAlert" tile>
      <v-system-bar height="40em">
        <span id="title" class="text-uppercase font-weight-medium text--black">ACTIVE ALERTS</span>
        <v-spacer></v-spacer>
        <!-- <span id="clear">Clear All Alerts</span> -->
      </v-system-bar>
      <v-data-table
        calculate-widths
        :items="alertData"
        :single-expand="singleExpand"
        item-key="created_time"
        show-expand
        class="eos-table"
        :items-per-page.sync="itemsPerPage"
        :page.sync="page"
        :update:page="page"
        :server-items-length="totalRecordsCount"
        hide-default-header
        @update:page="onSortPaginate(null, null, page, itemsPerPage)"
      >
        <template v-slot:header="{props}">
          <tr>
            <th class="tableheader" />
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
              <span
                :class="(header.value === sortColumnName && isSortActive) ? 'active' : 'notActive'"
              >
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
          </tr>
        </template>
        <template v-slot:item="props">
          <tr class="font-weight-small">
            <td @click="onExpand(props)">
              <img v-if="props.isExpanded" src="./../../assets/caret-green-down.png" />
              <img v-if="!props.isExpanded" src="./../../assets/caret-green-right.png" />
            </td>
            <td style="width: 9em;">{{ new Date(props.item.created_time*1000) | timeago }}</td>
            <td>
              <v-img
                height="20"
                v-if="props.item.state===alertStatus.missing || props.item.state === alertStatus.not_installed"
                width="20"
                src="./../../assets/status/critical-icon.png"
              />
              <v-img
                height="20"
                v-if="props.item.state=== alertStatus.fault|| props.item.state == alertStatus.error"
                width="20"
                src="./../../assets/status/error-fault.png"
              />
              <v-img
                height="20"
                v-if="props.item.state===alertStatus.insertion || props.item.state === alertStatus.fault_resolved || props.item.state === alertStatus.up || props.item.state === alertStatus.ok"
                width="20"
                src="./../../assets/status/healthy-icon.png"
              />
            </td>
            <td>
              <div>{{props.item.location}}</div>
              <div>State:{{props.item.state}}</div>
            </td>
            <td style="width: 19em;">{{props.item.description}}</td>
            <td>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-img
                    height="20"
                    width="20"
                    dark
                    v-on="on"
                    v-if="props.item.comment !=='' && props.item.comment !== undefined"
                    src="./../../assets/comment-icon.png"
                  />
                </template>
                <span>{{ props.item.comment}}</span>
              </v-tooltip>
            </td>
            <td>
              <v-img
                height="20"
                width="20"
                v-if="props.item.resolved===1"
                src="./../../assets/status/healthy-icon.png"
              />
            </td>
            <td>
              <v-checkbox
                type="checkbox"
                @change="updateAlert(props.item)"
                v-model="props.item.acknowledged"
                class="mx-2"
              ></v-checkbox>
            </td>
          </tr>
        </template>
        <template v-slot:expanded-item="props">
          <tr class="grey lighten-5">
            <td colspan="8">
              <v-container fluid="fluid">
                <v-row no-gutters>
                  <v-col cols="5">
                    <div class="mx-4">{{props.item.health_recommendation}}</div>
                    <v-btn class="ma-4" tile color="green" dark>Show on System</v-btn>
                  </v-col>
                  <v-col cols="1">
                    <v-divider class="mx-4" vertical></v-divider>
                  </v-col>
                  <v-col cols="4">
                    <div class="my-2">Comments</div>
                    <div>
                      <v-textarea
                        background-color="grey lighten-5"
                        v-model="props.item.comment"
                        maxlength="255"
                        solo
                        name="input-7-4"
                      ></v-textarea>
                    </div>
                  </v-col>
                  <v-col align-self="center" cols="2">
                    <div class="actbtn">
                      <v-row class="mx-3 mt-10">
                        <v-card flat @click="updateAlert(props.item)">
                          <v-img
                            class="mr-1"
                            height="20"
                            width="20"
                            src="./../../assets/apply-icon.png"
                          />
                        </v-card>
                        <v-card @click="clearComment(props.item)" flat>
                          <v-img
                            height="20"
                            click="(props.item)=> props.item.comment=''"
                            width="20"
                            src="./../../assets/cancel-icon.png"
                          />
                        </v-card>
                      </v-row>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";
import AlertsMixin from "./../../mixins/alerts";

@Component({
  name: "eos-alert-large"
})
export default class EosAlertLarge extends Mixins(AlertsMixin) {
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
        text: "Severity",
        value: "state",
        sortable: true,
        sortDir: "desc"
      },
      {
        text: "Component",
        value: "component",
        sortable: false
      },
      { text: "Description", value: "description", sortable: false },
      { text: "Comments", value: "comments", sortable: false },
      { text: "Resolved", value: "resolved", sortable: true, sortDir: "desc" },
      {
        text: "Acknowledged",
        value: "acknowledged",
        sortable: true,
        sortDir: "desc"
      }
    ];
    // Mutate header data in store
    this.$store.commit("alerts/alertHeaderMutation", headers);
  }
  public data() {
    return {
      singleExpand: false, // Expande single row property
      itemsPerPage: 5, // Total rows per page, in sync with data table
      isSortActive: false, // Set table column sorting flag to default inactive
      sortColumnName: "", // Set sorting column name to none
      alertStatus: require("./../../common/const-string.json")
    };
  }

  public updateAlert(value: any) {
    this.$store.dispatch("alerts/updateAlert", value);
  }
  public clearComment(item: any) {
    item.comment = "";
  }
  public onExpand(props: any) {
    if (props.isExpanded === false) {
      props.expand(props.item);
    } else {
      props.expand(false);
    }
  }
}
</script>

<style lang="scss" scoped >
.actbtn {
  position: absolute;
  float: left;
}
#clear {
  font-size: 14px;
  color: green;
  float: right;
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
.backoverview {
  position: relative;
  top: 1em;
  cursor: pointer;
}
.backoverviewimg {
  position: relative;
  display: inline-block;
}
.backoverviewtxt {
  position: relative;
  top: -0.3em;
}
.tableheader:hover {
  .notActive {
    opacity: 1;
  }
}
.largeAlert {
  border: 2px solid #e3e3e3;
}
tbody tr {
  background-color: #ebf1e9 !important ;
}
tbody tr:hover {
  border-top: 2px solid darkgray !important;
  border-bottom: 2px solid darkgray !important;
}
tbody tr:active {
  border-top: 2px solid darkgray !important;
  border-bottom: 2px solid darkgray !important;
}
</style>
