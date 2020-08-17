/*****************************************************************************
 Filename:          eos-node-replacement.vue
 Description:       Replace nodes

 Creation Date:     25/06/2020
 Author:            Sri Bhargav Metta

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <div class="eos-p-2 body-2">
    <div class="eos-text-lg mt-2 font-weight-bold" id="lblIpv4DataNetwork">
      Node replacement
    </div>
    <div v-if="canReplaceNode">
      <div class="mt-3" id="lblNodeReplaceMsg">
        IP/Hotstname and SSH port configurations are optional.
      </div>
      <div class="mt-3" id="lblMandatoryMsg">
        Fields marked with * are mandatory.
      </div>
    </div>
    <v-divider class="mt-2 mb-4" />

    <div
      class="mt-4 pa-3 eos-last-upgrade-info-container eos-text-md"
      v-if="lastNodeReplacementStatus.status"
    >
      <label class="eos-text-bold">Last node replacement status</label>
      <button
        id="btnStartUpgrade"
        type="button"
        class="ml-3 eos-btn-secondary"
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
    <div
      class="eos-text-md mt-2 font-weight-bold"
      id="lblIpv4DataNetwork"
      v-if="!canReplaceNode"
    >
      Note: Node replacement is only available when any one of the nodes is in
      shutdown state. In order to complete node replacement please shutdown the
      node from system maintenance page.
    </div>
    <v-container class="mt-0 ml-0" v-else>
      <div class="pl-4 body-2">
        <div class="row mt-5">
          <div class="col-1 body-2 column mr-3">
            <div class="mt-2 font-weight-bold">
              <div class="eos-form-group">
                <label id="lblReplcNode">Node*: </label>
              </div>
              <div class="eos-form-group">
                <label id="lblReplcipHostname">IP/Hostname:</label>
              </div>
              <div class="eos-form-group">
                <label id="lblReplcProtocol">Port:</label>
              </div>
            </div>
          </div>
          <div class="col-4 body-2 column mr-5">
            <div class="eos-form-group">
              <eos-dropdown
                :selectedOption.sync="selectedNode"
                :options="nodes"
                class="eos-float-l"
              ></eos-dropdown>
            </div>
            <div
              class="eos-form-group"
              :class="{
                'eos-form-group--error': $v.ipHostname.$error
              }"
            >
              <input
                class="eos-form__input_text"
                type="text"
                id="txtReplcipHostname"
                name="ipHostname"
                v-model.trim="ipHostname"
                @input="$v.ipHostname.$touch"
              />
              <div class="eos-form-group-label eos-form-group-error-msg">
                <label
                  v-if="$v.ipHostname.$dirty && !$v.ipHostname.ipOrDomainRegex"
                  >Invalid IP/Hostname.</label
                >
            </div>
            </div>
            <div
              class="eos-form-group"
              :class="{
                'eos-form-group--error': $v.sshPort.$error
              }"
            >
              <input
                class="eos-form__input_text"
                type="number"
                id="txtReplcsshPort"
                name="sshPort"
                v-model.trim="sshPort"
                @input="$v.sshPort.$touch"
              />
              <div class="eos-form-group-label eos-form-group-error-msg">
                <label v-if="$v.sshPort.$dirty && !$v.sshPort.maxValue"
                  >SSH port is not valid.</label
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        id="btnStartUpgrade"
        type="button"
        class="mb-10 eos-btn-primary eos-float-l"
        @click="replaceSelectedResource"
        style="margin-top: 2px;"
        :disabled="!selectedNode.value"
      >
        Replace node
      </button>
    </v-container>
    <eos-confirmation-dialog
      :show="showConfirmationDialog"
      title="Confirmation"
      :message="confirmationDialogMessage"
      :submessage="confirmationDialogSubMessage"
      :severity="confirmationDialogSeverity"
      @closeDialog="closeConfirmationDialog"
      cancelButtonText="No"
    ></eos-confirmation-dialog>
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
  name: "eos-node-replacement"
})
export default class EosNodeReplacement extends Vue {
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
.eos-node-replacement-title {
  height: 46px;
}
.eos-last-upgrade-info-container {
  border: 1px solid #e3e3e3;
  border-radius: 5px;
}
</style>
