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
  <div class="cortx-p-1 body-2">
    <div id="system-maintenance-title-container">
      <label
        id="system-maintenance-title"
        class="cortx-text-lg mt-2 font-weight-bold"
        >{{$t("systemMaintenance.page-title")}}</label
      >
    </div>
    <v-container>
      <div class="body-2">
        <v-card class="col-8 pa-5 elevation-0" outlined tile>
          <v-row class="row-container" align="center" no-gutters>
            <v-col col="3" lg="3">
              <label id="maintenance-startlbl"
                class="cortx-form-group-label font-weight-bold"
                for="Resource"
                style=" font-size: 1em;"
                >{{$t("systemMaintenance.start-service")}}</label
              >
            </v-col>
            <v-col col="3" md="auto" class="mx-3">
              <cortx-dropdown
                id="maintenance-startnode-dropdown"
                @update:selectedOption="handleStartSelect"
                :options="createOptionsForDropdown(resourceState.standby)"
                :width="dropdownWidth"
                :title="resource.start ? resource.start : undefined"
              ></cortx-dropdown>
            </v-col>
            <v-col md="2">
              <button
                type="button"
                id="btnStartResource"
                class="cortx-btn-primary"
                :disabled="!resourceState.standby.length || !resource.start"
                @click="startSelectedResource()"
              >
                {{ $t("systemMaintenance.apply-btn") }}
              </button>
            </v-col>
          </v-row>
          <v-row class="mt-5 row-container" align="center" no-gutters>
            <v-col col="3" lg="3">
              <label id="maintenance-stoplbl"
                class="cortx-form-group-label font-weight-bold"
                for="Resource"
                style=" font-size: 1em;"
                >{{ $t("systemMaintenance.stop-service") }}</label
              >
            </v-col>
            <v-col col="3" md="auto" class="mx-3">
              <div>
                <cortx-dropdown
                  id="maintenance-stoptnode-dropdown"
                  @update:selectedOption="handleStopSelect"
                  :options="createOptionsForDropdown(resourceState.online)"
                  :width="dropdownWidth"
                  :title="resource.stop ? resource.stop : undefined"
                ></cortx-dropdown>
              </div>
            </v-col>
            <v-col md="2">
              <button
                type="button"
                id="btnStopResource"
                class="cortx-btn-primary"
                :disabled="!resourceState.online.length >= 1 || !resource.stop"
                @click="stopSelectedResource()"
              >
                {{ $t("systemMaintenance.apply-btn") }}
              </button>
            </v-col>
          </v-row>
          <v-row class="mt-5 row-container" align="center" no-gutters>
            <v-col col="3" lg="3">
              <label
                id="maintenance-shutdownlbl"
                class="cortx-form-group-label font-weight-bold"
                for="Resource"
                style=" font-size: 1em;"
                >{{ $t("systemMaintenance.shutdown") }}</label
              >
            </v-col>
            <v-col col="3" md="auto" class="mx-3">
              <cortx-dropdown
                id="maintenance-shutdowntnode-dropdown"
                @update:selectedOption="handleShutdownSelect"
                :options="createOptionsForDropdown(resourceState.offline)"
                :width="dropdownWidth"
                :title="resource.shutdown ? resource.shutdown : undefined"
              ></cortx-dropdown>
            </v-col>
            <v-col md="2">
              <button
                type="button"
                id="btnShutdownResource"
                class="cortx-btn-primary"
                :disabled="!resource.shutdown"
                @click="shutdownSelectedResource()"
              >
                {{ $t("systemMaintenance.apply-btn") }}
              </button>
            </v-col>
          </v-row>
          <div
            class="cortx-text-md mt-5 font-weight-bold"
            id="lblShutdownNode"
            v-if="shutdownNode"
          >{{ $t('systemMaintenance.shutdown-note', { node: shutdownNode }) }}
          </div>
        </v-card>
      </div>
      <cortx-confirmation-dialog
      id="resource-confirmation-dialog"
        :show="showConfirmationDialog"
        title="Confirmation"
        :message="confirmationDialogMessage"
        :submessage="confirmationDialogSubMessage"
        :severity="confirmationDialogSeverity"
        @closeDialog="closeConfirmationDialog"
        cancelButtonText="No"
      ></cortx-confirmation-dialog>
      <cortx-confirmation-dialog
       id="resource-success-dialogbox"
        :show="showInfoDialog"
        title="Success"
        :message="infoDialogMessage"
        severity="info"
        @closeDialog="closeInfoDialog"
        confirmButtonText="Okay"
        cancelButtonText
      ></cortx-confirmation-dialog>
      <div class="cortx-text-primary mt-2">{{ actionMessage }}</div>
    </v-container>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import CortxDropdown from "../widgets/dropdown/cortx-dropdown-view.vue";
import { CortxDropdownOption } from "../widgets/dropdown/cortx-dropdown-model";
import i18n from "./../../i18n";
@Component({
  name: "cortx-resource",
  components: { CortxDropdown }
})
export default class CortxMaintenance extends Vue {
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
        standby: [],
        offline: []
      },
      shutdownNode: "",
      showConfirmationDialog: false,
      confirmationDialogMessage: "",
      confirmationDialogSubMessage: "",
      confirmationDialogSeverity: "danger",
      dropdownWidth: "200px",
      actionMessage: "",
      showInfoDialog: false,
      infoDialogMessage: i18n.t("systemMaintenance.system-info-dialog-message")
    };
  }
  private async mounted() {
    await this.getNodeStatus();
  }
  private async getNodeStatus() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      i18n.t("systemMaintenance.fetching-system-message")
    );
    this.$data.resourceState = {
      online: [],
      standby: [],
      offline: []
    };
    this.$data.shutdownNode = "";
    try {
    const res: any = await Api.getAll(apiRegister.node_status);
    const nodeDetails = res && res.data ? res.data : null;

    if (nodeDetails && nodeDetails.node_status) {
      nodeDetails.node_status.forEach((e: any) => {
        if (e.online) {
            if (e.standby) {
              this.$data.resourceState.standby.push(e.hostname);
            } else {
          this.$data.resourceState.online.push(e.hostname);
        }
            this.$data.resourceState.offline.push(e.hostname);
          } else {
            this.$data.shutdownNode = e.name;
        }
      });
    }
    } catch (error) {
      this.handleClientCloseRequest(error);
    } finally {
    this.$store.dispatch("systemConfig/hideLoader");
  }
  }

  private async closeConfirmationDialog(confirmation: boolean) {
    this.$data.showConfirmationDialog = false;
    if (confirmation) {
      this.$store.dispatch(
        "systemConfig/showLoader",
        `${this.$data.actionMethod} node...`
      );
      const apiRegisterInstance: any = apiRegister;
      const nodeAction = `node_${this.$data.actionMethod}`;
      try {
        const res: any = await Api.post(apiRegisterInstance[nodeAction], {
          resource_name: this.$data.resource[this.$data.actionMethod]
        });
        const nodeActionDetails = res && res.data ? res.data : null;

        if (nodeActionDetails && nodeActionDetails.message) {
          this.$data.actionMessage = res.message;
        }
        setTimeout(() => {
          location.reload();
        }, 2000);
      } catch (error) {
        this.handleClientCloseRequest(error);
      } finally {
        this.$store.dispatch("systemConfig/hideLoader");
        this.$data.resource = {
          stop: "",
          start: "",
          shutdown: ""
        };
      }

      await this.getNodeStatus();
    }
  }

  private handleClientCloseRequest(error: any) {
        if (error && error.status === 499) {
          this.$data.showInfoDialog = true;
        } else {
          let errorMessage = i18n.t("systemMaintenance.error-message-onclose");
          if (error && error.error && error.data.message) {
            errorMessage = error.data.message;
          }
          throw {
            error: {
              message: errorMessage
            }
          };
        }
  }
  private stopSelectedResource(action: boolean) {
    this.$data.confirmationDialogMessage =
      i18n.t("systemMaintenance.confirm-message-node-stop");

    this.$data.actionMethod = i18n.t("systemMaintenance.stop-action-method");
    this.$data.confirmationDialogSeverity = i18n.t("systemMaintenance.danger-severity");
    this.$data.showConfirmationDialog = true;
  }
  private startSelectedResource(action: boolean) {
    this.$data.actionMethod = i18n.t("systemMaintenance.start-action-method");
    this.$data.confirmationDialogMessage =
      i18n.t("systemMaintenance.confirm-message-node-start");
    this.$data.confirmationDialogSeverity = i18n.t("systemMaintenance.info-severity");
    this.$data.showConfirmationDialog = true;
  }
  private shutdownSelectedResource(action: boolean) {
    this.$data.confirmationDialogMessage =
      i18n.t("systemMaintenance.confirm-message-node-shutdown");
    this.$data.confirmationDialogSubMessage =
      i18n.t("systemMaintenance.confirm-message-shutdown-sub");

    this.$data.actionMethod = i18n.t("systemMaintenance.shutdown-action-method");
    this.$data.confirmationDialogSeverity = i18n.t("systemMaintenance.danger-severity");
    this.$data.showConfirmationDialog = true;
  }
  private createOptionsForDropdown(list: string[]) {
    return list.map((e: string) => {
      return { label: e, value: e };
    });
  }
  private handleShutdownSelect(selected: CortxDropdownOption) {
    this.$data.resource.shutdown = selected.value;
  }
  private handleStartSelect(selected: CortxDropdownOption) {
    this.$data.resource.start = selected.value;
  }
  private handleStopSelect(selected: CortxDropdownOption) {
    this.$data.resource.stop = selected.value;
  }
  private closeInfoDialog(confirmation: string) {
    this.$data.showInfoDialog = false;
    location.reload();
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
