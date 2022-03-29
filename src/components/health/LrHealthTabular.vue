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
    <SgtDataTable
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
      <template v-slot:status="{ data }">
        {{ data.status }}
        <v-avatar :color="getColor(data.status)" size="16"></v-avatar>
      </template>

      <template v-slot:actionColumn="{ data }">
        <div class="action-icons-container" v-if="data.resource === 'node'">
          <v-tooltip bottom v-for="icon in getIconList(data)">
            <template v-slot:activator="{ on, attrs }">
              <SgtSvgIcon
                :icon="icon.path"
                :hoverIcon="icon.hoverPath"
                :disabled="icon.disabled"
                @click="actionIconHandler(icon.action, data)"
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <span>{{ icon.tooltip }}</span>
          </v-tooltip>
        </div>
      </template>
    </SgtDataTable>

    <v-dialog v-model="displayInfoModal" width="500">
      <v-card class="pt-3">
        <v-card-text class="mt-2">
          Resource: {{ resourceInfo.resource.toUpperCase() }}
          <br />
          ID: {{ resourceInfo.id }}
          <br />
          Status: {{ resourceInfo.status.toUpperCase() }}
          <br />
          Time: {{ formattedTime(resourceInfo.last_updated_time * 1000) }}
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
import { Component, Mixins } from "vue-property-decorator";
import ClusterManagementMixin from "../../mixins/ClusterManagement";
import { Api } from "../../services/Api";
import { lrHealthConst } from "./LrHealthTabular.constant";
import { IResource } from "./LrHealthTabular.model";
import SgtDataTable from "@/lib/components/SgtDataTable/SgtDataTable.vue";
import SgtSvgIcon from "@/lib/components/SgtSvgIcon/SgtSvgIcon.vue";
import { formatTime } from "../../utils/CommonUtilFunctions";

@Component({
  name: "LrHealthTabular",
  components: { SgtDataTable, SgtSvgIcon },
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
  public formattedTime(date: string) {
    return formatTime(date);
  }
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

  public getIconList(data: IResource) {
    return [
      {
        path: `start-${data.status}.svg`,
        hoverPath: `start-${data.status}.svg`,
        disabled: data.status === "online",
        action: "start",
        tooltip: "Start Node",
      },
      {
        path: `stop-${data.status}.svg`,
        hoverPath: `stop-${data.status}.svg`,
        disabled: data.status === "offline" || data.status === "failed",
        action: "stop",
        tooltip: "Stop Node",
      },
      {
        path: `poweroff-${data.status}.svg`,
        hoverPath: `poweroff-${data.status}.svg`,
        action: "poweroff",
        tooltip: "Power off",
      },
      {
        path: `powerandstorageoff-${data.status}.svg`,
        hoverPath: `powerandstorageoff-${data.status}.svg`,
        action: "powerandstorageoff",
        tooltip: "Power and storage off",
      },
    ];
  }

  public actionIconHandler(action: string, data: any) {
    //Perform API calls for respective actions
    console.log(action);
    console.log(data);
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
    return this.healthTableConfig.severityList[item.value];
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
<style lang="scss" scoped>
.action-icons-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
}
</style>
