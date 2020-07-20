<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblOnboardingSummary">
        Onboarding summary
      </div>
      <div class="mt-3" id="lblOnboardingSummaryMsg">
        Verify the configurations below.
      </div>
      <v-divider class="mt-2" />
      <v-expansion-panels class="mt-5" v-bind:value="0">
        <v-expansion-panel value="0">
          <v-expansion-panel-header class="eos-text-lg font-weight-bold"
            >Notifications</v-expansion-panel-header
          >
          <v-expansion-panel-content v-if="notificationData.smtp_server">
            <div class="row ma-0">
              <template>
                <div class="col-8 body-2 column mr-5 pt-0">
                  <table class="eos-text-lg">
                    <tr>
                      <td class="table-data-label">SMTP server:</td>
                      <td>{{ notificationData.smtp_server }}</td>
                    </tr>
                    <tr>
                      <td>Sender email:</td>
                      <td>{{ notificationData.smtp_sender_email }}</td>
                    </tr>
                    <tr>
                      <td>Receiver email:</td>
                      <td>{{ notificationData.email }}</td>
                    </tr>
                    <tr>
                      <td>Protocol:</td>
                      <td>{{ notificationData.smtp_protocol }}</td>
                    </tr>
                    <tr>
                      <td>SMTP port:</td>
                      <td>{{ notificationData.smtp_port }}</td>
                    </tr>
                  </table>
                </div>
              </template>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <eos-confirmation-dialog
        :show="showConfirmDialog"
        title="Confirmation"
        :message="
          `<span>You are moving on new IP address <a href='${newUrl}' target='_blank'>${newUrl}</a></span>`
        "
        severity="warning"
        submessage="Applying the changes will restart the system and the system will be moved to the new IP address."
        @closeDialog="closeConfirmDialog"
        confirmButtonText="Apply"
        isMessageInHTML="true"
      ></eos-confirmation-dialog>
      <span class="d-none">{{ isValidForm }}{{ managementNetworkGetter }}</span>
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { EVENT_BUS } from "./../../../../main";
import {
  SystemConfigObject,
  DnsNetworkSettings
} from "./../../../../models/system-configuration";

import { Api } from "./../../../../services/api";
import apiRegister from "./../../../../services/api-register";

@Component({
  name: "eos-onboarding-summary"
})
export default class EosOnboardingSummary extends Vue {
  private data() {
    return {
      ntpData: {},
      managementData: [],
      dataNetwork: [],
      dnsData: [],
      newUrl: "",
      showConfirmDialog: false,
      wizardRes: undefined,
      notificationData: {},
      lastSSLStatus: {}
    };
  }
  private openConfirmDialog() {
    this.$data.showConfirmDialog = true;
  }
  private async closeConfirmDialog(confirmation: string) {
    this.$store.dispatch("systemConfig/showLoader", "Applying settings...");
    this.$data.showConfirmDialog = false;
    if (confirmation) {
      await this.$store.dispatch("systemConfig/updateSummary", true);
      await this.$store.dispatch("systemConfig/updateSummary", false);
      this.$store.dispatch("systemConfig/hideLoader");
      this.$data.wizardRes(true);
    } else {
      this.$data.wizardRes(false);
    }
  }

  get isValidForm() {
    const validate = true;
    // WizardHook: Emit event to sibling wizard footer component
    // to send information about data validation to enable/disable wizard footer
    EVENT_BUS.$emit("validForm", validate);
    return validate;
  }
  private async mounted() {
    const vm = this;
    EVENT_BUS.$on("emitOnNext", (res: any) => {
      vm.updateSummary();
      this.$data.wizardRes = res;
    });
    // await this.getCertificateStatus();
  }
  private async updateSummary() {
    this.$store.dispatch("systemConfig/showLoader", "Applying settings...");
    // await this.$store.dispatch("systemConfig/updateSummary", true);
    // await this.$store.dispatch("systemConfig/updateSummary", false);
    this.$store.dispatch("systemConfig/hideLoader");
    this.$data.wizardRes(true);
  }
  private destroyed() {
    // WizardHook: shut off on exit event listener
    EVENT_BUS.$off("emitOnNext");
  }
  get managementNetworkGetter(): any {
    const systemconfig = this.$store.getters["systemConfig/systemconfig"];
    let redirectUrl;

    if (systemconfig) {
      if (
        systemconfig.management_network_settings &&
        systemconfig.management_network_settings.ipv4 &&
        systemconfig.management_network_settings.ipv4.nodes &&
        systemconfig.management_network_settings.ipv4.nodes[0]
      ) {
        this.$data.managementData =
          systemconfig.management_network_settings.ipv4.nodes;
        redirectUrl = this.$data.managementData[0].ip_address;
      }
      if (
        systemconfig.data_network_settings &&
        systemconfig.data_network_settings.ipv4 &&
        systemconfig.data_network_settings.ipv4.nodes
      ) {
        this.$data.dataNetwork = systemconfig.data_network_settings.ipv4.nodes;
      }
      if (systemconfig.dns_network_settings) {
        this.$data.dnsData = systemconfig.dns_network_settings.nodes;
      }
      if (
        systemconfig.date_time_settings &&
        systemconfig.date_time_settings.ntp &&
        systemconfig.date_time_settings.ntp.ntp_server_address
      ) {
        this.$data.ntpData = systemconfig.date_time_settings.ntp;
      }
      if (
        systemconfig.notifications &&
        systemconfig.notifications.email &&
        systemconfig.notifications.email.smtp_server
      ) {
        this.$data.notificationData = systemconfig.notifications.email;
      }
      const protocol = window.location.protocol;
      const defaultUrl = window.location.hostname;
      const port = window.location.port;
      this.$data.newUrl = `${protocol}//${
        redirectUrl ? redirectUrl : defaultUrl
      }:${port}`;
    }
    return true;
  }
  /*private async getCertificateStatus() {
    this.$store.dispatch("systemConfig/showLoader", "Fetching certificate...");
    const res = await Api.getAll(apiRegister.ssl_status);
    this.$data.lastSSLStatus = res.data;
    this.$store.dispatch("systemConfig/hideLoader");
  }*/
}
</script>
<style lang="scss" scoped>
.table-data-label {
  width: 130px;
}
.large-table-data-label {
  width: 150px;
}
</style>
