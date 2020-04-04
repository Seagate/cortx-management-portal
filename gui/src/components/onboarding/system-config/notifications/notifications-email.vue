<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblEmail">
        Notifications: Email
      </div>
      <div class="mt-3" id="lblEmailMsg">
        Selecting email will allow you to configure both secure and non-secure
        email servers for event notification. You can control the severity of
        events that you wish to receive, and you will be able to test out your
        notification settings.
      </div>
      <v-divider class="mt-2" />
      <eosNotifications />
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import EosNotifications from "./notifications-email-config.vue";

@Component({
  name: "eos-notification-email",
  components: {
    eosNotifications: EosNotifications
  }
})
export default class EosNotificationEmail extends Vue {}
</script>

<style lang="scss" scoped></style>
