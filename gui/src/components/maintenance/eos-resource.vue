/*****************************************************************************
 Filename:          eos-resource.vue
 Description:       Resource Maintenance

 Creation Date:     21/02/2020
 Author:            Vaibhav Bhavsar

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <div>
    <div
      id="s3-configuration-title-container"
      class="mb-4 s3-configuration-page-title"
    >
      <label id="s3-account-form-title" class="headline font-weight-bold"
        >System maintenance</label
      >
    </div>

    <v-container>
      <div class="pl-4 body-2">
        <v-card class="col-10 pb-5 mt-10 elevation-0" outlined tile>
          <v-row class="resource-container pt-10">
            <v-col>
              <label
                class="eos-form-group-label ml-10 mt-5"
                for="Resource"
                style=" font-size: 1em;"
                >Stop resource</label
              >
            </v-col>
            <v-col>
              <div>
                <select
                  :disabled="!online.length"
                  name="resource"
                  id="resource"
                  class="eos-form__input_text"
                  v-model="resource.stop"
                >
                  <option
                    v-for="(node, index) in online"
                    :key="index"
                    :value="node"
                    >{{ node }}</option
                  >
                  <option value="all">cluster</option>
                </select>
              </div>
            </v-col>
            <v-col>
              <button
                type="button"
                id="btnStopResource"
                class="eos-btn-primary"
                :disabled="!online.length"
                @click="stopSelectedResource()"
              >
                Apply
              </button>
            </v-col>
          </v-row>
          <v-row class="resource-container mt-5">
            <v-col>
              <label
                class="eos-form-group-label ml-10 mt-5"
                for="Resource"
                style=" font-size: 1em;"
                >Start resource</label
              >
            </v-col>
            <v-col>
              <div>
                <select
                  :disabled="!offline.length"
                  name="resource"
                  id="resource"
                  class="eos-form__input_text"
                  v-model="resource.start"
                >
                  <option
                    v-for="(node, index) in offline"
                    :key="index"
                    :value="node"
                    >{{ node }}</option
                  >
                  <option value="all">cluster</option>
                </select>
              </div>
            </v-col>
            <v-col>
              <button
                type="button"
                id="btnStartResource"
                class="eos-btn-primary"
                :disabled="!offline.length"
                @click="startSelectedResource()"
              >
                Apply
              </button>
            </v-col>
          </v-row>
          <v-row class="resource-container mt-5">
            <v-col>
              <label
                class="eos-form-group-label ml-10 mt-5"
                for="Resource"
                style=" font-size: 1em;"
                >Shutdown resource</label
              >
            </v-col>
            <v-col>
              <div>
                <select
                  name="resource"
                  id="resource"
                  class="eos-form__input_text"
                  v-model="resource.shutdown"
                >
                  <option
                    v-for="(node, index) in nodes"
                    :key="index"
                    :value="node"
                    >{{ node }}</option
                  >
                  <option value="all">cluster</option>
                </select>
              </div>
            </v-col>
            <v-col>
              <button
                type="button"
                id="btnShutdownResource"
                class="eos-btn-primary"
                @click="shutdownSelectedResource()"
              >
                Apply
              </button>
            </v-col>
          </v-row>
        </v-card>
      </div>
      <eos-confirmation-dialog
        :show="showConfirmationDialog"
        title="Confirmation"
        :message="confirmationDialogMessage"
        :submessage="confirmationDialogSubMessage"
        severity="warning"
        @closeDialog="closeConfirmationDialog"
        cancelButtonText="No"
      ></eos-confirmation-dialog>
    </v-container>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
@Component({
  name: "eos-resource"
})
export default class EosMaintenance extends Vue {
  private data() {
    return {
      resource: {
        stop: "",
        start: "",
        shutdown: ""
      },
      actionMethod: "",
      online: [],
      offline: [],
      nodes: [],
      showConfirmationDialog: false,
      confirmationDialogMessage: "",
      confirmationDialogSubMessage: ""
    };
  }
  private mounted() {
    this.$store.dispatch("maintenance/getNodeStatus").then((res: any) => {
      if (res) {
        this.$data.online = res.online;
        this.$data.offline = res.offline;
        this.$data.nodes = res.nodes;
      }
    });
  }
  private switchResource() {
    this.$store.dispatch("maintenance/maintenanceAction");
  }
  private closeConfirmationDialog(confirmation: boolean) {
    this.$data.showConfirmationDialog = false;
    if (confirmation) {
      this.$store.dispatch(`maintenance/${this.$data.actionMethod}Node`, {
        node: this.$data.resource[this.$data.actionMethod]
      });
    }
    this.$data.resource[this.$data.actionMethod] = "";
  }
  private stopSelectedResource(action: boolean) {
    this.$data.confirmationDialogMessage =
      "Are you sure, you want to stop the node?";
    this.$data.confirmationDialogSubMessage =
      "Please note that if you stop the cluster then the entire application will stop";

    this.$data.actionMethod = "stop";
    this.$data.showConfirmationDialog = true;
  }
  private startSelectedResource(action: boolean) {
    this.$data.actionMethod = "start";
    this.$data.showConfirmationDialog = true;
  }
  private shutdownSelectedResource(action: boolean) {
    this.$data.confirmationDialogMessage =
      "Are you sure, you want to shutdown the node?";
    this.$data.confirmationDialogSubMessage =
      "Please note that if you shutdown the cluster then the entire application will stop";

    this.$data.actionMethod = "shutdown";
    this.$data.showConfirmationDialog = true;
  }
}
</script>
<style lang="scss" scoped>
.resource-container {
  display: flex;
}
</style>
