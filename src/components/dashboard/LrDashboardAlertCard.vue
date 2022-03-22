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
  <div class="alert-widget-container">
    <SgtCard title="alerts" :showZoomIcon="true" @zoom-click="zoomIconHandler">
      <div class="alert-cards-container">
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
    </SgtCard>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LrDashboardInfoCard from "./LrDashboardInfoCard.vue";
import SgtCard from "@/SeagateShared/SgtCard/SgtCard.vue";
import { AlertData, DashboardCardDetail } from "./LrDashboardData.model";
import { Api } from "../../services/Api";
import { dashboardCardData } from "./LrDashboardCardData.constant";

@Component({
  name: "LrDashboardAlertCard",
  components: { LrDashboardInfoCard, SgtCard },
})
export default class LrDashboardAlertCard extends Vue {
  public dashboardCardDetails: DashboardCardDetail[] = [];

  public async mounted() {
    const data = (await Api.getData("/dashboard/alerts", {
      isDummy: true,
    })) as AlertData;
    this.dashboardCardDetails = dashboardCardData.alerts.map((datum) => ({
      ...datum,
      title: data[datum.description as keyof AlertData],
    }));
  }

  cardClickHandler(routePath: string) {
    this.$router.push(routePath);
  }

  zoomIconHandler() {
    this.$router.push("/alerts");
  }
}
</script>
<style lang="scss" scoped>
.alert-cards-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.alert-cards-container > * {
  width: 48%;
  margin-bottom: 1em;
}
.alert-cards-container > *:last-child {
  width: 100%;
}
.alert-cards-container > *:not(:last-child) {
  justify-content: flex-start;
}
</style>
