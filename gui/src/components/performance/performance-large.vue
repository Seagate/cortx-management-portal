/*****************************************************************************
 Filename:          performance-large.vue
 Description:       Performance stats large view component

 Creation Date:     10/02/2020
 Author:            Piyush Gupte

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
 <template>
  <div class="pa-5">
    <div class="eos-text-lg eos-text-bold">Performance</div>
    <button
      :disabled="chartCount>=3"
      type="button"
      @click="addChart()"
      class="mt-3 mb-2 eos-btn-primary"
    >Add Graph</button>

    <div :key="chartId" v-for="chartId in chartList">
      <v-row class="eos-cursor-pointer" @click="removeChart(chartId)" v-if="chartCount>1">
        <img class="eos-modal-close" :src="require('@/assets/close-green.svg')" />
      </v-row>
      <v-row class="eos-graph">
        <eos-line-chart :chartId="chartId" />
      </v-row>
    </div>
  </div>
</template>
 <script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import EosLineChart from "../widgets/line-chart.vue";
@Component({
  name: "eos-performance-large",
  components: {
    eosLineChart: EosLineChart
  }
})
export default class EosPerformanceLarge extends Vue {
  private chartCount: number = 1;
  private chartList: string[] = ["chart1"];
  public addChart() {
    if (this.chartCount <= 3) {
      this.chartCount++;
      this.chartList.push("chart" + this.chartCount);
    }
  }
  public removeChart(chartName: string) {
    const itemIndex = this.chartList.indexOf(chartName);
    if (itemIndex !== -1 && this.chartCount > 1) {
      this.chartList.splice(itemIndex, 1);
      this.chartCount--;
    }
  }
}
</script>

<style lang="scss" scoped>
</style>