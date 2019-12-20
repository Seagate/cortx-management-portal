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
      <span id="title" class="text-uppercase font-weight-medium text--black">PERFORMANCE</span>
      <v-spacer></v-spacer>
      <router-link :to="'alertlarge'">
        <img src="@/assets/widget/view-slideover-off.png" id="navLargeMode" style />
      </router-link>
    </v-system-bar>
    <div class="subtitle-2 ma-3">SYSTEM THROUGHPUT</div>
    <div id="chart_throughput"></div>
    <div class="subtitle-2 ma-3">SYSTEM LATENCY</div>
    <div id="chart_latency"></div>
    <div class="subtitle-2 ma-3">SYSTEM IOPS</div>
    <div id="chart_iops"></div>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";
import * as c3 from "c3";
import { PerformanceStatsQueryParams } from "./../../../models/performance-stats";

@Component({
  name: "eos-stats-medium"
})
export default class EosStatsMedium extends Vue {
  public chart: any;
  public chartLatency: any;
  public chartIops: any;
  public ispollThroughPut: boolean = true;
  public ispollLatency: boolean = true;
  public ispollIops: boolean = true;
  public created() {
    this.initThrouthputStats();
    this.initLatencyStats();
    this.initIopsStats();
  }
  public destroyed() {
    this.ispollThroughPut = false;
    this.ispollLatency = false;
    this.ispollIops = false;
  }

  private initThrouthputStats() {
    const queryParams: any = {
      id: 1,
      from: Math.round(new Date().getTime() / 1000) - 10800,
      to: Math.round(new Date().getTime() / 1000),
      interval: "10"
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

    obj.then(
      (data) => {
      this.chart = c3.generate({
        bindto: "#chart_throughput",
        data: {
          x: "x",
          columns: data ? data : demoData,
          type: "spline"
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
              text: "Time (HH:MM:SS)",
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
              text: "MB transferred per second",
              position: "outer-middle"
            }
          }
        }
      });
    });
    const that = this;
    const throughputPoll = setInterval(() => {
      if (that.ispollThroughPut === true) {
        const query = {
          id: 1,
          from: Math.round(new Date().getTime() / 1000) - 20,
          to: Math.round(new Date().getTime() / 1000),
          interval: "10"
        };
        const res = that.$store.dispatch(
          "performanceStats/getThroughputPerformanceStats",
          query
        );

        res.then(
          (chartData) => {
          if (chartData) {
            that.chart.flow({ columns: chartData });
          }
        });
      } else {
        clearInterval(throughputPoll);
      }
    }, 10000);
  }

  private initIopsStats() {
    const queryParams: any = {
      id: 1,
      from: Math.round(new Date().getTime() / 1000) - 10800,
      to: Math.round(new Date().getTime() / 1000),
      interval: "10"
    };
    const obj = this.$store.dispatch(
      "performanceStats/getIopsPerformanceStats",
      queryParams
    );
    const demoData = [
      ["x", new Date().getTime()],
      ["total", 0],
      ["read", 0],
      ["write", 0]
    ];

    obj.then(
      (data) => {
      this.chartIops = c3.generate({
        bindto: "#chart_iops",
        data: {
          x: "x",
          columns: data ? data : demoData,
          type: "spline"
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
              text: "Time (HH:MM:SS)",
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
              text: "Ops per second",
              position: "outer-middle"
            }
          }
        }
      });
    });
    const that = this;
    const pollIops = setInterval(() => {
      if (that.ispollIops === true) {
        const query = {
          id: 1,
          from: Math.round(new Date().getTime() / 1000) - 10,
          to: Math.round(new Date().getTime() / 1000),
          interval: "10"
        };
        const res = that.$store.dispatch(
          "performanceStats/getIopsPerformanceStats",
          query
        );

        res.then(
          (chartData) => {
          if (chartData) {
            that.chartIops.flow({ columns: chartData });
          }
        });
      } else {
        clearInterval(pollIops);
      }
    }, 10000);
  }

  private initLatencyStats() {
    const queryParams: any = {
      id: 1,
      from: Math.round(new Date().getTime() / 1000) - 10800,
      to: Math.round(new Date().getTime() / 1000),
      interval: "10"
    };
    const obj = this.$store.dispatch(
      "performanceStats/getLatencyPerformanceStats",
      queryParams
    );
    const demoData = [
      ["x", new Date().getTime()],
      ["total", 0],
      ["read", 0],
      ["write", 0]
    ];

    obj.then(
      (data) => {
      this.chartLatency = c3.generate({
        bindto: "#chart_latency",
        data: {
          x: "x",
          type: "spline",
          columns: data ? data : demoData
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
              text: "Time (HH:MM:SS)",
              position: "outer-center"
            },
            tick: {
              count: 12,
              fit: true,
              format: "%H:%M:%S"
            }
          },
          y: {
            min: 0,
            padding: { top: 0, bottom: 0 },
            label: {
              text: "Average latency (In millisecond)",
              position: "outer-middle"
            }
          }
        }
      });
    });
    const that = this;
    const pollLatency = setInterval(() => {
      if (that.ispollLatency === true) {
        const query = {
          id: 1,
          from: Math.round(new Date().getTime() / 1000) - 10,
          to: Math.round(new Date().getTime() / 1000),
          interval: "10"
        };
        const res = that.$store.dispatch(
          "performanceStats/getLatencyPerformanceStats",
          query
        );
        res.then(
          (data) => {
          if (data !== undefined) {
            that.chartLatency.flow({ columns: data });
          }
        });
      } else {
        clearInterval(pollLatency);
      }
    }, 10000);
  }
}
</script>
<style lang="scss" scoped>
@import "./../../../../node_modules/c3/c3.min.css";
#navLargeMode {
  height: 1.4em;
  width: 1.4em;
}
#title {
  color: black;
}
.tableheader {
  height: 2.5em;
  background-color: #e3e3e3;
  border-top: 1px solid whitesmoke;
  padding-top: 0.5em;
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
tbody tr {
  background-color: #ffffff !important ;
}
tbody tr:hover {
  border-top: 2px solid darkgray !important;
  border-bottom: 2px solid darkgray !important;
}
</style>
