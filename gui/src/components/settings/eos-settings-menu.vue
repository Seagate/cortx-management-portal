/*****************************************************************************
 Filename:          eos-settings-menu.vue
 Description:       Settings menu component.

 Creation Date:     31/12/2019
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
    <div class="eos-menu-card-layout">
      <label class="eos-text-lg eos-text-bold eos-float-l eos-menu-card-title">Notifications</label>
      <button type="button" class="eos-btn-tertiary eos-float-r" disabled>Manage</button>
    </div>
    <div class="eos-menu-card-layout">
      <label class="eos-text-lg eos-text-bold eos-float-l eos-menu-card-title">User</label>
      <button type="button" class="eos-btn-tertiary eos-float-r" @click="$router.push('/settings/usersettinglocal')">Manage</button>
    </div>
    <div class="eos-menu-card-layout">
      <label class="eos-text-lg eos-text-bold eos-float-l eos-menu-card-title">UDX</label>
      <button type="button" class="eos-btn-tertiary eos-float-r" @click="$router.push('/settings/udx-registration')">Manage</button>
    </div>
    <div class="eos-menu-card-layout">
      <label class="eos-text-lg eos-text-bold eos-float-l eos-menu-card-title">Updates</label>
      <button type="button" class="eos-btn-tertiary eos-float-r" disabled>Manage</button>
      <div style="margin-top: 3em;">
        <label class="eos-text-sm">Up to date</label>
      </div>
    </div>
    <div class="eos-menu-card-layout">
      <label class="eos-text-lg eos-text-bold eos-float-l eos-menu-card-title">Privacy</label>
      <button type="button" class="eos-btn-tertiary eos-float-r" disabled>Manage</button>
    </div>
    <div class="eos-wrap-height-menu-card-layout">
      <button type="button" class="eos-btn-tertiary">Quit service</button>
    </div>
    <div class="eos-wrap-height-menu-card-layout">
      <button type="button" class="eos-btn-tertiary">Restart service</button>
    </div>
    <div class="eos-wrap-height-menu-card-layout">
      <button type="button" class="eos-btn-tertiary">About</button>
    </div>
  </div>
</template>
 <script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

@Component({
  name: "eos-settings-menu"
})
export default class EosSettingsMenu extends Vue {}
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