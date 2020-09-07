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
    <cortx-has-access
      :to="$cortxUserPermissions.s3accounts + $cortxUserPermissions.list"
    >
      <S3Account v-if="showAccountTab" />
    </cortx-has-access>
    <cortx-has-access
      :to="$cortxUserPermissions.s3iamusers + $cortxUserPermissions.list"
    >
      <IAMUser v-if="showIAMUserTab" />
    </cortx-has-access>
    <cortx-has-access
      :to="$cortxUserPermissions.s3buckets + $cortxUserPermissions.list"
    >
      <S3Bucket v-if="showBucketTab" />
    </cortx-has-access>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import CortxTabs, { TabsInfo } from "../widgets/cortx-tabs.vue";
import S3Account from "./account-management.vue";
import IAMUser from "./iam-user-management.vue";
import S3Bucket from "./bucket-creation.vue";

@Component({
  name: "cortx-s3-management",
  components: { CortxTabs, S3Account, IAMUser, S3Bucket }
})
export default class CortxS3Management extends Vue {
  public tabsInfo: TabsInfo = {
    tabs: [
      {
        id: 1,
        label: "S3 account",
        show: false,
        requiredAccess: "s3accounts"
      },
      {
        id: 2,
        label: "IAM user",
        show: false,
        requiredAccess: "s3iamusers"
      },
      {
        id: 3,
        label: "Bucket",
        show: false,
        requiredAccess: "s3buckets"
      }
    ],
    selectedTab: 1
  };

  private showAccountTab: boolean = true;
  private showIAMUserTab: boolean = false;
  private showBucketTab: boolean = false;

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
        this.showAccountTab = true;
        this.showIAMUserTab = false;
        this.showBucketTab = false;
        break;
      case 2:
        this.showAccountTab = false;
        this.showIAMUserTab = true;
        this.showBucketTab = false;
        break;
      case 3:
        this.showAccountTab = false;
        this.showIAMUserTab = false;
        this.showBucketTab = true;
        break;
    }
  }
}
</script>
<style lang="scss" scoped>
.tab-label {
  cursor: pointer;
  text-transform: none;
  font-weight: bold;
}
</style>
