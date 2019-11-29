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
  <v-card class="ma-0 elevation-0 mediumAlert" width="100%" tile>
    <v-system-bar height="40em">
      <span id="title" class="text-uppercase font-weight-medium text--black">CAPACITY</span>
      <v-spacer></v-spacer>
      <router-link :to="'alertlarge'">
        <img src="@/assets/widget/view-slideover-off.png" id="navLargeMode" style />
      </router-link>
    </v-system-bar>

    <v-container>
      <div id="gauge_capacity"></div>
      <div class="mb-4">
        <span class="subtitle-2">Total Capacity :</span>
        <span>{{capacityDetails.size}}</span>
      </div>
      <v-divider></v-divider>
      <div class="mt-4">
        <span class="subtitle-2">Used :</span>
        <span>{{capacityDetails.used}}</span>
      </div>
      <div class="mt-4">
        <span class="subtitle-2">Available :</span>
        <span>{{capacityDetails.avail}}</span>
      </div>
    </v-container>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";
import { DiskCapacityDetails } from "./../../models/performance-stats";
import * as c3 from "c3";
@Component({
  name: "eos-capacity-gauge"
})
export default class EosCapacityGauge extends Vue {
  public created() {
    const capacityRes = this.$store
      .dispatch("performanceStats/getCapacityStats")
      .then(
        (capacityC3Data) => {
        const chart = c3.generate({
          bindto: "#gauge_capacity",
          data: {
            columns: capacityC3Data,
            type: "gauge"
          },
          gauge: {},
          color: {
            pattern: ["#60B044","#60B044","#60B044","#60B044"], // the three color levels for the percentage values.
            threshold: {
              values: [30, 60, 90, 100]
            }
          },
          size: {
            height: 180
          }
        });
      });
  }

  get capacityDetails() {
    return this.$store.getters["performanceStats/getCapacity"];
  }
}
</script>
<style lang="scss" scoped>
@import "./../../../node_modules/c3/c3.min.css";
#navLargeMode {
  height: 1.4em;
  width: 1.4em;
}
#title {
  color: black;
}
.mediumAlert {
  border: 2px solid #e3e3e3;
}
</style>
