/* * CORTX-CSM: CORTX Management web and CLI interface. * Copyright (c) 2020
Seagate Technology LLC and/or its Affiliates * This program is free software:
you can redistribute it and/or modify * it under the terms of the GNU Affero
General Public License as published * by the Free Software Foundation, either
version 3 of the License, or * (at your option) any later version. * This
program is distributed in the hope that it will be useful, * but WITHOUT ANY
WARRANTY; without even the implied warranty of * MERCHANTABILITY or FITNESS FOR
A PARTICULAR PURPOSE. See the * GNU Affero General Public License for more
details. * You should have received a copy of the GNU Affero General Public
License * along with this program. If not, see <https://www.gnu.org/licenses/>.
* For any questions about this software or licensing, * please email
opensource@seagate.com or cortx-questions@seagate.com. */
<template>
  <div class="width-100">
    <div
      class="loader-container"
      v-if="showComponentLoader && $route.name !== 'dashboard'"
    >
      <div class="loader-message">
        <label>{{ message }}</label>
      </div>
      <div class="loader-body">
        <v-progress-linear
          indeterminate
          color="csmprimary"
          background-color="csmdisabled"
        ></v-progress-linear>
      </div>
    </div>

    <v-row class="pt-3">
      <div class="py-0 pl-8 height-5 width-50">
        <h2 class="pt-4" v-if="onDashboard">
          {{ $t("performance.performance") }}
        </h2>
      </div>
      <div class="py-0 pl-2 height-5 width-15">
        <v-select
          outlined
          id="matrixone"
          v-if="!onDashboard"
          :items="getMatric1"
          @change="matricDurationChange()"
          v-model="metric1"
          label="Metric 1"
        ></v-select>
      </div>
      <div class="py-0 pl-2 height-5 width-15">
        <v-select
          outlined
          id="matrixtwo"
          v-if="!onDashboard"
          :items="getMetric2"
          @change="matricDurationChange()"
          v-model="metric2"
          label="Metric 2"
        ></v-select>
      </div>
      <div class="py-0 pl-2 height-5 width-15">
        <v-select
          outlined
          id="duration"
          :items="durations"
          @change="matricDurationChange(prefetch)"
          v-model="prefetch"
          label="Duration"
        ></v-select>
      </div>
      <div class="py-0 pl-2 pr-5 text-align-center height-5 width-5">
        <div v-if="onDashboard" class="pt-4">
          <img
            id="stats-medium-zoomicon"
            :src="require('@/assets/zoom-in.svg')"
            @click="$router.push('/performance')"
            class="cortx-cursor-pointer"
          />
        </div>
        <div v-if="!onDashboard && chartCount > 1" class="pt-4">
          <img
            class="cortx-modal-close cortx-cursor-pointer"
            @click="$emit('remove-chart', chartId)"
            :src="require('@/assets/close-green.svg')"
          />
        </div>
      </div>
    </v-row>
    <div class="cortx-chart-container" :id="chartId">
      <div v-if="isError" class="no-stats-data">
        <div id="permancedatalbl">{{ $t("performance.unableToFetch") }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import * as c3 from "c3";
import { PerformanceStatsQueryParams } from "./../../models/performance-stats";
import StatsUtility from "../../common/stats-utility";
import * as d3 from "d3";

export interface StatsQueryParams {
  from: number;
  to: number;
  // interval: process.env.VUE_APP_INTERVAL,
  total_sample: number;
  metric1: string;
  metric2: string;
}

@Component({
  name: "cortx-performance-chart"
})
export default class CortxPerformanceChart extends Vue {
  @Prop({ required: true }) chartId: string;
  @Prop({ required: false }) onDashboard: boolean;
  @Prop({ required: false }) chartCount: number;
  private chart: any;
  private throughputPoll: any;
  private ispollThroughPut: boolean = true;
  private milliSecondDiviser = 1000;
  private metric1: string = "throughput_read";
  private metric2: string = "throughput_total";
  private prefetch: number = 1800;
  private fromTimeSec: number;
  private showComponentLoader: boolean = true;
  private toTimeSec: number;
  private message: string = "Loading....";
  private isError: boolean = false;
  // public
  // items: are the metric parameters to be popullated on the dropdown of the performance stats
  // TODO: Get this list from the api and remove this hard coaded value.
  data() {
    return {
      items: [
        { value: "", text: "-- No Metric --" },
        { value: "throughput_read", text: "throughput_read" },
        { value: "throughput_write", text: "throughput_write" },
        { value: "throughput_total", text: "throughput_total" },
        { value: "latency_average", text: "average_latency" },
        { value: "latency_create_object", text: "latency_create_object" },
        { value: "latency_delete_object", text: "latency_delete_object" },
        { value: "latency_write_object", text: "latency_write_object" },
        { value: "latency_read_object", text: "latency_read_object" },
        { value: "latency_getkv", text: "latency_getkv" },
        { value: "latency_putkv", text: "latency_putkv" },
        { value: "latency_deletekv", text: "latency_deletekv" },
        { value: "iops_read_object", text: "iops_read_object" },
        { value: "iops_write_object", text: "iops_write_object" },
        { value: "iops_read_bucket", text: "iops_read_bucket" },
        { value: "iops_write_bucket", text: "iops_write_bucket" }
      ],
      durations: [
        { value: 1800, text: "1/2Hrs" },
        { value: 3600, text: "1Hrs" },
        { value: 7200, text: "2Hrs" },
        { value: 21600, text: "6Hrs" },
        { value: 43200, text: "12Hrs" },
        { value: 86400, text: "1Day" }
      ]
    };
  }

  get getMatric1(): any[] {
    return this.$data.items.filter(
      (ele: any) => ele.value !== this.metric2 || ele.value == ""
    );
  }

  get getMetric2(): any[] {
    return this.$data.items.filter(
      (ele: any) => ele.value !== this.metric1 || ele.value == ""
    );
  }

  // Function to handle tab change event.
  matricDurationChange(prefetchSec?: number) {
    if (prefetchSec) this.prefetch = prefetchSec;
    // set this parameter to true to show component based loader
    // on tab change
    this.showComponentLoader = true;
    this.message = "Loading....";
    this.initThrouthputStats(this.prefetch);
  }

  // Component Lifecycle created event : prefetching past half an hour of data by default.
  created() {
    this.initThrouthputStats(1800);
    document.addEventListener("visibilitychange", this.onBrowerTabChange);
  }

  // Component Lifecycle distroyed event: stoping polling process.
  destroyed() {
    this.ispollThroughPut = false;
    document.removeEventListener("visibilitychange", this.onBrowerTabChange);
  }

  getPollingInterval(prefetchDurInSec: number): number {
    return prefetchDurInSec ? (10000 * prefetchDurInSec) / 1800 : 10000;
  }

  onBrowerTabChange() {
    if (document.hidden) {
      this.ispollThroughPut = false;
    } else {
      this.initThrouthputStats(this.prefetch ? this.prefetch : 1800);
    }
  }

  // Common method prefetch data and initialize polling\
  private initThrouthputStats(preFetchDurationInSec: number) {
    try {
      if (this.throughputPoll) {
        clearInterval(this.throughputPoll);
      }
      if (this.chart) {
        this.chart = this.chart.destroy();
      }
      this.fromTimeSec =
        Math.round(new Date().getTime() / this.milliSecondDiviser) -
        preFetchDurationInSec;
      this.toTimeSec = Math.round(
        new Date().getTime() / this.milliSecondDiviser
      );
      const queryParams: StatsQueryParams = {
        from: this.fromTimeSec,
        to: this.toTimeSec,
        // interval: process.env.VUE_APP_INTERVAL,
        total_sample: 180,
        metric1: this.metric1,
        metric2: this.metric2
      };

      const obj = this.$store.dispatch(
        "performanceStats/getThroughputPerformanceStats",
        queryParams
      );
      try {
        obj
          .then(data => {
            const formatInteger = d3.format(",");
            const formatDecimal = d3.format(",.2f");
            if (data !== undefined) {
              this.showComponentLoader = false;
              const y1label: string = StatsUtility.getYaxisLabel(this.metric1);
              const y2label: string = StatsUtility.getYaxisLabel(this.metric2);
              const y2Obj: any = {};
              y2Obj[this.metric2] = "y2";
              this.chart = c3.generate({
                // bindto: "#line_chart",
                bindto: "#" + this.chartId,
                size: {
                  height: window.innerHeight < 900 ? 230 : 320
                },
                data: {
                  x: "x",
                  columns: data ? data : [[]],
                  type: "line",
                  axes: y2Obj
                },
                color: {
                  pattern: ["#1f77b4", "#FF0000"]
                },
                legend: {
                  position: "bottom",
                  inset: {
                    anchor: "bottom-right",
                    y: -20,
                    step: 1
                  }
                },
                interaction: {
                  enabled: true
                },
                grid: {
                  x: {
                    show: true
                  },
                  y: {
                    show: true
                  }
                },
                point: {
                  show: false
                },
                axis: {
                  x: {
                    type: "timeseries",
                    label: {
                      text: "Time",
                      position: "outer-center"
                    },
                    tick: {
                      fit: true,
                      count: 12,
                      format: "%H:%M:%S"
                    }
                  },
                  y: {
                    min: 0,
                    padding: { top: 0, bottom: 0 },
                    label: {
                      text: y1label,
                      position: "outer-middle"
                    }
                  },
                  y2: {
                    show: true,
                    min: 0,
                    padding: { top: 0, bottom: 0 },
                    label: {
                      text: y2label,
                      position: "outer-middle"
                    }
                  }
                }
              });
            } else {
              this.isError = true;
              this.showComponentLoader = false;
            }
          })
          .catch(() => {
            this.isError = true;
            this.showComponentLoader = false;
          });
      } catch (err) {
        this.isError = true;
        this.showComponentLoader = false;
      }
      const that = this;
      // this elasticSerchOffset need to be substracted in "from time" of the request
      // to remove a corner case where elastic search stops giving data due to some time lag
      const elasticSerchOffset = 5;
      that.throughputPoll = setInterval(() => {
        if (that.ispollThroughPut === true) {
          const query = {
            id: 1,
            from:
              Math.round(new Date().getTime() / this.milliSecondDiviser) -
              (preFetchDurationInSec / queryParams.total_sample +
                elasticSerchOffset),
            to: Math.round(new Date().getTime() / this.milliSecondDiviser),
            total_sample: 1,
            metric1: this.metric1,
            metric2: this.metric2
          };
          const res = that.$store.dispatch(
            "performanceStats/getThroughputPerformanceStats",
            query
          );

          res.then(chartData => {
            if (chartData) {
              that.chart.flow({ columns: chartData });
            }
          });
        } else {
          clearInterval(that.throughputPoll);
        }
      }, this.getPollingInterval(preFetchDurationInSec));
    } catch {
      this.isError = true;
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./../../../node_modules/c3/c3.min.css";
.tab-label {
  cursor: pointer;
  text-transform: none;
  font-weight: bold;
}
.no-stats-data {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #b7b7b7;
  div {
    padding: 4rem;
    font-weight: bold;
  }
}

.loader-container {
  background-color: #ffffff;
  width: 333px;
  position: absolute;

  z-index: 99;
  border: solid;
  border-width: 1px;
  border-color: #b7b7b7;
}

.loader-body {
  padding: 10px;
}
.loader-message {
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: #000000;
  margin-bottom: 6px;
  margin-bottom: 6px;
  margin-left: 1rem;
  margin-top: 1rem;
}
@media screen and (min-height: 600px) {
  .cortx-chart-container {
    height: 230px;
  }
  .loader-container {
    left: 25rem;
    top: 9rem;
  }
}
@media screen and (min-height: 900px) {
  .cortx-chart-container {
    height: 320px;
  }
  .loader-container {
    left: 42rem;
    top: 13rem;
  }
}

.height-5 {
  height: 5rem;
}
.text-align-center {
  text-align: center;
}
.width-100 {
  width: 100%;
}
.width-5 {
  width: 5%;
}
.width-15 {
  width: 15%;
}
.width-50 {
  width: 50%;
}
</style>
