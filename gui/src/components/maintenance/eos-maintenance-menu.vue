/*****************************************************************************
 Filename:          eos-maintenance-menu.vue
 Description:       Maintanance menu component.

 Creation Date:     31/12/2019
 Author:            Jayshree. A. More

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <div>
    <div class="eos-menu-card-layout">
      <label class="eos-text-lg eos-text-bold eos-float-l eos-menu-card-title">HA</label>
      <button type="button" class="eos-btn-tertiary eos-float-r" @click="$router.push('/maintenance/resource')" >Manage</button>
    </div>
  </div>
</template>
 <script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

@Component({
  name: "eos-maintenance-menu"
})
export default class EosMaintenanceMenu extends Vue {}
</script>
<style lang="scss" scoped>
.eos-menu-card-layout {
  height: 6.250em;
  width: 56.250em;
  padding-left: 1em;
  padding-top: 0.500em;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.eos-wrap-height-menu-card-layout {
  width: 56.250em;
  padding-top: 0.500em;
  padding-bottom: 0.500em;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.eos-menu-card-title {
  margin-top: 0.313em;
}
</style>