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
  <div>
    <LrDataTable
      ref="healthDetailsTable"
      :headers="healthTableConfig.healthTable.headers"
      :records="clusterHealthData"
      :searchConfig="healthTableConfig.searchConfig"
      @zoom="showMoreDetails"
      @start-node="startNode"
      @stop-node="stopNode"
      @server-power-off="serverPowerOff"
      @server-storage-off="serverAndStorageOff"
    >
      <template v-slot:status="item">
        <v-avatar :color="getColor(item)" size="16"></v-avatar>
      </template>
    </LrDataTable>
    <SgtInfoDialog
      v-model="isShowInfoDialog"
      :type="infoDialogType"
      :title="infoDialogTitle"
      :message="infoDialogMessage"
      @close="clearInfoDialog()"
    />
    <SgtPromptDialog
      v-model="isShowPromptDialog"
      :title="promptDialogTitle"
      :message="promptDialogMessage"
      @close="promptDialogClosed($event)"
    />
    <v-dialog v-model="displayInfoModal" width="500">
      <v-card class="pt-3">
        <v-card-text class="mt-2">
          Resource: {{ resourceInfo.resource.toUpperCase() }}
          <br />
          ID: {{ resourceInfo.id }}
          <br />
          Status: {{ resourceInfo.status.toUpperCase() }}
          <br />
          Time: {{ (resourceInfo.last_updated_time * 1000) | timeago }}
          <br />
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="white--text"
            color="#6ebe49"
            @click="displayInfoModal = false"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";
import ClusterManagementMixin from "../../mixins/cluster-management";
import { Api } from "../../services/Api";
import { IResource, lrHealthConst } from "./HealthTabularView.constant";
import CortxDataTable from "../widgets/cortx-data-table.vue";
import LrDataTable from "../shared/LrDataTable/LrDataTable.vue";
import SgtPromptDialog from "../shared/SgtPromptDialog.vue";
import SgtInfoDialog from "../shared/SgtInfoDialog.vue";

@Component({
  name: "LrHealthTabular",
  components: { LrDataTable, SgtPromptDialog, SgtInfoDialog },
})
export default class LrHealthTabular extends Mixins(ClusterManagementMixin) {
  public hideFilter: boolean = true;
  public healthQueryParams: any = {};
  public healthTableHeaderList: any[] = [];
  public clusterHealthData: any = [];
  public displayInfoModal: boolean = false;
  public healthTableConfig: any = lrHealthConst;
  public resourceInfo: IResource = {
    id: "",
    last_updated_time: "",
    resource: "",
    status: "",
  };
  public mounted() {
    this.getHealthData();
  }
  public async getHealthData() {
    this.healthQueryParams = {
      response_format: "flattened",
      offset: 1,
      limit: 0,
    };
    // this.$store.dispatch("systemConfig/showLoader", "Fetching health...");
    const res: any = await Api.getData("/health/health-tabular", {
      isDummy: true,
    });
    this.clusterHealthData = res.data;
    // this.$store.dispatch("systemConfig/hideLoader");
  }

  get actionsCallback() {
    return {
      getMoreInfoAction: this.showMoreDetails,
      startNodeAction: (resource: any) => this.performAction(resource, "start"),
      stopNodeAction: (resource: any) => this.performAction(resource, "stop"),
      powerOffAction: (resource: any) =>
        this.performAction(resource, "poweroff"),
      powerAndStorageOffAction: (resource: any) =>
        this.performAction(resource, "powerandstorageoff"),
    };
  }

  getColor(item: {
    value: "online" | "offline" | "degraded" | "failed" | "unknown";
  }) {
    return lrHealthConst.severityList[item.value];
  }

  startNode(resource: IResource) {
    //API call to start the node
  }

  stopNode(resource: IResource) {
    //API call to stop the node
  }

  serverPowerOff(resource: IResource) {
    //API call to turn the server off
  }

  serverAndStorageOff(resource: IResource) {
    //API call to turn the server and storage off
  }

  public async showMoreDetails(details: IResource) {
    this.resourceInfo = details;
    this.displayInfoModal = true;
  }
}
</script>
<style lang="scss" scoped></style>
