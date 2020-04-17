<template>
  <div class="eos-p-2 body-2">
    <div class="eos-text-lg mt-2 font-weight-bold" id="lblEmail">
      Notification settings: Email
    </div>
    <div class="mt-3" id="lblEmailMsg">
      Allows you to configure email servers for notifications.
    </div>
    <div class="mt-3" id="lblMandatoryMsg">
      Fields marked with * are mandatory.
    </div>
    <v-divider class="mt-2" />
    <eosNotifications @apply-settings="applySettings" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import EosNotifications from "../onboarding/system-config/notifications/notifications-email-config.vue";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";

@Component({
  name: "eos-notification-email-settings",
  components: {
    eosNotifications: EosNotifications
  }
})
export default class EosNotificationEmailSettings extends Vue {
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
