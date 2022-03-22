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
  <div class="bg-activities-widget-container">
    <SgtCard
      title="backgroundActivities"
      :showZoomIcon="true"
      @zoom-click="zoomIconHandler"
    >
      <div class="bg-activities-cards-container">
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
import {
  DashboardCardDetail,
  BackgroundActivitiesData,
} from "./LrDashboardData.model";
import { Api } from "../../services/Api";
import { dashboardCardData } from "./LrDashboardCardData.constant";

@Component({
  name: "LrDashboardBgActivitiesCard",
  components: { LrDashboardInfoCard, SgtCard },
})
export default class LrDashboardBgActivitiesCard extends Vue {
  public dashboardCardDetails: DashboardCardDetail[] = [];

  public async mounted() {
    const data = (await Api.getData("/dashboard/background-activities", {
      isDummy: true,
    })) as BackgroundActivitiesData;
    this.dashboardCardDetails = dashboardCardData.bgActivities.map((datum) => ({
      ...datum,
      title: data[datum.description as keyof BackgroundActivitiesData],
    }));
  }

  cardClickHandler(routePath: string) {
    // nav path given in performanceCardDetails will be received here and it can be used for redirects
  }

  zoomIconHandler() {
    //Redirect to the background activities page when you have one
    // this.$router.push("/");
  }
}
</script>
<style lang="scss" scoped>
.bg-activities-cards-container {
  display: flex;
  flex-direction: column;
}
.bg-activities-cards-container > * {
  margin-bottom: 1em;
  justify-content: flex-start;
}
</style>
