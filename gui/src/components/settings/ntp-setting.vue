<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="eos-text-lg mt-0 font-weight-bold" id="lblDTSetDateTime">
        Network time protocol (NTP) settings
      </div>
      <v-divider class="mt-2" />
      <eosDateTimeConfig @apply-settings="applySettings" />
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import EosDateTimeConfig from "../onboarding/system-config/date-time/date-time-config.vue";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";

@Component({
  name: "eos-date-time",
  components: {
    eosDateTimeConfig: EosDateTimeConfig
  }
})
export default class EosNtpSetting extends Vue {
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
      { date_time_settings: data },
      this.$data.sysconfigData.config_id,
      {
        params: {
          config_type: "date_time_settings"
        },
        timeout: -1
      }
    );
    this.$store.dispatch("systemConfig/hideLoader");
  }
}
</script>

<style lang="scss" scoped></style>
