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
  <div id="capacityContainer">
    <div>
      <div class="cortx-text-lg cortx-text-bold" id="capacity-title">
        {{ $t("dashboard.capacity") }}
      </div>
    </div>

    <div class="capacity-info-wrapper d-flex flex-column">
      <div class="cortx-capacity-container" id="gauge_capacity"></div>
      <div class="legends-and-value mt-3">
        <div class="used-section">
          <div class="d-flex">
            <div class="capacity-badge capacity-green mt-1"></div>
            <div class="content-section ml-1">
              <span class="legend-name">{{ $t("dashboard.used") }}</span>
              <div class="storage-stats">
                <span>25TB</span>
                <span class="text-separtor mx-1">|</span>
                <span>80%</span>
              </div>
            </div>
          </div>
        </div>
        <div class="available-section">
          <div class="d-flex">
            <div class="capacity-badge capacity-available"></div>
            <div class="content-section ml-1">
              <span class="legend-name">{{ $t("dashboard.available") }}</span>
              <div class="storage-stats">
                <span>25TB</span>
                <span class="text-separtor">|</span>
                <span>80%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <table class="mt-3" id="capacity-table">
      <tr id="capacity-used">
        <td class="width-25">
          <div v-bind:class="usedLegendClass"></div>
        </td>
        <td class="width-110" id="capacity-used-text">
          {{ $t("dashboard.used") }}
        </td>
        <td>{{ capacityChartVal(capacityDetails.used) }}</td>
      </tr>
      <tr id="capacity-available">
        <td>
          <div class="capacity-badge capacity-available"></div>
        </td>
        <td id="capacity-available-text">{{ $t("dashboard.available") }}</td>
        <td>{{ capacityChartVal(capacityDetails.avail) }}</td>
      </tr>
    </table> -->

    <!-- <div class="mt-2 mb-2 cortx-capacity-separator"></div> -->
    <!-- <table class="mt-3" id="capacity-total-table">
      <tr id="capacity-total">
        <td class="width-25">
          <div></div>
        </td>
        <td class="width-110" id="capacity-total-text">
          {{ $t("dashboard.total") }}
        </td>
        <td>{{ capacityChartVal(capacityDetails.size) }}</td>
      </tr>
    </table> -->
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";
import { DiskCapacityDetails } from "./../../models/performance-stats";
const i18n = require("./dashboard.json");
import * as c3 from "c3";

@Component({
  name: "cortx-dashboard-capacity-gauge",
  i18n: {
    messages: i18n
  }
})
export default class CortxDashboardCapacityGauge extends Vue {
  public usedLegendClass = "capacity-badge";
  public chartDataVal: number;
  public created() {
    const demoData = [["x", 0]];
    const capacityRes = this.$store
      .dispatch("performanceStats/getCapacityStats")
      .then(capacityC3Data => {
        if (capacityC3Data) {
          this.chartDataVal = capacityC3Data[0][1] ? capacityC3Data[0][1] : 0;
          if (this.chartDataVal < 50) {
            this.usedLegendClass += ` capacity-green`;
          }
          if (this.chartDataVal >= 50) {
            this.usedLegendClass += " capacity-orange";
          }
          if (this.chartDataVal >= 90) {
            this.usedLegendClass += " capacity-red";
          }
        }
        const chart = c3.generate({
          bindto: "#gauge_capacity",
          legend: {
            show: false
          },
          data: {
            columns: capacityC3Data ? capacityC3Data : demoData,
            type: "gauge"
          },
          gauge: {
            label: {
              show: false
            }
          },
          color: {
            pattern: ["#60B044", "#F7A528", "#DC1F2E"], // the three color levels for the percentage values.
            threshold: {
              values: [50, 90, 100]
            }
          },
          size: {
            height: window.innerHeight < 900 ? 110 : 180
          }
        });
      });
  }

  get capacityDetails() {
    return this.$store.getters["performanceStats/getCapacity"];
  }

  public capacityChartVal(chartVal: number) {
    let chartValWithUnit = "";
    const unitList = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    for (const unit of unitList) {
      chartVal = chartVal / 1024;
      if (chartVal / 100 < 10) {
        chartValWithUnit = `${chartVal.toFixed(2)} ${unit}`;
        break;
      }
    }
    return chartValWithUnit;
  }
}
</script>
<style lang="scss" scoped>
@import "./../../../node_modules/c3/c3.min.css";

.capacity-badge {
  height: 14px;
  width: 14px;
  border-radius: 50%;
}
.capacity-green {
  background: rgb(110, 190, 73);
}
.capacity-orange {
  background-color: #f7a528;
}
.capacity-red {
  background-color: #dc1f2e;
}
.capacity-available {
  background: rgb(158, 158, 158);
}
.cortx-capacity-separator {
  width: 100%;
  border-top: 1px solid #e3e3e3;
}
.width-25 {
  width: 25px;
}
.width-110 {
  width: 110px;
}
@media screen and (min-height: 600px) {
  .cortx-capacity-container {
    height: 110px;
  }
}
@media screen and (min-height: 900px) {
  .cortx-capacity-container {
    height: 180px;
  }
}
</style>
