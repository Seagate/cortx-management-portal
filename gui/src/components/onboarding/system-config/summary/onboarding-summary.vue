<template>
  <v-container class="mt-6 ml-0">
    <div id="app">
      <v-expansion-panels>
        <v-expansion-panel v-if="managementData[0]">
          <v-expansion-panel-header class="eos-text-lg"
            >Management network setting</v-expansion-panel-header
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
          <v-expansion-panel-header class="eos-text-lg"
            >Data network setting</v-expansion-panel-header
          >
          <v-expansion-panel-content>
            <div class="row ma-0 mt-3">
              <template v-for="(node, index) in datanetwork">
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
                        <label>Ip Address</label>
                        <span class="ml-9">{{ node.ip_address }}</span>
                      </div>
                    </div>
                    <div class="mt-3">
                      <div class="eos-text-lg">
                        <label>Netmask</label>
                        <span class="ml-12">{{ node.gateway }}</span>
                      </div>
                    </div>
                    <div class="mt-3">
                      <div class="eos-text-lg">
                        <label>Gateway</label>
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
          <v-expansion-panel-header class="eos-text-lg"
            >DNS setting</v-expansion-panel-header
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
          <v-expansion-panel-header class="eos-text-lg"
            >NTP setting</v-expansion-panel-header
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
                        <span class="ml-12">{{ serveraddess }}</span>
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
          <v-expansion-panel-header class="eos-text-lg"
            >Notifications</v-expansion-panel-header
          >
          <v-expansion-panel-content>
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
      <v-dialog v-model="showConfirmDeleteDialog" persistent max-width="790">
        <v-card>
          <v-system-bar color="greay lighten-3">
            <v-spacer></v-spacer>
            <v-icon
              @click="closeConfirmDeleteDialog('no')"
              style="cursor: pointer;"
              >mdi-close</v-icon
            >
          </v-system-bar>
          <v-card-title class="title ml-3">
            <span>Confirmation</span>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <label class="ml-3 delete-bucket-confirmation-msg"
              >You are moving on new ip {{ new_url }}</label
            >
          </v-card-text>
          <v-card-actions>
            <button
              type="button"
              class="ma-5 eos-btn-primary"
              @click="closeConfirmDialog('yes')"
            >
              Yes
            </button>
            <button
              type="button"
              class="ma-5 eos-btn-tertiary"
              @click="closeConfirmDialog('no')"
            >
              No
            </button>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <span class="d-none">{{ isValidForm }}</span>
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
      serveraddess: "",
      timezone: "",
      managementData: [],
      datanetwork: [],
      dnsData: [],
      new_url: "",
      showConfirmDeleteDialog: false,
      wizardRes: undefined,
      notificationData: {}
    };
  }
  private openConfirmDialog() {
    this.$data.showConfirmDeleteDialog = true;
  }
  private async closeConfirmDialog(confirmation: string) {
    this.$data.showConfirmDeleteDialog = false;
    if (confirmation === "yes") {
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
    this.managementNetworkGetter();
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
  private managementNetworkGetter(): any {
    const systemconfig = this.$store.getters["systemConfig/systemconfig"];
    if (systemconfig) {
      if (
        systemconfig.management_network_settings &&
        systemconfig.management_network_settings.ipv4
      ) {
        this.$data.managementData =
          systemconfig.management_network_settings.ipv4.nodes;
      }
      if (
        systemconfig.data_network_settings &&
        systemconfig.data_network_settings.ipv4
      ) {
        this.$data.datanetwork = systemconfig.data_network_settings.ipv4.nodes;
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
        this.$data.serveraddess =
          systemconfig.date_time_settings.ntp.ntp_server_address;
      }
      if (systemconfig.notifications) {
        this.$data.notificationData = systemconfig.notifications.email;
      }
      // const url = window.location.href;
      // const protocol = location.protocol;
      // const port = location.port;
      // this.$data.new_url = protocol.concat(
      //   "//",
      //   this.$data.managementData[0].hostname,
      //   ":",
      //   port
      // );
    }
  }
}
</script>
<style lang="scss" scoped></style>
