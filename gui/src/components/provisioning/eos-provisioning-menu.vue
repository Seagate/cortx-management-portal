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
    <eos-tabs :tabsInfo="tabsInfo" />
    <eos-has-access :to="$eosUserPermissions.users + $eosUserPermissions.list">
      <EosUserSettingLocal v-if="showUserTab" />
    </eos-has-access>

    <eos-has-access
      :to="$eosUserPermissions.s3accounts + $eosUserPermissions.list"
    >
      <S3Account v-if="showAccountTab" />
    </eos-has-access>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import EosUserSettingLocal from "../onboarding/system-config/user-settings/user-setting-local.vue";
import EosTabs, { TabsInfo } from "../widgets/eos-tabs.vue";
import S3Account from "../s3/account-management.vue";

@Component({
  name: "eos-provisioning-submenu",
  components: {
    EosUserSettingLocal,
    EosTabs,
    S3Account
  }
})
export default class EosProvisioningSubmenu extends Vue {
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
        label: "S3 Account",
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
    this.tabsInfo.tabs = this.tabsInfo.tabs.map((tab: any) => {
      tab.show = vueInstance.$hasAccessToCsm(
        vueInstance.$eosUserPermissions[tab.requiredAccess] +
          vueInstance.$eosUserPermissions.list
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
