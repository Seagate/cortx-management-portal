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
  <div id="capacityContainer">
    <div>
      <div class="eos-text-lg eos-text-bold">Capacity</div>
    </div>
    <div class="eos-capacity-container" id="gauge_capacity"></div>
    <table class="mt-3">
      <tr>
        <td class="width-25" >
          <div class="capacity-used-badge"  ></div>
        </td>
        <td  class="eos-capacity-title width-110">Used</td>
        <td>{{capacityDetails.used}}</td>
      </tr>
      <tr>
        <td>
          <div class="capacity-available-badge"></div>
        </td>
        <td class="eos-capacity-title">Available</td>
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
            height: window.innerHeight < 900 ? 110 : 180
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
.capacityContainer {
    .eos-capacity-title {
      font-style: normal;
      font-weight: bold;
      font-size: 18px;
      color: rgba(0, 0, 0, 0.87);
      float: left;
    }
}
.capacity-used-badge {
    height: 13px; 
    width: 13px; 
    background: rgb(110, 190, 73);
  }
  .capacity-available-badge {
    height: 13px; 
    width: 13px; 
    background: rgb(158, 158, 158);

  }
.eos-capacity-separator {
  width: 100%;
  border-top: 1px solid #e3e3e3;
}
.width-25 {
  width: 25px;
}
.width-110 {
  width: 110px;
}
@media screen and (min-height: 600px) {
  #capacityContainer {
    padding-left: 20px;
  }
  .eos-capacity-container {
    height: 110px;
  }
}
@media screen and (min-height: 900px) {
  #capacityContainer {
    padding: 20px;
  }
   .eos-capacity-container {
    height: 180px;
  }
}
</style>
