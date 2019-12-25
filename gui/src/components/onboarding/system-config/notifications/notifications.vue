<template>
  <v-container class="mt-6 body-2">
    <v-img
      id="alert-img"
      :src="require('./../../../../assets/onboarding-wizard.png')"
      width="780px"
      height="70px"
    ></v-img>
    <v-divider />
    <div>
      <div class="title mt-6" id="lblNotification">Notifications</div>
    </div>
    <div class="mt-4">
      <div class="font-weight-regular black--text" id="lblNotificationMsg">
        The system will send out notifications of important events that may happen throught the life of the product. It
        is highly recmmended that you configure at least one notification path so that you can quickly respond to any
        critical events that may arise in the system. You can set up notifications to be sent via email, SNMP and syslog
        in the following screens. You have the option to skip this step entirely, but doing so is strongly discouraged.
      </div>

      <div class="mt-5 font-weight-regular black--text" id="lblNotificationMsgChoose">
        Choose the notification options below that align best with your plans for supporting data infrastructure within
        your network.
      </div>
      <v-divider class="mt-5" />
      <div class="mt-5">
        <input type="checkbox" v-model="isEmailSettingsStatus" name="email" :disabled="isNotificationSettingSkipStatus" id="chkNotificationEmail"/>
        <span class="ml-3 font-weight-medium" id="lblNotificationEmail">Email</span>
        <div class="mt-5 font-weight-regular black--text" id="lblNotificationconfig">
          Selecting Email will allow you to configure both secure and non-secure email servers for event notification.
          You can control the severity of events that you wish to receive, and you will be able to test out your
          notificatio settings.
        </div>
      </div>
      <div class="mt-5">
        <input type="checkbox" v-model="isSysLogSettingsStatus" name="syslog" :disabled="isNotificationSettingSkipStatus" id="chkNotificationSyslog" />
        <span class="ml-3 font-weight-medium">Syslog</span>
        <div class="mt-5 font-weight-regular black--text" id="lblNotificationSyslog">
          Selecting Syslog will allow you to setup a syslog server destination for event notification. You can control
          the severity of events that you wish to receive, and you will be able to test out your notification settings.
        </div>
      </div>
      <div class="mt-5">
        <input type="checkbox" v-model="isNotificationSettingSkipStatus" name="skip" :disabled="isEmailSettingsStatus || isSysLogSettingsStatus" id="chkNofiticationSkip" />
        <span class="ml-3 font-weight-medium" id="lblNotificatonSkip">Skip this step</span>
        <div class="mt-5 font-weight-regular black--text">
          If you choose to set up notification paths later, you may skip this step for now. However, skipping this step
          is strongly discouraged, and it is highly recommended that you set event notifications up as soon as possible
          to maintain the health of your system.
        </div>
      </div>
    </div>
    <v-divider class="mt-8" />
    <div class="mt-3">
      <v-btn elevation="0" color="csmprimary" id="btnNotificationContinue" :disabled="!isEmailSettingsStatus && !isSysLogSettingsStatus && !isNotificationSettingSkipStatus">
        <span class="white--text" @click="gotToNextPage()">Continue</span>
      </v-btn>
      <span class="csmprimary--text ml-8 pointer" @click="gotToPrevPage()" id="lblNotificationBack"
        >Back to previous step</span
      >
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "eos-notifications"
})
export default class EosNotifications extends Vue {
  public gotToNextPage() {
    if (this.$store.getters["systemConfig/isEmailSettingsStatus"] === true) {
      this.$router.push("notificationsemail");
    } else if(this.$store.getters["systemConfig/isSysLogSettingsStatus"] === true) {
      this.$router.push("notificationssyslog");
    } else {
      this.$router.push("interfaceselect");
    }
  }
  public gotToPrevPage() {
    if (this.$store.getters["systemConfig/isLdapUserStatus"] === true) {
      this.$router.push("usersettingldap");
    } else if(this.$store.getters["systemConfig/isLocalUserStatus"] === true) {
      this.$router.push("usersettinglocal");
    } else {
      this.$router.push("usersetting");
    }
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

  // private data() {
  //   return {
  //     email: false,
  //     syslog: false,
  //     skip: false
  //   };
  // }
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
