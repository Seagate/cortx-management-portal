<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="eos-text-lg mt-0 font-weight-bold" id="lblNetworkIP4">
        Management network settings: IPv4
      </div>
      <div class="mt-3" id="lblNetworkMsg">
        You need to configure a single IP address for management of this system.
      </div>
      <v-divider class="mt-2" />
      <eosNetworkSettingsIpv4 @apply-settings="applySettings" />
    </div>
  </v-container>
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
      sysconfigData: {}
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
  private async applySettings(data: object) {
    this.$store.dispatch("systemConfig/showLoader", "Please wait");
    const res = await Api.patch(
      apiRegister.sysconfig,
      { management_network_settings: { ipv4: data } },
      this.$data.sysconfigData.config_id,
      {
        params: {
          config_type: "management_network_settings"
        },
        timeout: -1
      }
    );
    this.$store.dispatch("systemConfig/hideLoader");
  }
}
</script>

<style lang="scss" scoped></style>
