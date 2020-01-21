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
  <v-card class="ma-0 elevation-0 mediumAlert" width="100%" tile>
    <v-system-bar height="40em">
      <span id="title" class="eos-alert-title">Performance</span>
      <v-spacer></v-spacer>
      <router-link :to="'alertlarge'">
        <img src="@/assets/widget/view-slideover-off.png" id="navLargeMode" style />
      </router-link>
    </v-system-bar>
    <eos-line-chart />
  </v-card>
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
#navLargeMode {
  height: 1.4em;
  width: 1.4em;
}
#title {
  color: black;
}
.active {
  display: inline-block;
  color: var(--v-csmprimary-base) !important;
}
.notActive {
  opacity: 0;
}
.headerText {
  color: black;
}
.tableheader:hover {
  .notActive {
    opacity: 1;
  }
}
.mediumAlert {
  border: 2px solid #e3e3e3;
}
.eos-alert-title {
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.87);
  float: left;
}
</style>
