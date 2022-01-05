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
  <div class="dashboard-wrapper">
    <div class="dashboard-container pa-4">
      <v-row class="top-row">
        <v-card
          class="capacity-card pa-3"
          v-feature="unsupportedFeatures.capacity"
        >
          <cortx-dashboard-capacity-gauge />
        </v-card>

        <v-card class="storage-components-card pa-3">
          <cortx-dashboard-storage-components />
        </v-card>

        <v-card class="performance-card pa-3">
          <cortx-dashboard-performance-card />
        </v-card>
      </v-row>

      <v-row class="bottom-row">
        <v-card class="health-card pa-3">
          <cortx-dashboard-cluster-health-card />
        </v-card>

        <v-card class="alert-card pa-3">
          <cortx-dashboard-alert-card />
        </v-card>

        <v-card class="background-activities-card pa-3">
          <cortx-dashboard-background-activities />
        </v-card>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";
import { unsupportedFeatures } from "../../common/unsupported-feature";
import CortxDashboardCapacityGauge from "./cortx-dashboard-capacity-gauge.vue";
import CortxDashboardStorageComponents from "./cortx-dashboard-storage-components.vue";
import CortxDashboardPerformanceCard from "./cortx-dashboard-performance-card.vue";
import CortxDashboardClusterHealthCard from "./cortx-dashboard-cluster-health-card.vue";
import CortxDashboardAlertCard from "./cortx-dashboard-alert-card.vue";
import CortxDashboardBackgroundActivities from "./cortx-dashboard-background-activities.vue";

@Component({
  name: "cortx-dashboard",
  components: {
    CortxDashboardCapacityGauge,
    CortxDashboardStorageComponents,
    CortxDashboardPerformanceCard,
    CortxDashboardClusterHealthCard,
    CortxDashboardAlertCard,
    CortxDashboardBackgroundActivities
  }
})
export default class CortxDashboard extends Vue {
  public chartRowHeightPx: string = "";
  public unsupportedFeatures = unsupportedFeatures;
  @Ref("capacity_col")
  public created() {
    window.addEventListener("resize", this.resizeComponents);
  }

  public beforeMount() {
    this.calculateComponentsHeight();
  }

  public destroyed() {
    window.removeEventListener("resize", this.resizeComponents);
  }
  public resizeComponents() {
    this.calculateComponentsHeight();
  }
  public calculateComponentsHeight() {
    /**
     * Need to subtract header height(50px) and container padding(30px)
     * i.e. 80px and divide it by 2 for both halves.
     */
    const calcHeight: number = Math.floor((window.innerHeight - 80) / 2);
    /**
     * Check if the calculated height is less than minimum 290px
     * the assign 290px height to chartRowHeightPx
     */
    if (calcHeight < 290) {
      this.chartRowHeightPx = 290 + "px";
    } else {
      this.chartRowHeightPx = calcHeight + "px";
    }
  }
}
</script>
<style lang="scss" scoped>
.dashboard-wrapper {
  background-color: #f7f7f7;
  overflow: auto;
}
.dashboard-container {
  background-color: transparent;
  height: calc(100vh - 60px);
  max-width: 1260px;
  // margin: 0 auto;
}
.top-row,
.bottom-row {
  min-height: min(50%, 400px);
  padding: 12px;
  display: flex;
  flex-wrap: nowrap;
  gap: 20px;
}
.capacity-card,
.storage-components-card,
.performance-card,
.health-card,
.alert-card,
.background-activities-card {
  flex-grow: 1;
  width: 33.33%;
}
</style>
