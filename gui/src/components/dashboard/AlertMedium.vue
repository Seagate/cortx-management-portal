<template>
  <v-card height="100%" width="586px" class="my-5" tile>
    <v-system-bar height="50">
      <v-list-item-title class="headline subtitle-2 mb-1">ALERTS</v-list-item-title>
      <v-list-item-avatar tile>
        <img src="@/assets/widget/view-slideover-off.png" id="navLargeMode" style />
      </v-list-item-avatar>
    </v-system-bar>

    <v-container grid-list-xs-0>
      <v-row>
        <v-card class="mx-auto" outlined tile width="150px">
          <v-card-text>SYSTEM HEALTH</v-card-text>
          <v-card-text class="mx-auto" align="center" justify="center">
            <v-img
              class="mx-auto d-inline-flex"
              height="20"
              width="20"
              src="@/assets/status/degraded.png"
            />
            <span absolute>Degraded</span>
          </v-card-text>
        </v-card>
        <v-card class="mx-auto pa-0" outlined tile width="220px">
          <v-card-text class="ma-auto pb-0">UNHEALTHY COMPONENTS</v-card-text>
          <v-card-text class="ma-auto py-1 display-2" align="center" justify="center">6</v-card-text>
        </v-card>
        <v-card class="mx-auto pa-0" outlined tile width="212px">
          <v-card-text class="ma-auto pb-0">ALERTS TO ACKNOWLEDGE</v-card-text>
          <v-card-text class="ma-auto py-1 display-2" align="center" justify="center">1</v-card-text>
        </v-card>
      </v-row>
    </v-container>

    <v-data-table calculate-widths :headers="headers" :items="desserts" :items-per-page="5"></v-data-table>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "eos-alert-medium"
})
export default class EosAlertMedium extends Vue {
  private data() {
    return {
      headers: [
        {
          text: "Time",
          align: "left",
          value: "name",
          class: "grey lighten-2"
        },
        { text: "Severity", value: "calories", class: "grey lighten-2" },
        {
          text: "Component",
          value: "fat",
          class: "grey lighten-2",
          sortable: false
        }
      ],
      desserts: [
        {
          name: "10:08 AM",
          calories: "Degraded",
          fat: "Cluster 1"
        },
        {
          name: "10:09 AM",
          calories: "Degraded",
          fat: "Cluster 1"
        },
        {
          name: "10:09 AM",
          calories: "Degraded",
          fat: "Cluster 1"
        },
        {
          name: "10:09 AM",
          calories: "Degraded",
          fat: "Cluster 1"
        },
        {
          name: "10:09 AM",
          calories: "Degraded",
          fat: "Cluster 1"
        },
        {
          name: "10:09 AM",
          calories: "Degraded",
          fat: "Cluster 1"
        },
        {
          name: "10:09 AM",
          calories: "Degraded",
          fat: "Cluster 1"
        },
        {
          name: "10:09 AM",
          calories: "Degraded",
          fat: "Cluster 1"
        },
        {
          name: "10:09 AM",
          calories: "Degraded",
          fat: "Cluster 1"
        },
        {
          name: "10:09 AM",
          calories: "Degraded",
          fat: "Cluster 1"
        }
      ]
    };
  }
}
</script>
<style lang="scss" scoped>
#navLargeMode {
  height: 25px;
  width: 25px;
}
</style>
