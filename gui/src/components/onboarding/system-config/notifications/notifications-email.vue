<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblEmail">
        Notifications: Email
      </div>
      <div class="mt-5">
        <span class="font-weight-medium" id="lblEmailSMTP">SMTP server</span>
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
        <span class="font-weight-medium" id="lblEmailSender">Sender email</span>
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
            <span class="font-weight-medium" id="lblEmailProtocol"
              >Protocol</span
            >
            <div>
              <select
                name="protocol"
                id="cmdProtocol"
                v-model="protocol"
                class="input-text pl-1"
                style="width: 10em;"
              >
                <option value="TLS">SSL/TLS</option>
                <option value="STARTTLS">STARTTLS</option>
              </select>
            </div>
          </v-col>
          <v-col class="pa-0">
            <span class="font-weight-medium" id="lblEmailSMTPPort"
              >SMTP port</span
            >
            <div>
              <input
                class="input-text"
                type="number"
                name="ipaddress"
                v-model="smtpport"
                style="width: 6em;"
                id="txtEmailIpAddress"
                min="0001"
                max="65535"
              />
            </div>
          </v-col>
        </v-row>
      </div>
      <div class="mt-5">
        <span class="font-weight-medium" id="lblEmailSenderPass"
          >Sender password</span
        >
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
        <span class="font-weight-medium" id="lblEmailConfirmPass"
          >Confirm password</span
        >
        <div>
          <input
            class="input-text"
            type="password"
            name="confirmpassword"
            v-model="confirmpassword"
            id="txtEmailConfirmPass"
          />
          <p
            v-if="!isConfirmPasswordValid && confirmpassword !== ''"
            class="red--text error-message"
          >
            Confirm password is not valid
          </p>
        </div>
      </div>
      <div class="mt-5">
        <span class="font-weight-medium" id="lblEmailAddress"
          >Receiver email addresses</span
        >
        <div>
          <textarea
            name="emailaddress"
            v-model="emailaddress"
            id="txtEmailAddress"
            rows="3"
            placeholder="Enter semicolon ';' seperated values"
            class="textarea-text"
          />
        </div>
      </div>
      <button
        type="button"
        class="eos-btn-primary mt-5 "
        :disabled="!isConfirmPasswordValid"
      >
        Send test email
      </button>
    </div>

    <p v-if="!isValid" class="red--text error-message">
      Please enter valid values.
    </p>
    <span class="d-none">{{ isValidForm }}</span>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Email } from "./../../../../models/system-configuration";
import { EVENT_BUS } from "./../../../../main";

@Component({
  name: "eos-data-network-ipv4"
})
export default class EosDataNetworkIpv4 extends Vue {
  public mounted() {
    this.notificationGetter();
    // WizardHook: Open a listener for onNext event
    // So when wizard footer clicks on the Next Button this component can perform its own workflow
    EVENT_BUS.$on("emitOnNext", (res: any) => {
      this.setEmailNotificationSettings().then(result => {
        res(true);
      });
    });
  }
  private destroyed() {
    // WizardHook: shut off on exit event listner
    EVENT_BUS.$off("emitOnNext");
  }
  get isValidForm() {
    let validate = false;
    if (this.isConfirmPasswordValid) {
      validate = true;
    }
    // WizardHook: Emit event to sibling wizard footer component
    // to send information about data validation to enable/disable wizard footer
    EVENT_BUS.$emit("validForm", validate);
    return validate;
  }
  private notificationGetter(): any {
    const notificationConfiguration = this.$store.getters[
      "systemConfig/userConfigData"
    ];
    if (
      notificationConfiguration &&
      notificationConfiguration.notifications &&
      notificationConfiguration.notifications.email
    ) {
      this.$data.smtpserver =
        notificationConfiguration.notifications.email.stmp_server;
      this.$data.senderemail =
        notificationConfiguration.notifications.email.smtp_sender_email;
      this.$data.smtpport =
        notificationConfiguration.notifications.email.smtp_port;
      this.$data.protocol =
        notificationConfiguration.notifications.email.smtp_protocol;
      this.$data.emailaddress =
        notificationConfiguration.notifications.email.email;
      this.$data.weeklyEmail =
        notificationConfiguration.notifications.email.weekly_email;
      this.$data.testEmail =
        notificationConfiguration.notifications.email.send_test_mail;
    }
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
    return this.$store.dispatch(
      "systemConfig/updateEmailNotificationUserConfig",
      queryParams
    );
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
      testEmail: false,
      isValid: true
    };
  }
  get isConfirmPasswordValid() {
    if (
      this.$data.confirmpassword &&
      this.$data.senderpassword === this.$data.confirmpassword
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
.textarea-text {
  border-style: solid;
  border-width: 1px;
  border-color: #e3e3e3;
  width: 20em;
}
</style>
