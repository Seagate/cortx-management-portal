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
    <!-- <label>{{ totalRecords }}</label> -->
    <v-data-table calculate-widths :headers="headers" :items="desserts" :items-per-page="3"></v-data-table>
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
      totalRecords: this.$store.getters["alerts/alertTotalRecordCount"],
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
      ],
      desserts: [
        {
          time: "25m",
          severity: "Degraded",
          component: "Cluster 0, Node 1, Power Supply 0; State: Failed"
        },
        {
          time: "5h 17m",
          severity: "Failed",
          component: "Cluster 0, Node 1, Power Supply 0; State: Failed"
        },
        {
          time: "18h 24m",
          severity: "Failed",
          component: "Cluster 0, Node 1, Power Supply 0; State: Failed"
        },
        {
          time: "18h 24m",
          severity: "Degraded",
          component: "Cluster 0, Node 1, Power Supply 0; State: Failed"
        },
        {
          time: "18h 24m",
          severity: "Degraded",
          component: "Cluster 0, Node 1, Power Supply 0; State: Failed"
        },
        {
          time: "18h 24m",
          severity: "Degraded",
          component: "Cluster 0, Node 1, Power Supply 0; State: Failed"
        },
        {
          time: "18h 24m",
          severity: "Degraded",
          component: "Cluster 0, Node 1, Power Supply 0; State: Failed"
        },
        {
          time: "18h 24m",
          severity: "Degraded",
          component: "Cluster 0, Node 1, Power Supply 0; State: Failed"
        },
        {
          time: "18h 24m",
          severity: "Degraded",
          component: "Cluster 0, Node 1, Power Supply 0; State: Failed"
        },
        {
          time: "18h 24m",
          severity: "Degraded",
          component: "Cluster 0, Node 1, Power Supply 0; State: Failed"
        }
      ]
    };
  }
}
</script>
<style lang="scss" scoped>
#navLargeMode {
  height: 1.4em;
  width: 1.4em;
}
</style>
