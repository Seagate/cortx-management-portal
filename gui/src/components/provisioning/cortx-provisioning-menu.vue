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
    <cortx-tabs :tabsInfo="tabsInfo" />
    <cortx-has-access :to="$cortxUserPermissions.users + $cortxUserPermissions.list">
      <CortxUserSettingLocal v-if="showUserTab" />
    </cortx-has-access>

    <cortx-has-access
      :to="$cortxUserPermissions.s3accounts + $cortxUserPermissions.list"
    >
      <S3Account v-if="showAccountTab" />
    </cortx-has-access>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import CortxUserSettingLocal from "../onboarding/system-config/user-settings/user-setting-local.vue";
import CortxTabs, { TabsInfo } from "../widgets/cortx-tabs.vue";
import S3Account from "../s3/account-management.vue";

@Component({
  name: "cortx-provisioning-submenu",
  components: {
    CortxUserSettingLocal,
    CortxTabs,
    S3Account
  }
})
export default class CortxProvisioningSubmenu extends Vue {
  public tabsInfo: TabsInfo = {
    tabs: [
      {
        id: 1,
        label: "Administrative user",
        show: true,
        requiredAccess: "users"
      },
      {
        id: 2,
        label: "S3 account",
        show: true,
        requiredAccess: "s3accounts"
      }
    ],
    selectedTab: 1
  };
  private showUserTab: boolean = true;
  private showAccountTab: boolean = false;

  public mounted() {
    /*
    Set `show` property to true/false based on the user access
    We can directly use Vue prototype method using `this`, but the linter
    shows this as an error e.g. `Property '$hasAccessToCsm' does not exist on type 'Vue'`
    That is why we need to create `vueInstance` constant with `any` type and use the
    methods or global variables declared using `Vue.prototype`.
    */
    const vueInstance: any = this;
    if (
      vueInstance.$hasAccessToCsm(
        vueInstance.$cortxUserPermissions.s3accounts +
          vueInstance.$cortxUserPermissions.update
      )
    ) {
      this.$router.push("/manage/s3");
    }

    this.tabsInfo.tabs = this.tabsInfo.tabs.map((tab: any) => {
      tab.show = vueInstance.$hasAccessToCsm(
        vueInstance.$cortxUserPermissions[tab.requiredAccess] +
          vueInstance.$cortxUserPermissions.list
      );
      return tab;
    });
  }
  @Watch("tabsInfo.selectedTab")
  public onPropertyChanged(value: number, oldValue: number) {
    switch (value) {
      case 1:
        this.showUserTab = true;
        this.showAccountTab = false;
        break;
      case 2:
        this.showUserTab = false;
        this.showAccountTab = true;
        break;
    }
  }
}
</script>
<style lang="scss" scoped></style>
