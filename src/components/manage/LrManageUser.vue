<!--
* CORTX-CSM: CORTX Management web.
* Copyright (c) 2022 Seagate Technology LLC and/or its Affiliates
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
* please email opensource@seagate.com.
-->
<template>
  <div class="manage-user-page-container">
    <SgtTabs :tabsInfo="tabsInfo" @selected="onTabChange" />
    <component :is="activeTab" />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SgtTabs, { TabsInfo } from "../shared/SgtTabs.vue";
import LrAdminUser from "./AdminUser/LrAdminUser.vue";
import LrS3User from "./LrS3User.vue";

@Component({
  name: "LrHeader",
  components: { SgtTabs, LrAdminUser, LrS3User },
})
export default class LrHeader extends Vue {
  public tabsInfo: TabsInfo = [
    {
      id: 1,
      label: "Administrative User",
    },
    {
      id: 2,
      label: "S3 Accounts",
    },
  ];
  private activeTab = "LrAdminUser";
  public onTabChange(value: number) {
    switch (value) {
      case 1:
        this.activeTab = "LrAdminUser";
        break;
      case 2:
        this.activeTab = "LrS3User";
        break;
    }
  }
}
</script>

<style lang="scss" scoped></style>
