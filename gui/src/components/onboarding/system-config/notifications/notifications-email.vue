<template>
  <v-container class="mt-6">
    <v-img
      id="alert-img"
      :src="require('./../../../../assets/onboarding-wizard.png')"
      width="780px"
      height="70px"
    ></v-img>
    <v-divider />
    <div class="body-2">
      <div class="title mt-6" id="lblEmail">Notifications: Email</div>
      <div class="mt-5">
        <span class="font-weight-medium" id="lblEmailSMTP">SMTP Server</span>
        <div>
          <input
            class="input-text"
            type="text"
            name="smtpserver"
            v-model="smtpserver"
            id="txtEmailSmtp"
          />
        </div>
      </div>
      <div class="mt-5">
        <span class="font-weight-medium" id="lblEmailSender">Sender Email</span>
        <div>
          <input
            class="input-text"
            type="text"
            name="senderemail"
            v-model="senderemail"
            id="txtEmailsenderemail"
          />
        </div>
      </div>
      <div class="mt-5">
        <v-row class="col-6">
          <v-col class="col-3 pa-0">
            <span class="font-weight-medium" id="lblEmailProtocol">Protocol</span>
            <div>
              <select
                name="protocol"
                id="cmdProtocol"
                v-model="protocol"
                class="input-text pl-1"
                style="width: 10em;"
              >
                <option value="TLS">TLS</option>
              </select>
            </div>
          </v-col>
          <v-col class="pa-0">
            <span class="font-weight-medium" id="lblEmailSMTPPort">SMTP Port</span>
            <div>
              <input
                class="input-text"
                type="number"
                name="ipaddress"
                v-model="smtpport"
                style="width: 6em;"
                id="txtEmailIpAddress"
                min=0001
                max=65535
              />
            </div>
          </v-col>
        </v-row>
      </div>
      <div class="mt-5">
        <span class="font-weight-medium" id="lblEmailSenderPass">Sender Password</span>
        <div>
          <input
            class="input-text"
            type="password"
            name="senderpassword"
            v-model="senderpassword"
            id="txtEmailSenderPass"
          />
        </div>
      </div>
      <div class="mt-5">
        <span class="font-weight-medium" id="lblEmailConfirmPass">Confirm password</span>
        <div>
          <input
            class="input-text"
            type="password"
            name="confirmpassword"
            v-model="confirmpassword"
            id="txtEmailConfirmPass"
          />
          <p
            v-if="!isConfirmPasswordValid"
            class="red--text error-message"
          >Confirm Password is not valid</p>
        </div>
      </div>
      <div class="mt-5">
        <span class="font-weight-medium" id="lblEmailAddress">Email Address</span>
        <div>
          <input
            class="input-text"
            type="text"
            name="emailaddress"
            v-model="emailaddress"
            id="txtEmailAddress"
          />
        </div>
        <div class="csmprimary--text pt-2 pointer" id="lblEmailAnotherEmail">Add another email address</div>
      </div>
      <div class="my-5">
        <input
          type="checkbox"
          v-model="weeklyEmail"
          name="weeklyEmail"
          id="chkEmailWeeklyEmail"
        />
        <span
          class="ml-3 font-weight-regular"
          id="lblEmailSummery"
        >Get a weekly email summery of all health alerts</span>
      </div>
      <v-divider class="pt-5" />
      <div>
        <input
          type="checkbox"
          v-model="testEmail"
          name="testEmail"
          id="chkEmailTest"
        />
        <span
          class="ml-3 font-weight-regular"
          id="lblEmailNotification"
        >Send test email notification</span>
        <div
          class="my-5 font-weight-regular"
        >You will receive a test email notification when you apply these settings. If you do not receive this notification, your settings may be incorrect.</div>
      </div>
      <v-divider class="pt-5" />
    </div>

    <div class="mt-8">
      <v-btn elevation="0" color="udxprimary" id="btnEmailApply" :disabled="!isValidForm">
        <span class="white--text" @click="gotToNextPage()">Apply and Continue</span>
      </v-btn>
      <span
        class="green--text ml-8 pointer"
        @click="gotToPrevPage()"
        id="lblEmailBack"
      >Back to previous step</span>
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Email } from "./../../../../models/user-config";

@Component({
  name: "eos-data-network-ipv4"
})
export default class EosDataNetworkIpv4 extends Vue {
  public mounted(){
    const notificationConfiguration = this.$store.getters["userConfig/userConfigData"];
    console.log("TCL: EosUserSettingLdap -> mounted -> notificationConfiguration", notificationConfiguration)
    if(notificationConfiguration && notificationConfiguration.notifications && notificationConfiguration.notifications.email){
      this.$data.smtpserver = notificationConfiguration.notifications.email.stmp_server;
      this.$data.senderemail = notificationConfiguration.notifications.email.smtp_sender_email;
      this.$data.smtpport = notificationConfiguration.notifications.email.smtp_port;
      this.$data.protocol = notificationConfiguration.notifications.email.smtp_protocol;
      this.$data.emailaddress = notificationConfiguration.notifications.email.email;
      this.$data.weeklyEmail = notificationConfiguration.notifications.email.weekly_email;
      this.$data.testEmail = notificationConfiguration.notifications.email.send_test_mail;
    }
  }
  private gotToNextPage() {
    if(this.isValidForm){
      this.setEmailNotificationSettings();
      if(this.$store.getters["userConfig/isSysLogSettingsStatus"] === true) {
        this.$router.push("notificationssyslog");
      } else {
        this.$router.push("interfaceselect");
      }
    }    
  }
  private gotToPrevPage() {
    this.$router.push("notifications");
  }
  private setEmailNotificationSettings() {
    const queryParams: Email = {
      stmp_server: this.$data.smtpserver,
      smtp_port: this.$data.smtpport,
      smtp_protocol: this.$data.protocol,
      smtp_sender_email: this.$data.senderemail,
      smtp_sender_password: this.$data.senderpassword,
      email: this.$data.emailaddress,
      weekly_email: this.$data.weeklyEmail,
      send_test_mail: this.$data.testEmail
    };
    this.$store
      .dispatch("userConfig/updateEmailNotificationUserConfig", queryParams)
      .then((res: any) => {
        console.log("TCL: EosDataNetworkIpv4 -> setEmailNotificationSettings -> res", res)        
      })
      .catch(() => {
        console.error("Save Email Notifications settings Failed");
      });    
  }
  private data() {
    return {
      smtpserver: "",
      senderemail: "",
      smtpport: 80,
      protocol: "",
      senderpassword: "",
      confirmpassword: "",
      emailaddress: "",
      weeklyEmail: false,
      testEmail: false
    };
  }
  get isConfirmPasswordValid() {
    if (
      this.$data.confirmpassword === "" ||
      this.$data.senderpassword !== this.$data.confirmpassword
    ) {
      return false;
    }
    return true;
  }
  get isValidForm() {
    if (
      this.isConfirmPasswordValid
    ) {
      return true;
    }
    return false;
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
