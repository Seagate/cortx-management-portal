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
    <div class="title-section">
      <p class="widget-title cortx-text-lg cortx-text-bold">Cluster Health</p>
      <div class="cortx-zoom-icon" @click="zoomIconHandler"></div>
    </div>
    <cortx-dashboard-info-card
      title="mycluster"
      description="Degraded"
      navPath="/health"
      :callBack="infoCardCallBack"
      :imgUrl="getClusterHealthImgUrl('degraded')"
    />
    <p class="cortx-text-lg cortx-text-bold">Nodes</p>
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
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CortxDashboardInfoCard from "./cortx-dashboard-info-card.vue";

@Component({
  name: "cortx-dashboard-cluster-health-card",
  components: { CortxDashboardInfoCard }
})
export default class CortxDashboardClusterHealthCard extends Vue {
  public nodeCardDetails = [
    {
      title: "5",
      description: "Online Nodes",
      imgUrl: this.getNodeImgUrl(5, "online"),
      navPath: "/health"
    },
    {
      title: "5",
      description: "Offline Nodes",
      imgUrl: this.getNodeImgUrl(5, "offline"),
      navPath: "/health"
    },
    {
      title: "0",
      description: "Failed Nodes",
      imgUrl: this.getNodeImgUrl(0, "failed"),
      navPath: "/health"
    },
    {
      title: "5",
      description: "Degraded Nodes",
      imgUrl: this.getNodeImgUrl(5, "degraded"),
      navPath: "/health"
    }
  ];

  infoCardCallBack(routePath: string) {
    this.$router.push(routePath);
  }

  getClusterHealthImgUrl(healthType: "offline" | "degraded" | "failed") {
    switch (healthType) {
      case "offline":
        return "dashboard/health/offline-cluster.svg";
      case "degraded":
        return "dashboard/health/degraded-cluster.svg";
      case "failed":
        return "dashboard/health/failed-cluster.svg";
    }
  }

  getNodeImgUrl(
    nodeCount: number,
    nodeType: "online" | "offline" | "failed" | "degraded"
  ) {
    if (nodeCount === 0) {
      return "dashboard/health/zero-nodes.svg";
    }
    switch (nodeType) {
      case "online":
        return "dashboard/health/online-nodes.svg";
      case "offline":
        return "dashboard/health/offline-nodes.svg";
      case "failed":
        return "dashboard/health/failed-nodes.svg";
      case "degraded":
        return "dashboard/health/degraded-nodes.svg";
    }
  }

  zoomIconHandler() {
    this.$router.push("/health");
  }
}
</script>
<style lang="scss" scoped>
.title-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.title-section .widget-title {
  margin: 0;
}
.title-section > .cortx-zoom-icon {
  height: 20px;
  width: 20px;
  cursor: pointer;
}
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
