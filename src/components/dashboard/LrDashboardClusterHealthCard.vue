<!--
* CORTX-CSM: CORTX Management web.
* Copyright (c) 2022 Seagate Technology LLC and/or its Affiliates
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
* please email opensource@seagate.com.
-->
<template>
  <div class="health-widget-container">
    <LrCard
      title="clusterHealth"
      :showZoomIcon="true"
      @zoom-click="zoomIconHandler"
    >
      <template v-if="clusterDetails.status">
        <LrDashboardInfoCard
          :title="clusterDetails.name"
          :description="`${clusterDetails.status}`"
          :imgUrl="getClusterHealthImgUrl(clusterDetails.status)"
          @click="cardClickHandler('/health')"
        />
      </template>
      <p class="text-h6 font-weight-medium">{{ $t("nodes") }}</p>
      <div class="node-health-cards-container">
        <template v-for="(cardDetail, index) in dashboardCardDetails">
          <LrDashboardInfoCard
            :key="index"
            :title="cardDetail.title"
            :description="cardDetail.description"
            :imgUrl="cardDetail.imgUrl"
            @click="cardClickHandler(cardDetail.navPath)"
          />
        </template>
      </div>
    </LrCard>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LrDashboardInfoCard from "./LrDashboardInfoCard.vue";
import LrCard from "../shared/LrCard.vue";
import {
  DashboardCardDetail,
  HealthData,
  ClusterDetails,
  NodeStatus,
} from "./LrDashboardData.model";
import { Api } from "../../services/Api";
import { dashboardCardData } from "./LrDashboardCardData.constant";

@Component({
  name: "LrDashboardClusterHealthCard",
  components: { LrDashboardInfoCard, LrCard },
})
export default class LrDashboardClusterHealthCard extends Vue {
  public dashboardCardDetails: DashboardCardDetail[] = [];
  public clusterDetails: ClusterDetails = {} as ClusterDetails;

  public async mounted() {
    const data = (await Api.getData("/dashboard/health", {
      isDummy: true,
    })) as HealthData;
    this.clusterDetails = data.cluster;
    this.dashboardCardDetails = dashboardCardData.clusterNodes.map((datum) => {
      const statusType = datum.description.split("Nodes")[0];
      const nodeCount = data.nodes[statusType as keyof NodeStatus];
      return {
        ...datum,
        title: nodeCount,
        imgUrl: this.getNodeImgUrl(nodeCount, statusType as keyof NodeStatus),
      };
    });
  }

  cardClickHandler(routePath: string) {
    this.$router.push(routePath);
  }

  getClusterHealthImgUrl(healthType: "offline" | "degraded" | "failed") {
    const healthImageUrl = {
      offline: "health-offline-cluster.svg",
      degraded: "health-degraded-cluster.svg",
      failed: "health-failed-cluster.svg",
    };
    return healthImageUrl[healthType];
  }

  getNodeImgUrl(
    nodeCount: number,
    nodeType: "online" | "offline" | "failed" | "degraded"
  ) {
    const nodeImgUrl = {
      online: "health-online-nodes.svg",
      offline: "health-offline-nodes.svg",
      failed: "health-failed-nodes.svg",
      degraded: "health-degraded-nodes.svg",
    };
    if (nodeCount === 0) {
      return "health-zero-nodes.svg";
    }
    return nodeImgUrl[nodeType];
  }

  zoomIconHandler() {
    this.$router.push("/health");
  }
}
</script>
<style lang="scss" scoped>
.node-health-cards-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.info-card-container {
  margin-bottom: 1em;
}
.health-widget-container > .info-card-container {
  width: 100%;
}
.node-health-cards-container > * {
  width: 48%;
  justify-content: flex-start;
}
</style>
