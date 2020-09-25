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
    <v-row style="border-bottom: 2px solid rgba(0, 0, 0, 0.12);">
      <v-col class="pt-0" cols="12">
        <cortx-stats-medium />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" style="border-right: 2px solid rgba(0, 0, 0, 0.12);">
        <cortx-capacity-guage />
      </v-col>
      <v-col cols="8">
        <cortx-alert-medium />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CortxAlertMedium from "./../alerts/alert-medium.vue";
import CortxStatsMedium from "./stats/stats-medium.vue";
import CortxCapacityGuage from "./capacity-gauge.vue";
import * as c3 from "c3";

@Component({
  name: "cortx-dashboard",
  components: {
    cortxAlertMedium: CortxAlertMedium,
    cortxStatsMedium: CortxStatsMedium,
    cortxCapacityGuage: CortxCapacityGuage
  }
})
export default class Dashboard extends Vue {}
</script>
<style lang="scss" scoped>
.page {
  position: relative;
}
</style>
