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
  <div class="cortx-p-1">
    <v-row
      :style="{'min-height':chartRowHeightPx, 'border-bottom': '2px solid rgba(0, 0, 0, 0.12)'}"
    >
      <v-col class="pt-0 pb-0" md="12" style="height: 100%;">
        <cortx-stats-medium />
      </v-col>
    </v-row>
    <v-row :style="{'min-height':alertTblRowHeightPx}">
      <v-col v-feature="capacity"
        class="pt-2 pb-0 pr-0"
        md="4"
        :style="{'min-height':alertTblRowHeightPx, 'border-right': '2px solid rgba(0, 0, 0, 0.12)'}"
      >
        <cortx-capacity-guage />
      </v-col>
      <v-col class="pt-2 pb-0" md="8" style="height: 100%;">
        <cortx-alert-medium :parentHeight="alertTblRowHeight" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CortxAlertMedium from "./../alerts/alert-medium.vue";
import CortxStatsMedium from "./stats/stats-medium.vue";
import CortxCapacityGuage from "./capacity-gauge.vue";
import { EVENT_BUS } from "../../main";

@Component({
  name: "cortx-dashboard",
  components: {
    cortxAlertMedium: CortxAlertMedium,
    cortxStatsMedium: CortxStatsMedium,
    cortxCapacityGuage: CortxCapacityGuage
  }
})
export default class Dashboard extends Vue {
  public capacity: string = "capacity";
  public alertTblRowHeight: number = 0;
  public alertTblRowHeightPx: string = "";
  public chartRowHeightPx: string = "";

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
</style>
