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
  <div class="storage-components-widget-container">
    <SgtCard title="storageComponents">
      <div class="storage-cards-container">
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
import { Api } from "../../services/Api";
import {
  StorageComponentsData,
  DashboardCardDetail,
} from "./LrDashboardData.model";
import { dashboardCardData } from "./LrDashboardCardData.constant";

@Component({
  name: "LrDashboardStorageComponentsCard",
  components: { LrDashboardInfoCard, SgtCard },
})
export default class LrDashboardStorageComponentsCard extends Vue {
  public dashboardCardDetails: DashboardCardDetail[] = [];

  public async mounted() {
    const data = (await Api.getData("/dashboard/storage-components", {
      isDummy: true,
    })) as StorageComponentsData;
    this.dashboardCardDetails = dashboardCardData.storageComponents.map(
      (datum) => ({
        ...datum,
        title: data[datum.description as keyof StorageComponentsData],
      })
    );
  }

  cardClickHandler(routePath: string) {
    // nav path given in dashboardCardDetails will be received here and it can be used for redirects
  }
}
</script>
<style lang="scss" scoped>
.storage-cards-container {
  display: flex;
  flex-direction: column;
}
.storage-cards-container > * {
  margin-bottom: 1em;
  justify-content: flex-start;
}
</style>
