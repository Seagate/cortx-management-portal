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
import { Component, Vue, Mixins } from "vue-property-decorator";
import CortxDashboardInfoCard from "./cortx-dashboard-info-card.vue";
import AlertsMixin from "../../mixins/alerts";

@Component({
  name: "cortx-dashboard-alert-card",
  components: { CortxDashboardInfoCard }
})
export default class CortxDashboardAlertCard extends Mixins(AlertsMixin) {
  public fatalCount = 0;
  public criticalCount = 0;
  public errorCount = 0;
  public warningCount = 0;
  public informationalCount = 0;

  public async mounted() {
    await this.onSortPaginate();
    this.fatalCount = this.alertObject.alerts.filter(
      alert => alert.severity === "alert"
    ).length;
    this.criticalCount = this.alertObject.alerts.filter(
      alert => alert.severity === "critical"
    ).length;
    this.errorCount = this.alertObject.alerts.filter(
      alert => alert.severity === "error"
    ).length;
    this.warningCount = this.alertObject.alerts.filter(
      alert => alert.severity === "warning"
    ).length;
    this.informationalCount = this.alertObject.alerts.filter(
      alert => alert.severity === "informational"
    ).length;
  }

  get alertCardDetails() {
    return [
      {
        title: this.fatalCount,
        description: "Fatal",
        iconClass: "fatal-alert",
        navPath: "/alerts"
      },
      {
        title: this.criticalCount,
        description: "Critical",
        iconClass: "fatal-alert",
        navPath: "/alerts"
      },
      {
        title: this.errorCount,
        description: "Error",
        iconClass: "error-alert",
        navPath: "/alerts"
      },
      {
        title: this.warningCount,
        description: "Warning",
        iconClass: "warning-alert",
        navPath: "/alerts"
      },
      {
        title: this.informationalCount,
        description: "Informational",
        iconClass: "informational-alert",
        navPath: "/alerts"
      }
    ];
  }

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
.alert-cards-container > *:not(:last-child) {
  justify-content: flex-start;
}
</style>
