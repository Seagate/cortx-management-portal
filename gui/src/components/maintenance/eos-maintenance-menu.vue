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
    <eos-menu-list
      :menuItems="subMenuItems"
      @clickFunctionHandler="clickFunctionHandler"
    ></eos-menu-list>
    <div class="eos-wrap-height-menu-card-layout">
      <button type="button" class="eos-btn-tertiary" @click="goToAbout()">
        About
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";
import EosMenuList from "../widgets/eos-menu-list.vue";
@Component({
  name: "eos-maintenance-menu",
  components: {
    EosMenuList
  }
})
export default class EosMaintenanceMenu extends Vue {
  public subMenuItems = [
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
      actionName: "View/Download",
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
  private clickFunctionHandler(actionClickFunction: string) {
    const vueInstance: any = this;
    vueInstance[actionClickFunction]();
  }
}
</script>
<style lang="scss" scoped>
.eos-wrap-height-menu-card-layout {
  width: 56.25em;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
