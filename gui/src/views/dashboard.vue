/*****************************************************************************
 Filename:          dashboard.vue
 Description:       Dashboard Component

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
  <div>
    <v-row>
      <v-col cols="8">
        <eos-alert-medium />
      </v-col>
      <v-col cols="4">
        <eos-capacity-guage />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <eos-stats-medium />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import EosAlertMedium from "./../components/dashboard/alert-medium.vue";
import EosStatsMedium from "./../components/dashboard/stats/stats-medium.vue";
import EosCapacityGuage from "./../components/dashboard/capacity-gauge.vue";
import * as c3 from "c3";

@Component({
  name: "eos-dashboard",
  components: {
    eosAlertMedium: EosAlertMedium,
    eosStatsMedium: EosStatsMedium,
    eosCapacityGuage: EosCapacityGuage
  }
})
export default class Dashboard extends Vue {}
</script>
<style lang="scss" scoped>
.page {
  position: relative;
}
</style>

