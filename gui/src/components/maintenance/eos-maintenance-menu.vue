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
    <div v-for="item in settingSubmenuItems" :key="item.id">
    <div class="eos-menu-card-layout">
        <label
          class="eos-text-lg eos-text-bold eos-float-l eos-menu-card-title"
        >
          {{ item.title }}</label
        >
      <button
        type="button"
        class="eos-btn-tertiary eos-float-r"
          @click="handleClickFunction(item.actionClickFunction)"
          :disabled="item.disabled"
        >
          {{ item.actionName }}
        </button>
    </div>
    </div>
    <div class="eos-wrap-height-menu-card-layout">
      <button type="button" class="eos-btn-tertiary" @click="goToAbout()">
        About
      </button>
    </div>
  </div>
</template>
 <script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

@Component({
  name: "eos-maintenance-menu"
})
export default class EosMaintenanceMenu extends Vue {
  public settingSubmenuItems = [
    {
      title: "System maintenance",
      actionName: "Manage",
      actionClickFunction: "goToSystemMaintenance",
      disabled: false
    },
    {
      title: "Firmware",
      actionName: "Manage",
      actionClickFunction: "goToFirmware",
      disabled: false
    },
    {
      title: "Software",
      actionName: "Manage",
      actionClickFunction: "goToSoftware",
      disabled: false
    },
    {
      title: "Audit log",
      actionName: "Download",
      actionClickFunction: "goToAuditLog",
      disabled: false
    }
  ];
  private goToSystemMaintenance() {
    this.$router.push({ name: "resource" });
  }
  private goToFirmware() {
    this.$router.push({ name: "firmware" });
  }
  private goToSoftware() {
    this.$router.push({ name: "software" });
  }
  private goToAuditLog() {
    this.$router.push({ name: "auditlog" });
  }
  private goToAbout() {
    this.$router.push({ name: "about" });
  }
  private handleClickFunction(actionClickFunction: string) {
    const vueInstance: any = this;
    vueInstance[actionClickFunction]();
  }
}
</script>
<style lang="scss" scoped>
.eos-menu-card-layout {
  height: 6.25em;
  width: 56.25em;
  padding-left: 1em;
  padding-top: 0.5em;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.eos-wrap-height-menu-card-layout {
  width: 56.25em;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.eos-menu-card-title {
  margin-top: 0.313em;
}
</style>
