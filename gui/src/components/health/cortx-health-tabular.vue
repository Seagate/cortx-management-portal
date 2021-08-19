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
  <div v-feature="unsupportedFeatures.health">
    <cortx-data-table
      :headers="healthTableHeaderList" 
      :records="clusterHealthData.data"
      :hideFilter="hideFilter"
      :onSort="{}"
      :onFilter="{}"
      :sortParams="{}"
      :rowsPerPage="[10, 20, 30, 50, 100, 150, 200]" 
      :actionsCallback="actionsCallback"
      @update:items-per-page="getHealthData()"
      @update:page="getHealthData()"
    />
    <cortx-info-dialog
      v-model="isShowInfoDialog"
      :type="infoDialogType"
      :title="infoDialogTitle"
      :message="infoDialogMessage"
      @close="clearInfoDialog()"
    />
    <cortx-prompt-dialog
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
          Time: {{ resourceInfo.last_updated_time * 1000 | timeago }}
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
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import { unsupportedFeatures } from "../../common/unsupported-feature";
import CortxDataTable from "../widgets/cortx-data-table.vue";
import {
  healthTableHeaders,
  IResource
} from "../../common/health-table-headers";
import CortxPromptDialog from "../widgets/cortx-prompt-dialog.vue";
import CortxInfoDialog from "../widgets/cortx-info-dialog.vue";

@Component({
  name: "cortx-health-table",
  components: { CortxDataTable, CortxPromptDialog, CortxInfoDialog }
})
export default class CortxHealthTabular extends Mixins(ClusterManagementMixin) {
  public unsupportedFeatures = unsupportedFeatures;
  public healthTableHeaders = healthTableHeaders;
  public hideFilter: boolean = true;
  public healthQueryParams: any = {};
  public healthTableHeaderList: any[] = [];
  public clusterHealthData: any = {};
  public displayInfoModal: boolean = false;
  public resourceInfo: IResource = {
    id: "",
    last_updated_time: "",
    resource: "",
    status: ""
  };
  public mounted() {
    this.getHealthData();    
  }  
  public async getHealthData() {
    this.healthQueryParams = {
      response_format: "flattened",
      offset: 1,
      limit: 0
    };
    this.$store.dispatch("systemConfig/showLoader", "Fetching health...");
    const res = await Api.getAll(
      apiRegister.health_cluster,
      this.healthQueryParams
    );
    this.clusterHealthData = res.data;
    this.healthTableHeaderList = healthTableHeaders.healthTableHeaderList;
    this.$store.dispatch("systemConfig/hideLoader");
  }

  get actionsCallback() {
    return {
      getMoreInfoAction: this.showMoreDetails,
      startNodeAction: (resource: any) => this.performAction(resource, "start"),
      stopNodeAction: (resource: any) => this.performAction(resource, "stop"),
      powerOffAction: (resource: any) =>
        this.performAction(resource, "poweroff"),
      powerAndStorageOffAction: (resource: any) =>
        this.performAction(resource, "powerandstorageoff")
    };
  }

  public async showMoreDetails(event: any, details: IResource) {
    this.resourceInfo = details;
    this.displayInfoModal = true;
  }
}
</script>
<style lang="scss" scoped></style>
