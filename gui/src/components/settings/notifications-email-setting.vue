<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="eos-text-lg mt-0 font-weight-bold" id="lblEmail">
        Notifications: Email
      </div>
      <div class="mt-6" id="lblEmailMsg">
        Selecting email will allow you to configure both secure and non-secure
        email servers for event notification. You can control the severity of
        events that you wish to receive, and you will be able to test out your
        notification settings.
      </div>
      <v-divider class="mt-2" />
      <eosNotifications @apply-settings="applySettings" />
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import EosNotifications from "../onboarding/system-config/notifications/notifications-email-config.vue";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";

@Component({
  name: "eos-network-settings-ipv4",
  components: {
    eosNotifications: EosNotifications
  }
})
export default class EosNetworkSettingsIpv4 extends Vue {
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
      { notifications: { email: data } },
      this.$data.sysconfigData.config_id,
      {
        params: {
          config_type: "notifications"
        }
      }
    );
    this.$store.dispatch("systemConfig/hideLoader");
  }
}
</script>

<style lang="scss" scoped></style>
