<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblNetworkIP4">
        Onboarding Summary
      </div>
      <div class="mt-3" id="lblNetworkMsg">
        Please verify the configurations below.
      </div>
      <v-divider class="mt-2" />
      <v-expansion-panels class="mt-5">
        <v-expansion-panel v-if="managementData[0]">
          <v-expansion-panel-header class="eos-text-lg font-weight-bold"
            >Management network settings</v-expansion-panel-header
          >
          <v-expansion-panel-content>
            <div class="row ma-0 mt-3">
              <div class="col-3 body-2 column node-container mr-5">
                <span class="font-weight-bold" id="lblIpv4Node">VIP</span>
                <v-divider class="mt-2" />
                <div class="eos-form-group mt-0 ml-0">
                  <div class="mt-3">
                    <div class="eos-text-lg">
                      <label>IP address</label>
                      <span class="ml-9">{{
                        managementData[0].ip_address
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="eos-text-lg font-weight-bold"
            >Data network settings</v-expansion-panel-header
          >
          <v-expansion-panel-content>
            <div class="row ma-0 mt-3">
              <template v-for="(node, index) in dataNetwork">
                <div
                  class="col-3 body-2 column node-container mr-5"
                  :key="index"
                >
                  <span class="font-weight-bold" id="lblIpv4Node">{{
                    node.name
                  }}</span>
                  <v-divider class="mt-2" />
                  <div class="eos-form-group mt-0 ml-0">
                    <div class="mt-3">
                      <div class="eos-text-lg">
                        <label>IP Address</label>
                        <span class="ml-9">{{ node.ip_address }}</span>
                      </div>
                    </div>
                    <div class="mt-3" v-if="node.name !== 'VIP'">
                      <div class="eos-text-lg">
                        <label>Gateway</label>
                        <span class="ml-12">{{ node.gateway }}</span>
                      </div>
                    </div>
                    <div class="mt-3" v-if="node.name !== 'VIP'">
                      <div class="eos-text-lg">
                        <label>Netmask</label>
                        <span class="ml-12">{{ node.netmask }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="eos-text-lg font-weight-bold"
            >DNS settings</v-expansion-panel-header
          >
          <v-expansion-panel-content>
            <div class="row ma-0 mt-3">
              <template v-for="(node, index) in dnsData">
                <div
                  class="col-3 body-2 column node-container mr-5"
                  :key="index"
                >
                  <span class="font-weight-bold" id="lblIpv4Node">{{
                    node.name
                  }}</span>
                  <v-divider class="mt-2" />
                  <div class="eos-form-group mt-0 ml-0">
                    <div class="mt-3">
                      <div class="eos-text-lg">
                        <label>DNS servers</label>
                        <span class="ml-10">{{ node.dns_servers }}</span>
                      </div>
                    </div>
                    <div class="mt-3">
                      <div class="eos-text-lg">
                        <label>Search domains</label>
                        <span class="ml-5">{{ node.search_domain }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="eos-text-lg font-weight-bold"
            >NTP settings</v-expansion-panel-header
          >
          <v-expansion-panel-content>
            <div class="row ma-0 mt-3">
              <template>
                <div class="col-3 body-2 column node-container mr-5">
                  <span class="font-weight-bold" id="lblIpv4Node"></span>
                  <div class="eos-form-group mt-0 ml-0">
                    <div class="mt-3">
                      <div class="eos-text-lg">
                        <label>NTP address</label>
                        <span class="ml-12">{{ serverAddress }}</span>
                      </div>
                    </div>
                    <div class="mt-3">
                      <div class="eos-text-lg">
                        <label>Timezone</label>
                        <span class="ml-12">{{ timezone }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="eos-text-lg font-weight-bold"
            >Notifications</v-expansion-panel-header
          >
          <v-expansion-panel-content v-if="notificationData">
            <div class="row ma-0 mt-3">
              <template>
                <div class="col-3 body-2 column node-container mr-5">
                  <span class="font-weight-bold" id="lblIpv4Node"></span>
                  <div class="eos-form-group mt-0 ml-0">
                    <div class="mt-3">
                      <div class="eos-text-lg">
                        <label>SMTP server</label>
                        <span class="ml-12">{{
                          notificationData.smtp_server
                        }}</span>
                      </div>
                    </div>
                    <div class="mt-3">
                      <div class="eos-text-lg">
                        <label>Sender email</label>
                        <span class="ml-12">{{
                          notificationData.smtp_sender_email
                        }}</span>
                      </div>
                    </div>
                    <div class="mt-3">
                      <div class="eos-text-lg">
                        <label>Receiver email</label>
                        <span class="ml-10">{{ notificationData.email }}</span>
                      </div>
                    </div>
                    <div class="mt-3">
                      <div class="eos-text-lg">
                        <label class="mr-10">Protocol</label>
                        <span class="ml-12">{{
                          notificationData.smtp_protocol
                        }}</span>
                      </div>
                    </div>
                    <div class="mt-3">
                      <div class="eos-text-lg">
                        <label class="mr-6">SMTP port</label>
                        <span class="ml-12">{{
                          notificationData.smtp_port
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <eos-confirmation-dialog
        :show="showConfirmDialog"
        title="Confirmation"
        :message="'You are moving on new IP address ' + newUrl"
        severity="info"
        @closeDialog="closeConfirmDialog"
        confirmButtonText="Continue"
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
@Component({
  name: "eos-onboarding-summary"
})
export default class EosOnboardingSummary extends Vue {
  private data() {
    return {
      serverAddress: "",
      timezone: "",
      managementData: [],
      dataNetwork: [],
      dnsData: [],
      newUrl: "",
      showConfirmDialog: false,
      wizardRes: undefined,
      notificationData: {}
    };
  }
  private openConfirmDialog() {
    this.$data.showConfirmDialog = true;
  }
  private async closeConfirmDialog(confirmation: string) {
    this.$data.showConfirmDialog = false;
    if (confirmation) {
      this.$data.wizardRes(true);
      this.$store.dispatch("systemConfig/updateSummary", true);
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
  private mounted() {
    const vm = this;
    EVENT_BUS.$on("emitOnNext", (res: any) => {
      vm.openConfirmDialog();
      this.$data.wizardRes = res;
    });
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
        systemconfig.date_time_settings.ntp
      ) {
        this.$data.timezone =
          systemconfig.date_time_settings.ntp.ntp_timezone_offset;
        this.$data.serverAddress =
          systemconfig.date_time_settings.ntp.ntp_server_address;
      }
      if (systemconfig.notifications && systemconfig.notifications.email) {
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
}
</script>
<style lang="scss" scoped></style>
