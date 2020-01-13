/*****************************************************************************
 Filename:          alert-details.vue
 Description:       Alert Details Component

 Creation Date:     10/01/2020
 Author:            Sri Bhargav Metta

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <div>
    <div class="eos-back-to-alerts-btn" @click="$router.push('/alerts')">
      <img :src="require('@/assets/arrow-left.svg')" />
      <span class="mt-1">Alerts</span>
    </div>Alert Details page
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "eos-alert-details"
})
export default class EosAlertDetails extends Vue {}
</script>

<style lang="scss" scoped >
.eos-back-to-alerts-btn {
  display: flex;
  cursor: pointer;
  width: 80px;
  color: #6ebe49;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 22px;
}
</style>
