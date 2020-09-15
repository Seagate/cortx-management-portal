/*
* CORTX-CSM: CORTX Management web and CLI interface.
* Copyright (c) 2020 Seagate Technology LLC and/or its Affiliates
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
* please email opensource@seagate.com or cortx-questions@seagate.com.
*/
<template>
  <div class="cortx-p-2">
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblDns">
        Health:
      </div>
      <div class="mt-3" id="lblMandatoryMsg">
        Displays the health of the storage enclosure and the servers (nodes) connected to it.
      </div>
    </div>

    <div
      v-for="menuItem in healthData"
      :key="Object.keys(menuItem)[0]"
      class="cortx-menu-card-layout"
    >
      <div>
        <label
          class="cortx-text-lg cortx-text-bold cortx-float-l cortx-menu-card-title"
        >{{Object.keys(menuItem)[0]}}</label>
        
        <div
          class="cortx-summary-chip cortx-chip-ok cortx-float-l cortx-cursor-pointer ml-2"
          v-if="menuItem[Object.keys(menuItem)[0]].health_summary.good && menuItem[Object.keys(menuItem)[0]].health_summary.good > 0"
          @click="$router.push(healthBySeverityRoute + 'ok?component_id=' + Object.keys(menuItem)[0])"
        >
          <div class="summary-count">
            <span
              class="cortx-text-sm"
            >{{ menuItem[Object.keys(menuItem)[0]].health_summary.good?menuItem[Object.keys(menuItem)[0]].health_summary.good:0 }}</span>
          </div>
        </div>
        <div
          class="cortx-summary-chip cortx-chip-warning cortx-float-l cortx-cursor-pointer ml-2"
          v-if="menuItem[Object.keys(menuItem)[0]].health_summary.warning && menuItem[Object.keys(menuItem)[0]].health_summary.warning > 0"
          @click="$router.push(healthBySeverityRoute + 'warning?component_id=' + Object.keys(menuItem)[0])"
        >
          <div class="summary-count">
            <span
              class="cortx-text-sm"
            >{{menuItem[Object.keys(menuItem)[0]].health_summary.warning? menuItem[Object.keys(menuItem)[0]].health_summary.warning : 0 }}</span>
          </div>
        </div>
        <div
          class="cortx-summary-chip cortx-chip-alert cortx-float-l cortx-cursor-pointer ml-2"
          v-if="menuItem[Object.keys(menuItem)[0]].health_summary.critical && menuItem[Object.keys(menuItem)[0]].health_summary.critical > 0"
          @click="$router.push(healthBySeverityRoute + 'critical?component_id=' + Object.keys(menuItem)[0])"
        >
          <div class="summary-count">
            <span
              class="cortx-text-sm"
            >{{menuItem[Object.keys(menuItem)[0]].health_summary.critical? menuItem[Object.keys(menuItem)[0]].health_summary.critical : 0 }}</span>
          </div>
        </div>
        <button
          id="view-healthbtn"
          type="button"
          class="cortx-btn-tertiary cortx-float-r"
          @click="$router.push({ name: 'healthview', query: { name: Object.keys(menuItem)[0] }})"
        >View</button>
      </div>
    </div>
  </div>
</template>
 <script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Api } from "./../../services/api";
import apiRegister from "./../../services/api-register";
import { HealthSummary } from "../../models/system";
@Component({
  name: "cortx-health-submenu"
})
export default class CortxHealthSubmenu extends Vue {
  public menuList: string[] = [];
  public healthData: any = {};
  public healthSummary: HealthSummary = {
    good: 0,
    fault: 0,
    degraded: 0,
    total: 0,
    unrecoverable: 0,
    critical: 0
  };
  public healthBySeverityRoute: string = "/health/healthview/severity/";

  public async mounted() {
    try {
      this.$store.dispatch("systemConfig/showLoaderMessage", {
        show: true,
        message: "Getting health info..."
      });
      const res = await Api.getAll(apiRegister.node_health);
      this.$store.dispatch("systemConfig/hideLoader");
      if (res && res.data) {
        this.healthData = res.data;
        for (let count = 0; count <= res.data.length - 1; count++) {
          const menu = Object.keys(res.data[count]);
          this.menuList.push(menu[0]);
        }
      }
    } catch {
      this.$store.dispatch("systemConfig/hideLoader");
    }
  }
}
</script>
<style lang="scss" scoped>
.cortx-menu-card-layout {
  height: 4em;
  width: 56.25em;
  padding-left: 1em;
  padding-top: 0.5em;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.cortx-menu-card-title {
  margin-top: 0.313em;
}
.cortx-summary-chip {
  display: flex;
  min-height: 16px;
  margin-top: 6px;
  min-width: 16px;
  border-radius: 2px;
  line-height: 1;
  text-align: center;
  color: #ffffff;
  padding: 3px;
  border-radius: 34px;
  .summary-label {
    padding: 2px 3px 3px 5px;
  }
  .summary-count {
    border: 2px solid #ffffff;
    border-radius: 34px;
    line-height: 1;
    padding: 0 3px 3px 3px;
    //margin-left: 8px;
    min-width: 33px;
  }
}
</style>