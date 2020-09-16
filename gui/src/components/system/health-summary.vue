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
  <div class="cortx-health-summary-container">
    <label class="cortx-text-lg cortx-text-bold cortx-float-l">HW Health</label>
    <div class="cortx-float-l cortx-cursor-pointer" v-if="healthSummary.good && healthSummary.good > 0" @click="$router.push(healthBySeverityRoute + 'ok')">
      <div class="cortx-summary-chip cortx-chip-ok cortx-float-l ml-2">
        <div class="summary-count">
          <span class="cortx-text-sm">{{ healthSummary.good?healthSummary.good:0 }}</span>
        </div>
      </div>
    </div>
    <div class="cortx-float-l cortx-cursor-pointer" v-if="healthSummary.warning && healthSummary.warning > 0" @click="$router.push(healthBySeverityRoute + 'warning')">
      <div class="cortx-summary-chip cortx-chip-warning cortx-float-l ml-2">
        <div class="summary-count">
          <span class="cortx-text-sm">{{ healthSummary.warning? healthSummary.warning : 0 }}</span>
        </div>
      </div>
    </div>
    <div class="cortx-float-l cortx-cursor-pointer" v-if="healthSummary.critical && healthSummary.critical > 0" @click="$router.push(healthBySeverityRoute + 'critical')">
      <div class="cortx-summary-chip cortx-chip-alert cortx-float-l ml-2">
        <div class="summary-count">
          <span class="cortx-text-sm">{{ healthSummary.critical? healthSummary.critical : 0 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { HealthSummary } from "../../models/system";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";

@Component({
  name: "cortx-health-summary"
})
export default class CortxHealthSummary extends Vue {
  public healthSummary: HealthSummary = {
    good: 0,
    fault: 0,
    degraded: 0,
    total: 0,
    unrecoverable: 0,
    critical: 0,
    warning: 0,
  };

  public healthBySeverityRoute: string = "/health/healthview/severity/";

  public async mounted() {
    await this.getHealthSummary();
  }

  public async getHealthSummary() {
    const res: any = await Api.getAll(apiRegister.health_summary);
    if (res && res.data) {
      const healthSummaryResp = res.data.health_summary;
      this.healthSummary.good = healthSummaryResp.good
        ? healthSummaryResp.good
        : 0;
      this.healthSummary.degraded = healthSummaryResp.degraded
        ? healthSummaryResp.degraded
        : 0;
      this.healthSummary.fault = healthSummaryResp.fault
        ? healthSummaryResp.fault
        : 0;
      this.healthSummary.total = healthSummaryResp.total
        ? healthSummaryResp.total
        : 0;
      this.healthSummary.critical = healthSummaryResp.critical
        ? healthSummaryResp.critical
        : 0;
      this.healthSummary.warning = healthSummaryResp.warning
        ? healthSummaryResp.warning
        : 0;
      this.healthSummary.unrecoverable = healthSummaryResp.unrecoverable
        ? healthSummaryResp.unrecoverable
        : 0;
    }
  }
}
</script>
<style lang="scss" scoped>
.cortx-health-summary-container {
  height: 1.875em;
}
.cortx-summary-chip {
  display: flex;
  min-height: 16px;
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
    min-width: 33px;
  }
}
</style>
