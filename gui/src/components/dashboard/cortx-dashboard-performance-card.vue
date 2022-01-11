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
  <div class="performance-widget-container">
    <cortx-card :title="$t('dashboard.performance')">
      <div class="performance-cards-container">
        <template v-for="(cardDetail, index) in performanceCardDetails">
          <cortx-dashboard-info-card
            :title="cardDetail.title"
            :description="cardDetail.description"
            :navPath="cardDetail.navPath"
            :callBack="infoCardCallBack"
            :imgUrl="cardDetail.imgUrl"
            :key="index"
          />
        </template>
      </div>
    </cortx-card>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CortxDashboardInfoCard from "./cortx-dashboard-info-card.vue";
import CortxCard from "./cortx-card.vue";

@Component({
  name: "cortx-dashboard-performance-card",
  components: { CortxDashboardInfoCard, CortxCard }
})
export default class CortxDashboardPerformanceCard extends Vue {
  public performanceCardDetails = [
    {
      title: "5",
      description: this.$t("dashboard.readThroughput"),
      imgUrl: "dashboard/performance/read-throughput-good.svg",
      navPath: "/performance"
    },
    {
      title: "22",
      description: this.$t("dashboard.writeThroughput"),
      imgUrl: "dashboard/performance/write-throughput-good.svg",
      navPath: "/performance"
    }
  ];

  infoCardCallBack(routePath: string) {
    this.$router.push(routePath);
  }
}
</script>
<style lang="scss" scoped>
.performance-cards-container {
  display: flex;
  flex-direction: column;
}
.performance-cards-container > * {
  margin-bottom: 1em;
  justify-content: flex-start;
}
</style>
