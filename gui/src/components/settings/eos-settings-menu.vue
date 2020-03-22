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
    <eos-menu-list
      :menuItems="subMenuItems"
      @clickFunctionHandler="clickHandler"
    ></eos-menu-list>
    </div>
</template>
 <script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";
import EosMenuList from "../widgets/eos-menu-list.vue";

@Component({
  name: "eos-settings-menu",
  components: {
    EosMenuList
  }
})
export default class EosSettingsMenu extends Vue {
  public subMenuItems = [
    {
      title: "Notifications",
      actionName: "Manage",
      actionClickFunction: "goToNotifications",
      disabled: false
    },
    {
      title: "Management network",
      actionName: "Manage",
      actionClickFunction: "goToManagementNetwork",
      disabled: false
    },
    {
      title: "Data network",
      actionName: "Manage",
      actionClickFunction: "goToDataNetwork",
      disabled: false
    },
    {
      title: "DNS",
      actionName: "Manage",
      actionClickFunction: "goToDNS",
      disabled: false
    },
    {
      title: "NTP",
      actionName: "Manage",
      actionClickFunction: "goToNTP",
      disabled: false
    },
    {
      title: "SSL Certificate",
      actionName: "Manage",
      actionClickFunction: "goToSSL",
      disabled: false
    }
  ];
  private goToNotifications() {
    this.$router.push({ name: "notifications" });
  }
  private goToManagementNetwork() {
    this.$router.push({ name: "management-network" });
  }
  private goToDataNetwork() {
    this.$router.push({ name: "data-network" });
  }
  private goToDNS() {
    this.$router.push({ name: "dns" });
  }
  private goToNTP() {
    this.$router.push({ name: "ntp" });
  }
  private goToSSL() {
    this.$router.push({ name: "ssl-upload" });
  }
  private clickHandler(actionClickFunction: string) {
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
