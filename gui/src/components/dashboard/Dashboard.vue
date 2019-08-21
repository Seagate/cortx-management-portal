<template>
  <v-card height="100%" width="50%" class="ma-0 pa-5">
    <v-card-title>ALERTS</v-card-title>
    <v-card-text>SYSTEM HEALTH | UNHEALTHY COMPONENTS | ALERTS TO ACKNOWLEDGE</v-card-text>
    <v-simple-table :dense="dense" :fixed-header="fixedHeader" :height="height">
      <thead>
        <tr>
          <th class="text-left">Active Time</th>
          <th class="text-left">Alert Sevirity</th>
          <th class="text-left">Component</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in desserts" :key="item.name">
          <td>{{ item.time }}</td>
          <td>{{ item.sevirity }}</td>
          <td>{{ item.component }}</td>
        </tr>
      </tbody>
    </v-simple-table>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "eos-dashboard"
})
export default class EosDashboard extends Vue {
  private data() {
    return {
      dense: false,
      fixedHeader: true,
      height: 350,
      desserts: [
        {
          time: "10:20pm",
          sevirity: "Degraded",
          component: "Cluster 0"
        },
        {
          time: "10:20pm",
          sevirity: "Degraded",
          component: "Cluster 0"
        },
        {
          time: "10:20pm",
          sevirity: "Degraded",
          component: "Cluster 0"
        },
        {
          time: "10:20pm",
          sevirity: "Degraded",
          component: "Cluster 0"
        },
        {
          time: "10:20pm",
          sevirity: "Degraded",
          component: "Cluster 0"
        },
        {
          time: "10:20pm",
          sevirity: "Degraded",
          component: "Cluster 0"
        },
        {
          time: "10:20pm",
          sevirity: "Degraded",
          component: "Cluster 0"
        },
        {
          time: "10:20pm",
          sevirity: "Degraded",
          component: "Cluster 0"
        },
        {
          time: "10:20pm",
          sevirity: "Degraded",
          component: "Cluster 0"
        },
        {
          time: "10:20pm",
          sevirity: "Degraded",
          component: "Cluster 0"
        }
      ]
    };
  }
}
</script>
<style lang="scss" scoped>
</style>
