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

    <div class="capacity-info-wrapper">
      <div class="capacity-info d-flex flex-column">
        <div class="cortx-capacity-container" id="gauge_capacity"></div>
        <div class="legends-and-value ml-7">
          <div class="used-section">
            <div class="d-flex">
              <div :class="usedLegendClass"></div>
              <div class="content-section">
                <span class="legend-name">{{ $t("dashboard.used") }}</span>
                <span>{{ capacityChartVal(capacityDetails.used) }}</span>
              </div>
            </div>
          </div>
          <div class="available-section">
            <div class="d-flex">
              <div class="capacity-badge capacity-available"></div>
              <div class="content-section">
                <span class="legend-name">{{ $t("dashboard.available") }}</span>
                <span>{{ capacityChartVal(capacityDetails.avail) }}</span>
              </div>
            </div>
          </div>
          <div class="total-section">
            Total - {{ capacityChartVal(capacityDetails.size) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";
import { DiskCapacityDetails } from "./../../models/performance-stats";
import * as c3 from "c3";
@Component({
  name: "cortx-dashboard-capacity-gauge"
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
            this.usedLegendClass += " capacity-green";
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
            height: window.innerHeight < 900 ? 150 : 180,
            width: 250
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
.legends-and-value > div {
  margin-top: 15px;
}
.capacity-info-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
.content-section {
  margin-left: 8px;
  width: min(200px, 75%);
  display: flex;
  justify-content: space-between;
}
.capacity-badge {
  height: 14px;
  width: 14px;
  margin-top: 5px;
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
    height: 50%;
  }
}
</style>
