<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblEmail">Notifications: Email</div>
      <div class="row">
        <div class="col-4 column node-container py-0">
          <div
            class="eos-form-group"
            :class="{
          'eos-form-group--error': $v.smtpserver.$error
        }"
          >
            <label class="eos-form-group-label" for="accountName">SMTP server*</label>
            <input
              class="eos-form__input_text"
              type="text"
              id="txtEmailSmtp"
              name="smtpserver"
              v-model.trim="smtpserver"
              @input="$v.smtpserver.$touch"
            />
            <div class="eos-form-group-label eos-form-group-error-msg">
              <label v-if="$v.smtpserver.$dirty && !$v.smtpserver.required">SMTP server is required</label>
              <label v-else-if="$v.smtpserver.$dirty && !$v.smtpserver.ipAddress">SMTP serverAddress</label>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-4 column node-container py-0">
          <div
            class="eos-form-group"
            :class="{
          'eos-form-group--error': $v.senderemail.$error
        }"
          >
            <label class="eos-form-group-label" for="accountName">Sender email*</label>
            <input
              class="eos-form__input_text"
              type="text"
              id="txtEmailsenderemail"
              name="smtpsesenderemailrver"
              v-model.trim="senderemail"
              @input="$v.senderemail.$touch"
            />
            <div class="eos-form-group-label eos-form-group-error-msg">
              <label
                v-if="$v.senderemail.$dirty && !$v.senderemail.required"
              >Senderemail is required</label>
              <label v-if="$v.senderemail.$dirty && !$v.senderemail.email">Email id not valid</label>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-4 column node-container py-0">
          <div class="eos-form-group">
            <label class="eos-form-group-label" for="hostname" id="lblDTNetworkServeradd">Protocol*</label>
            <select
              name="cmdProtocol"
              id="cmdProtocol"
              class="eos-form__input_text"
              v-model="protocol"
            >
              <option value="TLS">SSL/TLS</option>
              <option value="STARTTLS">STARTTLS</option>
            </select>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-4 column node-container py-0">
          <div
            class="eos-form-group"
            :class="{
          'eos-form-group--error': $v.smtpport.$error
        }"
          >
            <label
              class="eos-form-group-label"
              for="lblEmailSenderPass"
              id="lblEmailSMTPPort"
            >SMTP port*</label>
            <input
              class="eos-form__input_text"
              type="number"
              id="txtEmailIpAddress"
              name="smtp_port"
              v-model.trim="smtpport"
              @input="$v.smtpport.$touch"
            />
            <div class="eos-form-group-label eos-form-group-error-msg">
              <label v-if="$v.smtpport.$dirty && !$v.smtpport.required">Port is not valid</label>
              <label v-if="$v.smtpport.$dirty && !$v.smtpport.maxLength">Max 4 charactor required</label>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-4 column node-container py-0">
          <div
            class="eos-form-group"
            :class="{
          'eos-form-group--error': $v.senderpassword.$error
        }"
          >
            <label
              class="eos-form-group-label"
              for="lblEmailSenderPass"
              id="lblEmailSenderPass"
            >Sender password*</label>
            <input
              class="eos-form__input_text"
              type="password"
              id="txtEmailSenderPass"
              name="senderpassword"
              v-model.trim="senderpassword"
              @input="$v.senderpassword.$touch"
            />
            <div class="eos-form-group-label eos-form-group-error-msg">
              <label
                v-if="$v.senderpassword.$dirty && !$v.senderpassword.required"
              >senderpassword is required</label>
              <label
                v-if="$v.senderpassword.$dirty && !$v.senderpassword.minLength"
              >Minimum 4 charactor required</label>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-4 column node-container py-0">
          <div
            class="eos-form-group"
            :class="{
          'eos-form-group--error': $v.confirmpassword.$error
        }"
          >
            <label
              class="eos-form-group-label"
              for="lblEmailSenderPass"
              id="lblEmailSenderPass"
            >Confirm password*</label>
            <input
              class="eos-form__input_text"
              type="password"
              id="txtEmailConfirmPass"
              name="senderpassword"
              v-model.trim="confirmpassword"
              @input="$v.confirmpassword.$touch"
            />
            <div class="eos-form-group-label eos-form-group-error-msg">
              <label
                v-if="$v.confirmpassword.$dirty && !$v.confirmpassword.sameAsPassword"
              >Confirmpassword do not match</label>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-4 column node-container py-0">
          <div
            class="eos-form-group"
            :class="{
          'eos-form-group--error': $v.emailaddress.$error
        }"
          >
            <label
              class="eos-form-group-label"
              for="lblEmailSenderPass"
              id="lblEmailSenderPass"
            >Receiver email addresses*</label>
            <textarea
              class="eos-form__input_textarea"
              id="txtEmailsenderemail"
              name="senderpassword"
              v-model.trim="emailaddress"
              @input="$v.emailaddress.$touch"
              placeholder="Enter comma ',' seperated values"
            ></textarea>
            <div class="eos-form-group-label eos-form-group-error-msg">
              <label v-if="$v.emailaddress.$dirty && !$v.emailaddress.required">Email is required</label>
              <label
                v-if="$v.emailaddress.$dirty && !$v.emailaddress.emailRegex"
              >Enter valid comma ',' seperated emails</label>
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        class="eos-btn-primary mt-5"
        :disabled="!isConfirmPasswordValid"
      >Send test email</button>
    </div>

    <p v-if="!isValid" class="red--text error-message">Please enter valid values.</p>
    <span class="d-none">{{ isValidForm }}</span>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Email } from "./../../../../models/system-configuration";
import { EVENT_BUS } from "./../../../../main";
import { Validations } from "vuelidate-property-decorators";
import {
  required,
  helpers,
  sameAs,
  ipAddress,
  requiredIf,
  email,
  minLength,
  maxLength
} from "vuelidate/lib/validators";
const emailRegex = helpers.regex(
  "emailRegex",
  /^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/
);
@Component({
  name: "eos-data-network-ipv4"
})
export default class EosDataNetworkIpv4 extends Vue {
  @Validations()
  public validations = {
    smtpserver: {
      required,
      ipAddress
    },
    senderemail: {
      required,
      email
    },
    senderpassword: {
      required,
      minLength: minLength(4)
    },
    confirmpassword: {
      sameAsPassword: sameAs("senderpassword")
    },
    emailaddress: {
      required,
      emailRegex
    },
    smtpport: {
      required,
      maxLength: maxLength(65535)
    }
  };
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
    EVENT_BUS.$emit("validForm", !this.$v.$invalid);
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
      // this.$data.weeklyEmail =
      //   notificationConfiguration.notifications.email.weekly_email;
      // this.$data.testEmail =
      //   notificationConfiguration.notifications.email.send_test_mail;
    }
  }

  private setEmailNotificationSettings() {
    const queryParams: Email = {
      stmp_server: this.$data.smtpserver,
      smtp_port: this.$data.smtpport,
      smtp_protocol: this.$data.protocol,
      smtp_sender_email: this.$data.senderemail,
      smtp_sender_password: this.$data.senderpassword,
      email: this.$data.emailaddress
      //weekly_email: this.$data.weeklyEmail,
      //send_test_mail: this.$data.testEmail
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
