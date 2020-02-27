/*****************************************************************************
 Filename:          health-summary.vue
 Description:       Health summary Component

 Creation Date:     21/02/2020
 Author:            Sri Bhargav Metta

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <div class="eos-health-summary-container">
    <label class="eos-text-lg eos-text-bold eos-float-l">Health summary</label>
    <div class="eos-float-r">
      <div class="eos-summary-chip eos-chip-ok eos-float-l ml-2">
        <div class="summary-label">
          <label class="eos-text-md">Healthy</label>
        </div>
        <div class="summary-count">
          <label class="eos-text-sm">{{ healthSummary.good }}</label>
        </div>
      </div>
      <div class="eos-summary-chip eos-chip-warning eos-float-l ml-2">
        <div class="summary-label">
          <label class="eos-text-md">Degraded</label>
        </div>
        <div class="summary-count">
          <label class="eos-text-sm">{{ healthSummary.degraded }}</label>
        </div>
      </div>
      <div class="eos-summary-chip eos-chip-alert eos-float-l ml-2">
        <div class="summary-label">
          <label class="eos-text-md">Faulty</label>
        </div>
        <div class="summary-count">
          <label class="eos-text-sm">{{ healthSummary.fault }}</label>
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
  name: "eos-health-summary"
})
export default class EosHealthSummary extends Vue {
  public healthSummary: HealthSummary = {
    good: 0,
    fault: 0,
    degraded: 0
  };

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
    }
  }

}
</script>
<style lang="scss" scoped>
.eos-health-summary-container {
  height: 1.875em;
}
.eos-summary-chip {
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
    margin-left: 8px;
    min-width: 22px;
  }
}
</style>
