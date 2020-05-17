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
  <div class="eos-p-2 body-2">
    <div id="system-maintenance-title-container">
      <label
        id="system-maintenance-title"
        class="eos-text-lg mt-2 font-weight-bold"
        >System maintenance</label
      >
    </div>
    <v-container>
      <div class="body-2">
        <v-card class="col-8 pa-5 elevation-0" outlined tile>
          <v-row class="row-container" align="center" no-gutters>
            <v-col col="3" lg="3">
              <label
                class="eos-form-group-label font-weight-bold"
                for="Resource"
                style=" font-size: 1em;"
                >Start service:
              </label>
            </v-col>
            <v-col col="3" md="auto" class="mx-3">
              <eos-dropdown
                @update:selectedOption="handleStartSelect"
                :options="createOptionsForDropdown(resourceState.offline)"
                :width="dropdownWidth"
                :title="resource.start ? resource.start : undefined"
              ></eos-dropdown>
            </v-col>
            <v-col md="2">
              <button
                type="button"
                id="btnStartResource"
                class="eos-btn-primary"
                :disabled="!resourceState.offline.length || !resource.start"
                @click="startSelectedResource()"
              >
                Apply
              </button>
            </v-col>
          </v-row>
          <v-row class="mt-5 row-container" align="center" no-gutters>
            <v-col col="3" lg="3">
              <label
                class="eos-form-group-label font-weight-bold"
                for="Resource"
                style=" font-size: 1em;"
                >Stop service:
              </label>
            </v-col>
            <v-col col="3" md="auto" class="mx-3">
              <div>
                <eos-dropdown
                  @update:selectedOption="handleStopSelect"
                  :options="createOptionsForDropdown(resourceState.online)"
                  :width="dropdownWidth"
                  :title="resource.stop ? resource.stop : undefined"
                ></eos-dropdown>
              </div>
            </v-col>
            <v-col md="2">
              <button
                type="button"
                id="btnStopResource"
                class="eos-btn-primary"
                :disabled="!resourceState.online.length >= 1 || !resource.stop"
                @click="stopSelectedResource()"
              >
                Apply
              </button>
            </v-col>
          </v-row>
          <v-row class="mt-5 row-container" align="center" no-gutters>
            <v-col col="3" lg="3">
              <label
                class="eos-form-group-label font-weight-bold"
                for="Resource"
                style=" font-size: 1em;"
                >Shutdown:
              </label>
            </v-col>
            <v-col col="3" md="auto" class="mx-3">
              <eos-dropdown
                @update:selectedOption="handleShutdownSelect"
                :options="createOptionsForDropdown(resourceState.all)"
                :width="dropdownWidth"
                :title="resource.shutdown ? resource.shutdown : undefined"
              ></eos-dropdown>
            </v-col>
            <v-col md="2">
              <button
                type="button"
                id="btnShutdownResource"
                class="eos-btn-primary"
                :disabled="!resource.shutdown"
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
        :severity="confirmationDialogSeverity"
        @closeDialog="closeConfirmationDialog"
        cancelButtonText="No"
      ></eos-confirmation-dialog>
      <eos-confirmation-dialog
        :show="showInfoDialog"
        title="Success"
        :message="infoDialogMessage"
        severity="info"
        @closeDialog="closeInfoDialog"
        confirmButtonText="Okay"
        cancelButtonText=""
      ></eos-confirmation-dialog>
      <div class="eos-text-primary mt-2">
        {{ actionMessage }}
      </div>
    </v-container>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import EosDropdown from "../widgets/dropdown/eos-dropdown-view.vue";
import { EosDropdownOption } from "../widgets/dropdown/eos-dropdown-model";
@Component({
  name: "eos-resource",
  components: { EosDropdown }
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
      resourceState: {
        online: [],
        offline: [],
        all: []
      },
      online: [],
      offline: [],
      nodes: [],
      showConfirmationDialog: false,
      confirmationDialogMessage: "",
      confirmationDialogSubMessage: "",
      confirmationDialogSeverity: "danger",
      dropdownWidth: "200px",
      actionMessage: "",
      showInfoDialog: false,
      infoDialogMessage:
        "The services have been restarted. Please refresh the page. You will have to login again."
    };
  }
  private mounted() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      "Fetching system resources..."
    );

    this.$store
      .dispatch("maintenance/getNodeStatus")
      .then((res: any) => {
        if (res && res.node_status) {
          if (!this.$data.resourceState) {
            this.$data.resourceState = {};
          }
          res.node_status.forEach((e: any) => {
            if (e.online) {
              this.$data.resourceState.online.push(e.name);
            }
            if (e.standby) {
              this.$data.resourceState.offline.push(e.name);
            }
            if (!e.shutdown) {
              this.$data.resourceState.all.push(e.name);
            }
          });
          this.$data.resourceState.all.push("cluster");
        }
      })
      .finally(() => {
        this.$store.dispatch("systemConfig/hideLoader");
      });
  }
  private closeConfirmationDialog(confirmation: boolean) {
    this.$data.showConfirmationDialog = false;
    if (confirmation) {
      this.$store.dispatch(
        "systemConfig/showLoader",
        `${this.$data.actionMethod} node...`
      );
      this.$store
        .dispatch(`maintenance/${this.$data.actionMethod}Node`, {
          resource_name: this.$data.resource[this.$data.actionMethod]
        })
        .then((res: any) => {
          if (res) {
            if (res.message) {
            this.$data.actionMessage = res.message;
            }
            if (res.showInfo) {
              this.$data.showInfoDialog = true;
            }
          } else {
            throw new Error("Failed to perform the action");
          }
        })
        .catch((e: any) => {
          this.$data.actionMessage = e.message;
        })
        .finally(() => {
          this.$store.dispatch("systemConfig/hideLoader");
          this.$data.resource = {
            stop: "",
            start: "",
            shutdown: ""
          };
        });
    }
  }
  private stopSelectedResource(action: boolean) {
    this.$data.confirmationDialogMessage =
      "Are you sure, you want to stop the node?";

    this.$data.actionMethod = "stop";
    this.$data.confirmationDialogSeverity = "danger";
    this.$data.showConfirmationDialog = true;
  }
  private startSelectedResource(action: boolean) {
    this.$data.actionMethod = "start";
    this.$data.confirmationDialogMessage =
      "Are you sure, you want to start the node?";
    this.$data.confirmationDialogSeverity = "info";
    this.$data.showConfirmationDialog = true;
  }
  private shutdownSelectedResource(action: boolean) {
    this.$data.confirmationDialogMessage =
      "Are you sure, you want to shutdown the node?";
    this.$data.confirmationDialogSubMessage =
      "Please note that if you shutdown the cluster then the entire application will stop";

    this.$data.actionMethod = "shutdown";
    this.$data.confirmationDialogSeverity = "danger";
    this.$data.showConfirmationDialog = true;
  }
  private createOptionsForDropdown(list: string[]) {
    return list.map((e: string) => {
      return { label: e, value: e };
    });
  }
  private handleShutdownSelect(selected: EosDropdownOption) {
    this.$data.resource.shutdown = selected.value;
  }
  private handleStartSelect(selected: EosDropdownOption) {
    this.$data.resource.start = selected.value;
  }
  private handleStopSelect(selected: EosDropdownOption) {
    this.$data.resource.stop = selected.value;
  }
  private closeInfoDialog(confirmation: string) {
    this.$data.showInfoDialog = false;
  }
}
</script>
<style lang="scss" scoped>
.resource-container {
  display: flex;
}
.row-container {
  justify-content: left;
}
</style>
