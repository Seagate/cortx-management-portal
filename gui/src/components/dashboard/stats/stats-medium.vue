/*
* CORTX-CSM: CORTX Management web and CLI interface.
* Copyright (c) 2020 Seagate Technology LLC and/or its Affiliates
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU Affero General Public License for more details.
* You should have received a copy of the GNU Affero General Public License
* along with this program. If not, see <https://www.gnu.org/licenses/>.
* For any questions about this software or licensing,
* please email opensource@seagate.com or cortx-questions@seagate.com.
*/
<template>
  <div id="statsContainer">
    <div style="height: 30px;">
      <div class="eos-text-lg eos-text-bold eos-float-l" id="stats-performance">
        Performance
      </div>
      <img
        id="stats-medium-zoomicon"
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
<style lang="scss" scoped></style>
