/*****************************************************************************
 Filename:          line-chart.vue
 Description:       Performance stats component

 Creation Date:     7/01/2020
 Author:            Piyush Gupte

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <v-card id="lineChartContainer" class="ma-0 elevation-0" width="100%" tile>
    <div class="loader-container" v-if="show && $route.name!=='dashboard'">
      <div class="loader-message" v-if="show">
        <label>{{ message }}</label>
      </div>
      <div class="loader-body">
        <v-progress-linear indeterminate color="csmprimary" background-color="csmdisabled"></v-progress-linear>
      </div>
    </div>

    <v-row>
      <v-col cols="2">
        <v-select
          class="ml-3"
          v-model="metric1"
          v-on:change="metric1Change"
          :items="items"
          label="Metric 1"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-select :items="items" v-on:change="metric2Change" v-model="metric2" label="Metric 2"></v-select>
      </v-col>
      <v-col cols="8">
        <v-tabs color="csmprimary" class="mb-4" style="border-bottom: 1px solid lightgrey;">
          <v-tab @click="tabChange(1800)">
            <label class="tab-label">1/2 Hrs</label>
          </v-tab>
          <v-tab @click="tabChange(3600)">
            <label class="tab-label">1 Hrs</label>
          </v-tab>
          <v-tab @click="tabChange(7200)">
            <label class="tab-label">2 Hrs</label>
          </v-tab>
          <v-tab @click="tabChange(10800)">
            <label class="tab-label">3 Hrs</label>
          </v-tab>
          <v-tab @click="tabChange(14400)">
            <label class="tab-label">4 Hrs</label>
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>
    <div class="eos-chart-container" :id="chartId"></div>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import * as c3 from "c3";
import { PerformanceStatsQueryParams } from "./../../models/performance-stats";
import StatsUtility from "../../common/stats-utility";
export interface StatsQueryParams {
  from: number;
  to: number;
  // interval: process.env.VUE_APP_INTERVAL,
  total_sample: number;
  metric1: string;
  metric2: string;
}

@Component({
  name: "eos-line-chart"
})
export default class EosLineChart extends Vue {
  @Prop({ required: true })
  public chartId: string;
  private chart: any;
  private throughputPoll: any;
  private ispollThroughPut: boolean = true;
  private milliSecondDiviser = 1000;
  private metric1: string = "throughput_read";
  private metric2: string = "throughput_total";
  private prefetch: number = 1800;
  private fromTimeSec: number;
  private show: boolean = true;
  private toTimeSec: number;
  private message: string = "Loading....";

  // items: are the metric parameters to be popullated on the dropdown of the performance stats
  // TODO: Get this list from the api and remove this hard coaded value.
  public data() {
    return {
      items: [
        "",
        "throughput_read",
        "throughput_write",
        "throughput_total",
        "latency_total_request_time",
        "latency_create_object",
        "latency_delete_object",
        "latency_write_object",
        "latency_read_object",
        "latency_getkv",
        "latency_putkv",
        "latency_deletekv",
        "iops_read_object",
        "iops_write_object",
        "iops_read_bucket",
        "iops_write_bucket"
      ]
    };
  }

  // Function for handlling Metric1 dropdown change
  public metric1Change() {
    // set this parameter to true to show the component based loader
    // on dropdown change of metric1
    this.show = true;
    this.initThrouthputStats(this.prefetch);
  }

  // Function for handling Metric2 dropdown change
  public metric2Change() {
    // set this parameter to true to show the component based loader on dropdown
    // change of metric2 dropdown.
    this.show = true;
    this.initThrouthputStats(this.prefetch);
  }

  // Function to handle tab change event.
  public tabChange(prefetchSec: number) {
    this.prefetch = prefetchSec;
    // set this parameter to true to show component based loader
    // on tab change
    this.show = true;
    this.initThrouthputStats(this.prefetch);
  }

  // Component Lifecycle created event : prefetching past half an hour of data by default.
  public created() {
    this.initThrouthputStats(1800);
  }

  // Component Lifecycle distroyed event: stoping polling process.
  public destroyed() {
    this.ispollThroughPut = false;
  }

  // Common method prefetch data and initialize polling\
  private initThrouthputStats(preFetchDurationInSec: number) {
    if (this.throughputPoll) {
      clearInterval(this.throughputPoll);
    }
    if (this.chart) {
      this.chart = this.chart.destroy();
    }
    this.fromTimeSec =
      Math.round(new Date().getTime() / this.milliSecondDiviser) -
      preFetchDurationInSec;
    this.toTimeSec = Math.round(new Date().getTime() / this.milliSecondDiviser);
    const queryParams: StatsQueryParams = {
      from: this.fromTimeSec,
      to: this.toTimeSec,
      // interval: process.env.VUE_APP_INTERVAL,
      total_sample: 100,
      metric1: this.metric1,
      metric2: this.metric2
    };

    const obj = this.$store.dispatch(
      "performanceStats/getThroughputPerformanceStats",
      queryParams
    );
    const demoData = [
      ["x", new Date().getTime()],
      ["throughput_read", 0],
      ["throughput_write", 0]
    ];

    obj.then(data => {
      this.show = false;
      const y1label: string = StatsUtility.getYaxisLabel(this.metric1);
      const y2label: string = StatsUtility.getYaxisLabel(this.metric2);
      const y2Obj: any = StatsUtility.getYtwoObject(this.metric2);
      this.chart = c3.generate({
        // bindto: "#line_chart",
        bindto: "#" + this.chartId,
        size: {
          height: window.innerHeight < 900 ? 190 : 320
        },
        data: {
          x: "x",
          columns: data ? data : [[]],
          type: "spline",
          axes: y2Obj
        },
        legend: {
          position: "bottom"
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
    });
    const that = this;
    that.throughputPoll = setInterval(() => {
      if (that.ispollThroughPut === true) {
        const query = {
          id: 1,
          from:
            Math.round(new Date().getTime() / this.milliSecondDiviser) -
            process.env.VUE_APP_FROM_TO_TIME_OFFSET,
          to: Math.round(new Date().getTime() / this.milliSecondDiviser),
          // interval: process.env.VUE_APP_INTERVAL,
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
    }, process.env.VUE_APP_GUI_POLLING_INTERVAL);
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

.loader-container {
  background-color: #ffffff;
  width: 333px;
  position: absolute;
  top: 13rem;
  left: 25rem;
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
  .eos-chart-container {
    height: 190px;
  }
}
@media screen and (min-height: 900px) {
  .eos-chart-container {
    height: 320px;
  }
}

</style>
