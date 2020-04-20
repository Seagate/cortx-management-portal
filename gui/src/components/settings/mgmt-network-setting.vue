<template>
  <div class="eos-p-2 body-2">
    <div class="eos-text-lg mt-2 font-weight-bold" id="lblNetworkIP4">
      Management network settings: IPv4
    </div>
    <div class="mt-3" id="lblNetworkMsg">
      Configure the Virtual IP address for managing this system.
    </div>
    <div class="mt-3" id="lblMandatoryMsg">
      Fields marked with * are mandatory.
    </div>
    <v-divider class="mt-2" />
    <eosNetworkSettingsIpv4 @apply-settings="applySettingsConfirmation" />
    <eos-confirmation-dialog
      :show="showConfirmDialog"
      :message="
        `<span>You are moving on new IP address <a href='${newUrl}' target='_blank'>${newUrl}</a></span>`
      "
      severity="warning"
      submessage="Applying the changes will restart the system and the system will be moved to the new IP address."
      @closeDialog="applySettings"
      confirmButtonText="Apply"
      isMessageInHTML="true"
    ></eos-confirmation-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import EosNetworkSettingsIpv4Config from "../onboarding/system-config/mgmt-network/network-settings-ipv4-config.vue";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";

@Component({
  name: "eos-mgmt-settings",
  components: {
    eosNetworkSettingsIpv4: EosNetworkSettingsIpv4Config
  }
})
export default class EosMangementSetting extends Vue {
  private data() {
    return {
      sysconfigData: {},
      newConfigData: {},
      showConfirmDialog: false,
      newUrl: ""
    };
  }
  private async mounted() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      "Fetching system configuration..."
    );
    this.$data.sysconfigData = await this.$store.dispatch(
      "systemConfig/getSystemConfigAction"
    );
    if (!this.$data.sysconfigData) {
      const errorMessage = `No configurations found. Please complete the onboarding process`;
      throw {
        error: {
          message: errorMessage
        }
      };
    }
    this.$store.dispatch("systemConfig/hideLoader");
  }
  private async applySettingsConfirmation(data: any) {
    let redirectUrl;
    if (data.nodes && data.nodes.length) {
      redirectUrl = data.nodes[0].ip_address;
    }
    const protocol = window.location.protocol;
    const defaultUrl = window.location.hostname;
    const port = window.location.port;
    this.$data.newUrl = `${protocol}//${
      redirectUrl ? redirectUrl : defaultUrl
    }:${port}`;
    this.$data.showConfirmDialog = true;
    this.$data.newConfigData = data;
  }
  private async applySettings(confirmation: string) {
    this.$store.dispatch("systemConfig/showLoader", "Applying settings...");
    this.$data.showConfirmDialog = false;
    if (confirmation) {
      const res = await Api.patch(
        apiRegister.sysconfig,
        { management_network_settings: { ipv4: this.$data.newConfigData } },
        this.$data.sysconfigData.config_id,
        {
          params: {
            config_type: "management_network_settings"
          },
          timeout: -1
        }
      );
    }
    this.$store.dispatch("systemConfig/hideLoader");
  }
}
</script>

<style lang="scss" scoped></style>
