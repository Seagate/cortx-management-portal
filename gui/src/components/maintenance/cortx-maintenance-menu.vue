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
      @clickFunctionHandler="clickFunctionHandler"
    ></cortx-menu-list>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";
import CortxMenuList from "../widgets/cortx-menu-list.vue";
import { unsupportedFeatures } from "../../common/unsupported-feature";

@Component({
  name: "cortx-maintenance-menu",
  components: {
    CortxMenuList
  }
})
export default class CortxMaintenanceMenu extends Vue {
  public subMenuItems = [
    {
      title: "System maintenance",
      actionName: "Manage",
      actionClickFunction: "goToSystemMaintenance",
      disabled: false,
      requiredAccess: "maintenance",
      featureId: unsupportedFeatures.cluster_management
    },
    {
      title: "Firmware update",
      actionName: "Manage",
      actionClickFunction: "goToFirmware",
      disabled: false,
      requiredAccess: "maintenance",
      featureId: unsupportedFeatures.fw_update
    },
    {
      title: "Software update",
      actionName: "Manage",
      actionClickFunction: "goToSoftware",
      disabled: false,
      requiredAccess: "maintenance",
      featureId: unsupportedFeatures.sw_update
    },
    {
      title: "Audit log",
      actionName: "View/Download",
      actionClickFunction: "goToAuditLog",
      disabled: false,
      requiredAccess: "auditlog",
      featureId: unsupportedFeatures.auditlog
    },
    // commented as per bug EOS-13871
    // {
    //   title: "Node replacement",
    //   actionName: "Manage",
    //   actionClickFunction: "goToNodeReplacement",
    //   disabled: false,
    //   requiredAccess: "replace_node"
    // },
    {
      title: "About",
      actionName: "View",
      actionClickFunction: "goToAbout",
      disabled: false,
      requiredAccess: "",
      featureId: unsupportedFeatures.about
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
  private goToNodeReplacement() {
    this.$router.push({ name: "node_replacement" });
  }
  private clickFunctionHandler(actionClickFunction: string) {
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
