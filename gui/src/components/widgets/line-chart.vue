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
  <v-card class="ma-0 elevation-0" width="100%" tile>
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
    <div id="line_chart"></div>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import * as c3 from "c3";
import { PerformanceStatsQueryParams } from "./../../models/performance-stats";

@Component({
  name: "eos-line-chart"
})
export default class EosLineChart extends Vue {
  private chart: any;
  private throughputPoll: any;
  private ispollThroughPut: boolean = true;
  private milliSecondDiviser = 1000;
  private metric1: string = "Write";
  private metric2: string = "Total";
  private prefetch: number = 1800;
  // items: are the metric parameters to be popullated on the dropdown of the performance stats
  // TODO: Get this list from the api and remove this hard coaded value.
  public data() {
    return {
      items: ["Read", "Write", "Total"]
    };
  }

  // Function for handlling Metric1 dropdown change
  public metric1Change() {
    this.initThrouthputStats(this.prefetch);
  }

  // Function for handling Metric2 dropdown change
  public metric2Change() {
    this.initThrouthputStats(this.prefetch);
  }

  // Function to handle tab change event.
  public tabChange(prefetchSec: number) {
    this.prefetch = prefetchSec;
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
    const queryParams: any = {
      id: 1,
      from:
        Math.round(new Date().getTime() / this.milliSecondDiviser) -
        preFetchDurationInSec,
      to: Math.round(new Date().getTime() / this.milliSecondDiviser),
      interval: process.env.VUE_APP_INTERVAL,
      metric1: this.metric1,
      metric2: this.metric2
    };

    const obj = this.$store.dispatch(
      "performanceStats/getThroughputPerformanceStats",
      queryParams
    );
    const demoData = [
      ["x", new Date().getTime()],
      ["total", 0],
      ["read", 0],
      ["write", 0]
    ];

    obj.then(data => {
      this.chart = c3.generate({
        bindto: "#line_chart",
        data: {
          x: "x",
          columns: data ? data : demoData,
          type: "spline",
          axes:
            this.metric2 === "read"
              ? {
                  read: "y2"
                }
              : this.metric2 === "write"
              ? { write: "y2" }
              : { total: "y2" }
        },
        legend: {
          position: "bottom"
        },
        interaction: {
          enabled: false
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
              text: "MB Transferred Per Second",
              position: "outer-middle"
            }
          },
          y2: {
            show: true,
            min: 0,
            padding: { top: 0, bottom: 0 },
            label: {
              text: "MB Transferred Per Second",
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
          interval: process.env.VUE_APP_INTERVAL,
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
</style>
