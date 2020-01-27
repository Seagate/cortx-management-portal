<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblNotification">
        Notifications
      </div>
      <div class="mt-4">
        <div class="font-weight-regular black--text" id="lblNotificationMsg">
          The system will send out notifications of important events that may
          happen throughout the life of the product. It is highly recommended
          that you configure at least one notification path so that you can
          quickly respond to any critical events that may arise in the system.
          You can set up notifications to be sent via email, SNMP in the
          following screens. You have the option to skip this step entirely, but
          doing so is strongly discouraged.
        </div>

        <div
          class="mt-5 font-weight-regular black--text"
          id="lblNotificationMsgChoose"
        >
          Choose the notification options below that align best with your plans
          for supporting data infrastructure within your network.
        </div>
        <v-divider class="mt-5" />
        <div class="mt-5">
          <input
            type="checkbox"
            v-model="isEmailSettingsStatus"
            name="email"
            :disabled="isSkip"
            id="chkNotificationEmail"
          />
          <span class="ml-3 font-weight-bold" id="lblNotificationEmail"
            >Email</span
          >
          <div
            class="mt-5 font-weight-regular black--text"
            id="lblNotificationConfig"
          >
            Selecting Email will allow you to configure both secure and
            non-secure email servers for event notification. You can control the
            severity of events that you wish to receive, and you will be able to
            test out your notification settings.
          </div>
        </div>
        <div class="mt-5">
          <input
            type="checkbox"
            v-model="isSkip"
            name="skip"
            :disabled="isEmailSettingsStatus || isSysLogSettingsStatus"
            id="chkNotificationSkip"
          />
          <span class="ml-3 font-weight-bold" id="lblNotificationSkip"
            >Skip this step</span
          >
          <div class="mt-5 font-weight-regular black--text">
            If you choose to set up notification paths later, you may skip this
            step for now. However, skipping this step is strongly discouraged,
            and it is highly recommended that you set event notifications up as
            soon as possible to maintain the health of your system.
          </div>
        </div>
      </div>
    </div>
    <span class="d-none">{{ isValidForm }}</span>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { EVENT_BUS } from "./../../../../main";

@Component({
  name: "eos-notifications"
})
export default class EosNotifications extends Vue {
  public data() {
    return {
      isSkip: false
    };
  }
  public mounted() {
    // WizardHook: Open a listener for onNext event
    // So when wizard footer clicks on the Next Button this component can perform its own workflow
    EVENT_BUS.$on("emitOnNext", (res: any) => {
      res(true);
    });
  }
  public destroyed() {
    // WizardHook: shut off on exit event listener
    EVENT_BUS.$off("emitOnNext");
  }
  get isValidForm() {
    // WizardHook: Emit event to sibling wizard footer component
    // to send information about data validation to enable/disable wizard footer
    EVENT_BUS.$emit(
      "validForm",
      this.isEmailSettingsStatus ||
        this.isSysLogSettingsStatus ||
        this.$data.isSkip
    );
    return true;
  }
  public get isEmailSettingsStatus(): any {
    return this.$store.getters["systemConfig/isEmailSettingsStatus"];
  }
  public set isEmailSettingsStatus(status: any) {
    this.$store.commit("systemConfig/setNotificationsType", {
      type: "email",
      flag: status
    });
  }

  public get isSysLogSettingsStatus(): any {
    return this.$store.getters["systemConfig/isSysLogSettingsStatus"];
  }

  public set isSysLogSettingsStatus(status: any) {
    this.$store.commit("systemConfig/setNotificationsType", {
      type: "syslog",
      flag: status
    });
  }

  public get isNotificationSettingSkipStatus(): any {
    return this.$store.getters["systemConfig/isNotificationSettingSkipStatus"];
  }

  public set isNotificationSettingSkipStatus(status: any) {
    this.$store.commit("systemConfig/setNotificationsType", {
      type: "skip",
      flag: status
    });
  }
}
</script>
<style lang="scss" scoped>
.input-text {
  border-style: solid;
  border-width: 1px;
  border-color: #e3e3e3;
  width: 20em;
  height: 2.5em;
}
.pointer {
  cursor: pointer;
}
</style>
