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
      title: "Administrative Users",
      actionName: "Manage",
      actionClickFunction: "goToUserSettings",
      disabled: false,
      requiredAccess: "users"
    },
    {
      title: "S3 Accounts",
      actionName: "Manage",
      actionClickFunction: "goToS3",
      disabled: false,
      requiredAccess: "s3accounts"
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
