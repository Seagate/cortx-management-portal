/*****************************************************************************
 Filename:          stats-medium.vue
 Description:       Performance stats component

 Creation Date:     22/11/2019
 Author:            Piyush Gupte

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <div id="statsContainer">
    <div style="height: 30px;">
      <div class="eos-text-lg eos-text-bold eos-float-l">Performance</div>
      <img
        :src="require('@/assets/zoom-in.svg')"
        @click="$router.push('/performance')"
        class="eos-float-r eos-cursor-pointer"
      />
    </div>
    <eos-line-chart chartId="line_chart" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";
import * as c3 from "c3";
import { PerformanceStatsQueryParams } from "./../../../models/performance-stats";
import EosLineChart from "./../../widgets/line-chart.vue";
@Component({
  name: "eos-stats-medium",
  components: {
    eosLineChart: EosLineChart
  }
})
export default class EosStatsMedium extends Vue {}
</script>
<style lang="scss" scoped>
@media screen and (min-height: 600px) {
  #statsContainer {
    padding-left: 20px;
  }
}
@media screen and (min-height: 900px) {
  #statsContainer {
    padding: 20px;
  }
}
</style>
