/*****************************************************************************
 Filename:          settings-submenu.vue
 Description:       Settings Submenu

 Creation Date:     22/11/2019
 Author:            Vaibhav Bhavsar

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <div>
    <div class="tile pa-5 mb-3">
      <div class="submenu-title-container">
        <label class="title font-weight-bold">Notifications</label>
      </div>
      <div class="submenu-action-container">
        <v-btn class="text-capitalize" disabled text small color="green">Manage</v-btn>
      </div>
    </div>

    <div class="tile pa-5 mb-3">
      <div class="submenu-title-container">
        <label class="title font-weight-bold">User Settings</label>
      </div>
      <div class="submenu-action-container">
        <v-btn :to="'/usersettinglocal'" class="text-capitalize" text small color="green">Manage</v-btn>
      </div>
    </div>

    <div class="tile pa-5 mb-3">
      <div class="submenu-title-container">
        <label class="title font-weight-bold">UDX Settings</label>
      </div>
      <div class="submenu-action-container">
        <v-btn :to="'/udx-registration'" class="text-capitalize" text small color="green">Manage</v-btn>
      </div>
    </div>

    <div class="tile pa-5 mb-3">
      <div class="submenu-title-container">
        <label class="title font-weight-bold">Updates</label>
      </div>
      <div class="submenu-action-container">
        <v-btn class="text-capitalize" disabled text small color="green">Manage</v-btn>
      </div>
      <div style="clear: left; font-size: 12px; color: #B7B7B7;">
        <p>Up to Date</p>
      </div>
    </div>

    <div class="tile pa-5 mb-3">
      <div class="submenu-title-container">
        <label class="title font-weight-bold">Privacy</label>
      </div>
      <div class="submenu-action-container">
        <v-btn class="text-capitalize" disabled text small color="green">Details</v-btn>
      </div>
    </div>

    <div class="tile pa-5 mb-3">
      <div style="margin-top: 2px;">
        <v-btn class="text-capitalize" text small color="green">Quit Service</v-btn>
      </div>
    </div>

    <div class="tile pa-5 mb-3">
      <div style="margin-top: 2px;">
        <v-btn class="text-capitalize" text small color="green">Restart Service</v-btn>
      </div>
    </div>

    <div class="tile pa-5 mb-3">
      <div style="margin-top: 2px;">
        <v-btn class="text-capitalize" text small color="green">About</v-btn>
      </div>
    </div>
  </div>
</template>
 <script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

@Component({
  name: "eos-settings-submenu"
})
export default class EosSettingsSubmenu extends Vue {}
</script>
<style lang="scss" scoped>
.tile {
  background: #ffffff;
  border: 1px solid #e8e8e8;
  box-sizing: border-box;
  border-radius: 4px;
  height: 100px;
  width: 700px;
}
.submenu-title-container {
  float: left;
}
.submenu-action-container {
  float: right;
  margin-top: 3px;
}
</style>