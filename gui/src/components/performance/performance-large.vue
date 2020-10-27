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
  <div class="pa-5">
    <div class="cortx-text-lg cortx-text-bold" id="performance-text">
      {{ $t("dashboard.performance") }}
    </div>
    <button
      id="peformance-addgraphbtn"
      :disabled="chartList.length >= 3"
      type="button"
      @click="addChart()"
      class="mt-3 mb-2 cortx-btn-primary"
    >
      {{ $t("dashboard.addGraph") }}
    </button>

    <div :key="chartId" v-for="chartId in chartList">
      <v-row
        id="performance-remove-chart"
        class="cortx-cursor-pointer"
        @click="removeChart(chartId)"
        v-if="chartList.length > 1"
      >
        <img
          class="cortx-modal-close"
          :src="require('@/assets/close-green.svg')"
        />
      </v-row>
      <v-row class="cortx-graph">
        <cortx-line-chart :chartId="chartId" />
      </v-row>
    </div>
    <div id="lastItem"></div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import CortxLineChart from "../widgets/line-chart.vue";
import i18n from "../maintenance/maintenance.json";

@Component({
  name: "cortx-performance-large",
  components: {
    cortxLineChart: CortxLineChart
  },
  i18n: {
    messages: i18n
  }
})
export default class CortxPerformanceLarge extends Vue {
  private chartCount: number = 1;
  private chartList: string[] = ["chart1"];
  public addChart() {
    if (this.chartList.length <= 3) {
      this.chartCount++;
      this.chartList.push("chart" + this.chartCount);
    }
  }
  public removeChart(chartName: string) {
    const itemIndex = this.chartList.indexOf(chartName);
    if (itemIndex !== -1 && this.chartList.length > 1) {
      this.chartList.splice(itemIndex, 1);
    }
  }
}
</script>

<style lang="scss" scoped></style>
