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
  <div class="px-2 pt-2 backgrd-col">
    <v-row v-feature="unsupportedFeatures.performance">
      <v-col class="pt-0">
        <v-card class="pa-2">
          <cortx-stats-medium />
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="3" lg="3" xl="3" class="pt-0" v-feature="unsupportedFeatures.capacity">
        <v-card class="pa-2" height="100%">
          <cortx-dashboard-capacity-gauge />
        </v-card>
      </v-col>
      <v-col md="9" lg="9" xl="9" sm="12" class="pt-0 pl-0" v-feature="unsupportedFeatures.alerts">
        <v-row>
          <v-col class="pt-0">
            <v-card class="pa-2">
              <cortx-dashboard-cluster-health-card />
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pt-0">
            <v-card class="pa-2">
              <cortx-dashboard-alert-card />
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";
import CortxStatsMedium from "./stats/stats-medium.vue";
import CortxDashboardCapacityGauge from "./cortx-dashboard-capacity-gauge.vue";
import { EVENT_BUS } from "../../main";
import { unsupportedFeatures } from "../../common/unsupported-feature";
import CortxDashboardAlertCard from "./cortx-dashboard-alert-card.vue";
import CortxDashboardClusterHealthCard from "./cortx-dashboard-cluster-health-card.vue";

@Component({
  name: "cortx-dashboard",
  components: {
    cortxStatsMedium: CortxStatsMedium,
    cortxDashboardCapacityGauge: CortxDashboardCapacityGauge,
    cortxDashboardAlertCard :CortxDashboardAlertCard,
    cortxDashboardClusterHealthCard :CortxDashboardClusterHealthCard

  }
})
export default class CortxDashboard extends Vue {
  public alertTblRowHeight: number = 0;
  public alertTblRowHeightPx: string = "";
  public chartRowHeightPx: string = "";
  public alertSectionColNumber: number = 8;
  public unsupportedFeatures = unsupportedFeatures;

  @Ref("capacity_col")
  public capacityColRef: any;

  public created() {
    window.addEventListener("resize", this.resizeComponents);
  }

  public mounted() {
    /**
     * If Capacity feature is hidden, alerts table should take full width as performance graph
     */
    if (this.capacityColRef && this.capacityColRef.hidden) {
      this.alertSectionColNumber = 12;
    } else {
      this.alertSectionColNumber = 8;
    }
  }

  public beforeMount() {
    this.calculateComponentsHeight();
  }

  public destroyed() {
    window.removeEventListener("resize", this.resizeComponents);
  }

  public resizeComponents() {
    this.calculateComponentsHeight();
    EVENT_BUS.$emit("windowResized", this.alertTblRowHeight);
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
    this.alertTblRowHeight = calcHeight;
    this.alertTblRowHeightPx = this.alertTblRowHeight + "px";
  }
}
</script>
<style lang="scss" scoped>
.backgrd-col {
  background-color: gray;
}
</style>
