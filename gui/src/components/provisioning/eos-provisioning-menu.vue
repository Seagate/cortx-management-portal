/*****************************************************************************
 Filename:          eos-provisioning-menu.vue
 Description:       Provisioning menu component.

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
      @clickFunctionHandler="clickFunctionHandler"
    ></eos-menu-list>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import EosMenuList from "../widgets/eos-menu-list.vue";

@Component({
  name: "eos-provisioning-submenu",
  components: {
    EosMenuList
  }
})
export default class EosProvisioningSubmenu extends Vue {
  public subMenuItems = [
    {
      title: "User",
      actionName: "Manage",
      actionClickFunction: "goToUserSettings",
      disabled: false,
      requiredAccess: "users"
    },
    {
      title: "S3",
      actionName: "Manage",
      actionClickFunction: "goToS3",
      disabled: false
    }
  ];
  private goToUserSettings() {
    this.$router.push({ name: "usersettinglocal" });
  }
  private goToS3() {
    this.$router.push({ name: "s3" });
  }
  private clickFunctionHandler(actionClickFunction: string) {
    const vueInstance: any = this;
    vueInstance[actionClickFunction]();
  }
}
</script>
<style lang="scss" scoped></style>
