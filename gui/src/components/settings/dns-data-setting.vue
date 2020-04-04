<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="eos-text-lg mt-0 font-weight-bold" id="lblDns">
        DNS resolver settings
      </div>
    </div>
    <v-divider class="mt-2" />
    <eosDnsSettingConfig @apply-settings="applySettings" />
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import EosDnsSettingConfig from "../onboarding/system-config/dns/dns-setting-config.vue";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";

@Component({
  name: "eos-dns-data-setting",
  components: {
    eosDnsSettingConfig: EosDnsSettingConfig
  }
})
export default class EosDnsDataSetting extends Vue {
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
      { dns_network_settings: data },
      this.$data.sysconfigData.config_id,
      {
        params: {
          config_type: "dns_network_settings"
        },
        timeout: -1
      }
    );
    this.$store.dispatch("systemConfig/hideLoader");
  }
}
</script>
<style lang="scss" scoped></style>
