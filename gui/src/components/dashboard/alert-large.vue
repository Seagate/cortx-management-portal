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
  <v-card class="my-5" width="95%" tile>
    <v-system-bar height="40em">
      <span id="title" class="text-uppercase font-weight-medium text--black">ACTIVE ALERTS</span>
      <v-spacer></v-spacer>
      <span id="clear">Clear All Alerts</span>
    </v-system-bar>
    <v-data-table
      :headers="headers"
      :items="alertData.alerts"
      :single-expand="singleExpand"
      item-key="created_time"
      show-expand
      class="eos-table"
      :server-items-length="totalRecordsCount"
    >
      <template v-slot:item="props">
        <tr class="font-weight-medium">
          <td @click="onExpand(props)">
            <img v-if="props.isExpanded" src="./../../assets/caret-green-down.png" />
            <img v-if="!props.isExpanded" src="./../../assets/caret-green-right.png" />
          </td>
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
          <td>{{props.item.description}}</td>
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
              v-if="props.item.resolved==1"
              src="./../../assets/status/healthy-icon.png"
            />
          </td>
          <td>
            <v-checkbox
              @change="updateAlert(props.item)"
              value="1"
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
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "eos-alert-large"
})
export default class EosAlertLarge extends Vue {
  public mounted() {
    this.$store.dispatch("alerts/alertDataAction");
  }

  public data() {
    return {
      singleExpand: false,
      headers: [
        {
          text: "Active Time",
          align: "left",
          sortable: false,
          value: "time"
        },
        {
          text: "Severity",
          align: "left",
          sortable: false,
          value: "severity"
        },
        {
          text: "Component",
          value: "",
          sortable: false
        },
        { text: "Description", value: "fat" },
        { text: "Comments", value: "" },
        { text: "Resolved", value: "resolved" },
        { text: "Acknowledged", value: "acknowledged" }
      ]
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

  get totalRecordsCount() {
    return this.$store.getters["alerts/alertTotalRecordCount"];
  }

  get alertData() {
    return this.$store.getters["alerts/alertData"];
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
</style>
