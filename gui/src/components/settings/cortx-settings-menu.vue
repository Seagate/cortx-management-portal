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
    <cortx-menu-list
      :menuItems="subMenuItems"
      @clickFunctionHandler="clickHandler"
    ></cortx-menu-list>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";
import CortxMenuList from "../widgets/cortx-menu-list.vue";
import { unsupportedFeatures } from "../../common/unsupported-feature";

@Component({
  name: "cortx-settings-menu",
  components: {
    CortxMenuList
  }
})
export default class CortxSettingsMenu extends Vue {
  public subMenuItems = [
    {
      title: "Email Notifications",
      actionName: "Manage",
      actionClickFunction: "goToNotifications",
      disabled: false,
      requiredAccess: "sysconfig",
      requiredSubAccess: "update",
      featureId: unsupportedFeatures.notification
    },
    {
      title: "DNS",
      actionName: "Manage",
      actionClickFunction: "goToDNS",
      disabled: false,
      requiredAccess: "maintenance",
      featureId: unsupportedFeatures.dns
    },
    {
      title: "NTP",
      actionName: "Manage",
      actionClickFunction: "goToNTP",
      disabled: false,
      requiredAccess: "maintenance",
      featureId: unsupportedFeatures.ntp
    },
    {
      title: "SSL Certificate",
      actionName: "Manage",
      actionClickFunction: "goToSSL",
      disabled: false,
      requiredAccess: "maintenance",
      featureId: unsupportedFeatures.ssl_upload
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
.cortx-wrap-height-menu-card-layout {
  width: 56.25em;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
