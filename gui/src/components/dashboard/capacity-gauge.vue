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
      <div class="eos-capacity-title">Data allocation</div>
    </div>
    <div id="gauge_capacity"></div>
    <table class="mt-3">
      <tr>
        <td style="width: 25px;"><div style="height: 13px;width: 13px;background: #6EBE49;"></div></td>
        <td style="width: 110px;" class="eos-capacity-title">Used</td>
        <td>{{capacityDetails.used}}</td>
      </tr>
      <tr>
        <td style="width: 25px;"><div style="height: 13px;width: 13px;background: #9E9E9E;"></div></td>
        <td style="width: 110px;" class="eos-capacity-title">Available</td>
        <td>{{capacityDetails.avail}}</td>
      </tr>
    </table>
    <div class="mt-2 mb-2 eos-capacity-separator"></div>
    <div>
      <div class="eos-capacity-title">Total</div>
      <span style="float: right;">{{capacityDetails.size}}</span>
    </div>
  </div>
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
    const demoData = [["x", 0]];

    const capacityRes = this.$store
      .dispatch("performanceStats/getCapacityStats")
      .then(capacityC3Data => {
        const chart = c3.generate({
          bindto: "#gauge_capacity",
          legend: {
            show: false
          },
          data: {
            columns: capacityC3Data ? capacityC3Data : demoData,
            type: "gauge"
          },
          gauge: {
            label: {
              show: false
            }
          },
          color: {
            pattern: ["#60B044", "#60B044", "#60B044", "#60B044"], // the three color levels for the percentage values.
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
.eos-capacity-title {
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.87);
  float: left;
}
.eos-capacity-separator{
  width: 100%;
  border-top: 1px solid #E3E3E3; 
}
</style>
