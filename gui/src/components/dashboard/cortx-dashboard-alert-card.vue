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
  <div class="alert-widget-container">
    <p class="cortx-text-lg cortx-text-bold">Alerts</p>
    <div class="alert-cards-container">
      <template v-for="(cardDetail, index) in alertCardDetails">
        <cortx-dashboard-info-card
          :title="cardDetail.title"
          :description="cardDetail.description"
          :iconClass="cardDetail.iconClass"
          :navPath="cardDetail.navPath"
          :callBack="infoCardCallBack"
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
  name: "cortx-dashboard-alert-card",
  components: { CortxDashboardInfoCard }
})
export default class CortxDashboardAlertCard extends Vue {
  public alertCardDetails = [
    {
      title: "05",
      description: "Fatal",
      iconClass: "fatal-alert",
      navPath: "/alerts"
    },
    {
      title: "05",
      description: "Critical",
      iconClass: "fatal-alert",
      navPath: "/alerts"
    },
    {
      title: "05",
      description: "Error",
      iconClass: "error-alert",
      navPath: "/alerts"
    },
    {
      title: "05",
      description: "Warning",
      iconClass: "warning-alert",
      navPath: "/alerts"
    },
    {
      title: "05",
      description: "Informational",
      iconClass: "informational-alert",
      navPath: "/alerts"
    }
  ];

  infoCardCallBack(routePath: string) {
    this.$router.push(routePath);
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
</style>
