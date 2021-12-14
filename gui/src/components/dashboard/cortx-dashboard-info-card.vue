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
  <div class="info-card-container" @click="callBack(navPath)">
    <div class="dashboard-card-icon" :class="iconClass"></div>
    <div class="card-info">
      <span class="title">{{ title }}</span>
      <span class="description">{{ description }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "cortx-dashboard-info-card",
  components: {}
})
export default class CortxDashboardInfoCard extends Vue {
  @Prop({ required: true }) public iconClass: string;
  @Prop({ required: true }) public title: string;
  @Prop({ required: true }) public description: string;
  @Prop({ required: true }) public navPath: string;
  @Prop({ required: true }) public callBack: Function;
}
</script>

<style lang="scss" scoped>
.info-card-container {
  padding: 0.75em;
  border: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: none;
  transition: box-shadow 200ms ease-in-out;
}
.info-card-container:hover {
  box-shadow: 0px 6px 15px #e5e5e5;
}
.card-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 1em;
}
.dashboard-card-icon {
  height: 60px;
  width: 60px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}

// Below classes are for alert icons
.fatal-alert {
  background-image: url("../../assets/dashboard/alert/fatal-alert.svg");
}
.error-alert {
  background-image: url("../../assets/dashboard/alert/error-alert.svg");
}
.warning-alert {
  background-image: url("../../assets/dashboard/alert/warning-alert.svg");
}
.informational-alert {
  background-image: url("../../assets/dashboard/alert/informational-alert.svg");
}

//Below classes are for health widget icons
.cluster-health-warning {
  background-image: url("../../assets/dashboard/health/cluster-health-warning.svg");
}
.degraded-nodes {
  background-image: url("../../assets/dashboard/health/degraded-nodes.svg");
}
.failed-nodes {
  background-image: url("../../assets/dashboard/health/failed-nodes.svg");
}
.online-nodes {
  background-image: url("../../assets/dashboard/health/online-nodes.svg");
}
</style>
