<template>
  <v-card class="my-5" width="60%" tile>
    <v-system-bar height="30em" class="widgetheader">
      <span class="font-weight-medium text-uppercase">Alerts</span>
      <v-spacer></v-spacer>
      <img src="@/assets/widget/view-slideover-off.png" id="navLargeMode" style />
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
      :headers="headers"
      :items="alertData"
      item-key="created_time"
      :items-per-page="5"
      :server-items-length="totalRecordsCount"
    >
      <template v-slot:item="props">
        <tr class="font-weight-medium">
          <td>{{props.item.created_time}}</td>
          <td>
            <v-img
              height="20"
              v-if="props.item.severity==1"
              width="20"
              src="./../../assets/status/critical-icon.png"
            />
            <v-img
              height="20"
              v-if="props.item.severity==2"
              width="20"
              src="./../../assets/status/error-fault.png"
            />
            <v-img
              height="20"
              v-if="props.item.severity==3"
              width="20"
              src="./../../assets/status/healthy-icon.png"
            />
          </td>
          <td>
            <div>{{props.item.location}}</div>
            <div>State:{{props.item.alert_type}}</div>
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
    this.$store.dispatch("alerts/alertDataAction");
  }

  private data() {
    return {
      headers: [
        {
          text: "Active Time",
          align: "left",
          value: "time",
          class: "grey lighten-2"
        },
        {
          text: "Alert Severity",
          value: "severity",
          class: "grey lighten-2"
        },
        {
          text: "Component",
          value: "component",
          class: "grey lighten-2",
          sortable: false
        }
      ]
    };
  }

  get totalRecordsCount() {
    return this.$store.getters["alerts/alertTotalRecordCount"];
  }

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
</style>
