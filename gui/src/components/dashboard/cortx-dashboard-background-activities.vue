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
  <div class="bg-activities-widget-container">
    <cortx-card
      :title="$t('dashboard.backgroundActivities')"
      :zoomIconCallback="zoomIconHandler"
    >
      <div class="bg-activities-cards-container">
        <template v-for="(cardDetail, index) in bgActivitiesCardDetails">
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
  name: "cortx-dashboard-background-activities",
  components: { CortxDashboardInfoCard, CortxCard }
})
export default class CortxDashboardBackgroundActivities extends Vue {
  public bgActivitiesCardDetails = [
    {
      title: "05",
      description: this.$t("dashboard.tasks"),
      imgUrl: "dashboard/bg-activities/bg-tasks.svg",
      navPath: ""
    }
  ];

  infoCardCallBack(routePath: string) {
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
