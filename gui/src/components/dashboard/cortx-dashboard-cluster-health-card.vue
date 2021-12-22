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
  <div class="health-widget-container">
    <cortx-card
      title="dashboard.clusterHealth"
      :zoomIconCallback="zoomIconHandler"
    >
      <cortx-dashboard-info-card
        title="mycluster"
        description="dashboard.degraded"
        navPath="/health"
        :callBack="infoCardCallBack"
        :imgUrl="getClusterHealthImgUrl('degraded')"
      />
      <p class="cortx-text-lg cortx-text-bold">{{ $t("dashboard.nodes") }}</p>
      <div class="node-health-cards-container">
        <template v-for="(cardDetail, index) in nodeCardDetails">
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
import CortxCard from "../widgets/cortx-card.vue";

@Component({
  name: "cortx-dashboard-cluster-health-card",
  components: { CortxDashboardInfoCard, CortxCard }
})
export default class CortxDashboardClusterHealthCard extends Vue {
  public nodeCardDetails = [
    {
      title: "5",
      description: "dashboard.onlineNodes",
      imgUrl: this.getNodeImgUrl(5, "online"),
      navPath: "/health"
    },
    {
      title: "5",
      description: "dashboard.offlineNodes",
      imgUrl: this.getNodeImgUrl(5, "offline"),
      navPath: "/health"
    },
    {
      title: "0",
      description: "dashboard.failedNodes",
      imgUrl: this.getNodeImgUrl(0, "failed"),
      navPath: "/health"
    },
    {
      title: "5",
      description: "dashboard.degradedNodes",
      imgUrl: this.getNodeImgUrl(5, "degraded"),
      navPath: "/health"
    }
  ];

  infoCardCallBack(routePath: string) {
    this.$router.push(routePath);
  }

  getClusterHealthImgUrl(healthType: "offline" | "degraded" | "failed") {
    const healthImageUrl = {
      offline: "dashboard/health/offline-cluster.svg",
      degraded: "dashboard/health/degraded-cluster.svg",
      failed: "dashboard/health/failed-cluster.svg"
    };
    return healthImageUrl[healthType];
  }

  getNodeImgUrl(
    nodeCount: number,
    nodeType: "online" | "offline" | "failed" | "degraded"
  ) {
    const nodeImgUrl = {
      online: "dashboard/health/online-nodes.svg",
      offline: "dashboard/health/offline-nodes.svg",
      failed: "dashboard/health/failed-nodes.svg",
      degraded: "dashboard/health/degraded-nodes.svg"
    };
    if (nodeCount === 0) {
      return "dashboard/health/zero-nodes.svg";
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
