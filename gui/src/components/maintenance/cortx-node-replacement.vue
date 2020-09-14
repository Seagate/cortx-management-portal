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
  <div class="cortx-p-2 body-2">
    <div class="cortx-text-lg mt-2 font-weight-bold" id="lblIpv4DataNetwork">
      Node replacement
    </div>
    <v-divider class="mt-2 mb-4" />
    <div
      class="mt-4 mb-6 pa-3 cortx-last-upgrade-info-container cortx-text-md"
      v-if="lastNodeReplacementStatus.status"
    >
      <label class="cortx-text-bold">Last node replacement status</label>
      <button
        id="btnRefresh"
        type="button"
        class="ml-3 cortx-btn-secondary"
        @click="getLastNodeReplacementStatus()"
        style="height: 25px; padding-left: 10px; padding-right: 10px;"
      >
        Refresh
      </button>
      <v-divider class="mt-2 mb-4" />
      <label>Replacement of</label>
      <label>{{ " " + lastNodeReplacementStatus.node_id + " " }}</label>
      <label>is</label>
      <label class="text-capitalize">{{
        " " + lastNodeReplacementStatus.status
      }}</label>
    </div>
    <v-row>
      <v-col md="4" class="py-0 pr-0">
        <div class="cortx-form-group">
          <label class="cortx-form-group-label">
            <cortx-info-tooltip label="Node*" message="List of offline nodes" />
          </label>
          <cortx-dropdown
            :selectedOption.sync="selectedNode"
            :options="nodes"
          ></cortx-dropdown>
        </div>
        <div
          class="cortx-form-group"
          :class="{
            'cortx-form-group--error': $v.ipHostname.$error
          }"
        >
          <label class="cortx-form-group-label">IP/Hostname (optional)</label>
          <input
            class="cortx-form__input_text"
            type="text"
            id="txtReplcipHostname"
            name="ipHostname"
            v-model.trim="ipHostname"
            @input="$v.ipHostname.$touch"
          />

          <div class="cortx-form-group-label cortx-form-group-error-msg">
            <label
              v-if="$v.ipHostname.$dirty && !$v.ipHostname.ipOrDomainRegex"
              >Invalid IP/Hostname.</label
            >
          </div>
        </div>
        <div
          class="cortx-form-group"
          :class="{
            'cortx-form-group--error': $v.sshPort.$error
          }"
        >
          <label class="cortx-form-group-label">Port (optional)</label>
          <input
            class="cortx-form__input_text"
            type="number"
            id="txtReplcsshPort"
            name="sshPort"
            v-model.trim="sshPort"
            @input="$v.sshPort.$touch"
          />
          <div class="cortx-form-group-label cortx-form-group-error-msg">
            <label v-if="$v.sshPort.$dirty && !$v.sshPort.maxValue"
              >SSH port is not valid.</label
            >
          </div>
        </div>
        <button
          id="btnStartUpgrade"
          type="button"
          class="mb-10 cortx-btn-primary cortx-float-l"
          @click="replaceSelectedResource"
          style="margin-top: 2px;"
          :disabled="!selectedNode.value"
        >
          Replace node
        </button>
      </v-col>
      <v-col md="8" class="py-0 pr-0">
        <div v-if="!canReplaceNode">
          <p class="cortx-text-lg cortx-text-primary font-weight-bold">
            All nodes are online.
          </p>
          <p class="cortx-text-md font-weight-bold">
          Note: Node replacement is only available when any one of the nodes is in
          shutdown state. In order to complete node replacement please shutdown the
          node from system maintenance page.
          </p>
        </div>
      </v-col>
    </v-row>
    <cortx-confirmation-dialog
      :show="showConfirmationDialog"
      title="Confirmation"
      :message="confirmationDialogMessage"
      :submessage="confirmationDialogSubMessage"
      :severity="confirmationDialogSeverity"
      @closeDialog="closeConfirmationDialog"
      cancelButtonText="No"
    ></cortx-confirmation-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import { LastNodeReplacementStatus } from "../../models/node-replacement";
import { Validations } from "vuelidate-property-decorators";
import { minValue, maxValue, helpers } from "vuelidate/lib/validators";
import { ipOrDomainRegex } from "./../../common/regex-helpers";

@Component({
  name: "cortx-node-replacement"
})
export default class CortxNodeReplacement extends Vue {
  @Validations()
  public validations = {
    ipHostname: {
      ipOrDomainRegex
    },
    sshPort: {
      minValue: minValue(0),
      maxValue: maxValue(65535)
    }
  };
  public lastNodeReplacementStatus: LastNodeReplacementStatus | {} = {};
  public nodes: any[] = [];
  public selectedNode: any = {} as any;
  public sshPort: number;
  public ipHostname: string;

  public data() {
    return {
      sshPort: "",
      ipHostname: "",
      showConfirmationDialog: false,
      confirmationDialogMessage: "",
      confirmationDialogSubMessage: "",
      confirmationDialogSeverity: "danger",
      canReplaceNode: false
    };
  }
  public async mounted() {
    await this.getLastNodeReplacementStatus();
    await this.getNodes();
  }

  public async getLastNodeReplacementStatus() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      "Fetching last node replacement status..."
    );
    const res: any = await Api.getAll(apiRegister.node_replace_status);
    this.lastNodeReplacementStatus = res && res.data ? res.data : {};
    this.$store.dispatch("systemConfig/hideLoader");
  }

  public async getNodes() {
    this.nodes = [];
    this.$store.dispatch("systemConfig/showLoader", "Fetching nodes...");
    try {
      const res = await Api.getAll(apiRegister.node_status);
      if (res && res.data) {
        res.data.node_status.forEach((node: any) => {
          if (!node.online) {
            this.nodes.push({ label: node.name, value: node.name });
          }
        });
      }
      if (this.nodes.length) {
        this.$data.canReplaceNode = true;
      }
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error("err logger: ", e);
    }
    this.$store.dispatch("systemConfig/hideLoader");
  }

  public async replaceNode() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      "Starting node replacement..."
    );
    const res: any = await Api.post(apiRegister.node_replace, {
      resource_name: this.selectedNode.value
    });
    this.$store.dispatch("systemConfig/hideLoader");
    await this.getLastNodeReplacementStatus();
  }

  public replaceSelectedResource() {
    this.$data.confirmationDialogMessage =
      "Are you sure, you want to replace the node?";

    this.$data.confirmationDialogSeverity = "danger";
    this.$data.showConfirmationDialog = true;
  }

  public async closeConfirmationDialog(confirmation: boolean) {
    this.$data.showConfirmationDialog = false;
    if (confirmation) {
      await this.replaceNode();
    }
  }
}
</script>

<style lang="scss" scoped>
.cortx-node-replacement-title {
  height: 46px;
}
.cortx-last-upgrade-info-container {
  border: 1px solid #e3e3e3;
  border-radius: 5px;
}
</style>
