<template>
  <div class="eos-p-2 body-2">
    <div class="eos-text-lg mt-2 font-weight-bold" id="lblIpv4DataNetwork">
      Data network settings: IPv4
    </div>
    <div class="mt-3" id="lblIpv4Msg">
      For Manual option, you must configure Virtual IP address and values for
      Node 0 and Node 1.
    </div>
    <div class="mt-3" id="lblMandatoryMsg">
      Fields marked with * are mandatory.
    </div>
    <v-divider class="mt-2" />
    <eosDataNetworkIpv4Config @apply-settings="applySettingsConfirmation" />
    <eos-confirmation-dialog
      :show="showConfirmDialog"
      message="Are you sure you want to apply these settings?"
      severity="warning"
      @closeDialog="applySettings"
      confirmButtonText="Apply"
    ></eos-confirmation-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import EosDataNetworkIpv4Config from "../onboarding/system-config/data-network/data-network-ipv4-config.vue";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";

@Component({
  name: "eos-data-network-setting",
  components: {
    eosDataNetworkIpv4Config: EosDataNetworkIpv4Config
  }
})
export default class EosDataNetworkSetting extends Vue {
  private data() {
    return {
      sysconfigData: {},
      newConfigData: {},
      showConfirmDialog: false
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
    this.$data.showConfirmDialog = true;
    this.$data.newConfigData = data;
  }
  private async applySettings(confirmation: string) {
    this.$store.dispatch("systemConfig/showLoader", "Applying settings...");
    this.$data.showConfirmDialog = false;
    if (confirmation) {
      const res = await Api.patch(
        apiRegister.sysconfig,
        { data_network_settings: { ipv4: this.$data.newConfigData } },
        this.$data.sysconfigData.config_id,
        {
          params: {
            config_type: "data_network_settings"
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
