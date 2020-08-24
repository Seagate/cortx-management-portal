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
  <div class="eos-p-2">
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
      class="eos-menu-card-layout"
    >
      <div>
        <label
          class="eos-text-lg eos-text-bold eos-float-l eos-menu-card-title"
        >{{Object.keys(menuItem)[0]}}</label>
        
        <div
          class="eos-summary-chip eos-chip-ok eos-float-l ml-2"
          v-if="menuItem[Object.keys(menuItem)[0]].health_summary.good && menuItem[Object.keys(menuItem)[0]].health_summary.good > 0"
        >
          <div class="summary-count">
            <label
              class="eos-text-sm"
            >{{ menuItem[Object.keys(menuItem)[0]].health_summary.good?menuItem[Object.keys(menuItem)[0]].health_summary.good:0 }}</label>
          </div>
        </div>
        <div
          class="eos-summary-chip eos-chip-warning eos-float-l ml-2"
          v-if="menuItem[Object.keys(menuItem)[0]].health_summary.warning && menuItem[Object.keys(menuItem)[0]].health_summary.warning > 0"
        >
          <div class="summary-count">
            <label
              class="eos-text-sm"
            >{{menuItem[Object.keys(menuItem)[0]].health_summary.warning? menuItem[Object.keys(menuItem)[0]].health_summary.warning : 0 }}</label>
          </div>
        </div>
        <div
          class="eos-summary-chip eos-chip-alert eos-float-l ml-2"
          v-if="menuItem[Object.keys(menuItem)[0]].health_summary.critical && menuItem[Object.keys(menuItem)[0]].health_summary.critical > 0"
        >
          <div class="summary-count">
            <label
              class="eos-text-sm"
            >{{menuItem[Object.keys(menuItem)[0]].health_summary.critical? menuItem[Object.keys(menuItem)[0]].health_summary.critical : 0 }}</label>
          </div>
        </div>
        <button
          type="button"
          class="eos-btn-tertiary eos-float-r"
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
import { AlertObject } from "../../models/alert";
import { HealthSummary } from "../../models/system";
@Component({
  name: "eos-health-submenu"
})
export default class EosHealthSubmenu extends Vue {
  public alertObject: AlertObject = {} as AlertObject;
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
.eos-menu-card-layout {
  height: 4em;
  width: 56.25em;
  padding-left: 1em;
  padding-top: 0.5em;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.eos-menu-card-title {
  margin-top: 0.313em;
}
.eos-summary-chip {
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