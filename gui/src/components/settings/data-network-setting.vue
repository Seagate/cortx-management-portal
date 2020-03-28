<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="eos-text-lg mt-0 font-weight-bold" id="lblIpv4DataNetwork">
        Data network settings: IPv4
      </div>
      <div class="mt-6" id="lblIpv4Msg">
        You need to configure a single IP address for management of this system.
      </div>
      <v-divider class="mt-2" />
      <eosDataNetworkIpv4Config @apply-settings="applySettings" />
    </div>
  </v-container>
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
    this.$store.dispatch("systemConfig/hideLoader");
  }
  private async applySettings(data: object) {
    this.$store.dispatch("systemConfig/showLoader", "Please wait");
    const res = await Api.patch(
      apiRegister.sysconfig,
      { data_network_settings: { ipv4: data } },
      this.$data.sysconfigData.config_id,
      {
        params: {
          config_type: "data_network_settings"
        }
      }
    );
  }
}
</script>

<style lang="scss" scoped></style>
