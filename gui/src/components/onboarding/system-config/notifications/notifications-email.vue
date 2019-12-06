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
      <div class="title mt-6" id="lblEmail">
        Notifications: Email
        <v-icon class="green--text" size="20">mdi-help-circle-outline</v-icon>
      </div>
      <div class="mt-5">
        <span class="font-weight-medium" id="lblEmailSMTP">SMTP Server</span>
        <div>
          <input class="input-text" type="text" name="smtpserver" v-model="smtpserver"  id="txtEmailSmtp"/>
        </div>
      </div>
      <div class="mt-5">
        <span class="font-weight-medium" id="lblEmailSender">Sender Email</span>
        <div>
          <input class="input-text" type="text" name="senderemail" v-model="senderemail"  id="txtEmailsenderemail"/>
        </div>
      </div>
      <div class="mt-5">
        <v-row class="col-6">
          <v-col class="col-3 pa-0">
            <span class="font-weight-medium" id="lblEmailProtocol">Protocol</span>
            <div>
              <select name="protocol" id="cmdProtocol" class="input-text pl-1" style="width: 10em;">
                <option value="celsius">TLS</option>
              </select>
            </div>
          </v-col>
          <v-col class="pa-0">
            <span class="font-weight-medium" id="lblEmailSMTPPort">SMTP Port</span>
            <div>
              <input
                class="input-text"
                type="text"
                name="ipaddress"
                v-model="smtpport"
                style="width: 6em;"
                id="txtEmailIpAddress"
              />
            </div>
          </v-col>
        </v-row>
      </div>
      <div class="mt-5">
        <span class="font-weight-medium" id="lblEmailSenderPass">Sender Password</span>
        <div>
          <input class="input-text" type="text" name="senderpassword" v-model="senderpassword" id="txtEmailSenderPass" />
        </div>
      </div>
      <div class="mt-5">
        <span class="font-weight-medium" id="lblEmailConfirmPass">Confirm Password</span>
        <div>
          <input class="input-text" type="text" name="confirmpassword" v-model="confirmpassword" id="txtEmailConfirmPass" />
        </div>
      </div>
      <div class="mt-5">
        <span class="font-weight-medium" id="lblEmailAddress">Email Address</span>
        <div>
          <input class="input-text" type="text" name="emailaddress" v-model="emailaddress"  id="txtEmailAddress"/>
        </div>
        <div class="green--text pt-2 pointer" id="lblEmailAnotherEmail">Add another email address</div>
      </div>
      <div class="my-5">
        <input type="checkbox" @change="weeklyEmail" v-model="weeklyEmail" name="weeklyEmail" id="chkEmailWeeklyEmail"/>
        <span class="ml-3 font-weight-regular" id="lblEmailSummery">Get a weekly email summery of all health alerts</span>
      </div>
      <v-divider class="pt-5" />
      <div>
        <input type="checkbox" @change="testEmail" v-model="testEmail" name="testEmail"  id="chkEmailTest"/>
        <span class="ml-3 font-weight-regular" id="lblEmailNotification">Send test email notification</span>
        <div
          class="my-5 font-weight-regular"
        >You will receive a test email notification when you apply these settings. If you do not receive this notification, your settings may be incorrect.</div>
      </div>
      <v-divider class="pt-5" />
    </div>

    <div class="mt-8">
      <v-btn elevation="0" color="udxprimary" id="btnEmailApply">
        <span class="white--text" @click="gotToNextPage()">Apply and Continue</span>
      </v-btn>
      <span class="green--text ml-8 pointer" @click="gotToPrevPage()" id="lblEmailBack">Back to previous step</span>
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "eos-data-network-ipv4"
})
export default class EosDataNetworkIpv4 extends Vue {
  private gotToNextPage() {
    this.$router.push("notificationssyslog");
  }
  private gotToPrevPage() {
    this.$router.push("notifications");
  }
  private data() {
    return {
      smtpserver: "",
      senderemail: "",
      smtpport: "",
      senderpassword: "",
      confirmpassword: "",
      emailaddress: "",
      weeklyEmail: false,
      testEmail: false
    };
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
