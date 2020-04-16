<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="row mt-5">
        <div class="col-4 column node-container py-0">
          <div
            class="eos-form-group"
            :class="{
              'eos-form-group--error': $v.smtpserver.$error
            }"
          >
            <label class="eos-form-group-label" for="accountName"
              >SMTP server*</label
            >
            <input
              class="eos-form__input_text"
              type="text"
              id="txtEmailSmtp"
              name="smtpserver"
              v-model.trim="smtpserver"
              @input="$v.smtpserver.$touch"
            />
            <div class="eos-form-group-label eos-form-group-error-msg">
              <label v-if="$v.smtpserver.$dirty && !$v.smtpserver.required"
                >SMTP server is required.</label
              >
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
            <label class="eos-form-group-label" for="accountName"
              >Sender email*</label
            >
            <input
              class="eos-form__input_text"
              type="text"
              id="txtEmailsenderemail"
              name="smtpsesenderemailrver"
              v-model.trim="senderemail"
              @input="$v.senderemail.$touch"
            />
            <div class="eos-form-group-label eos-form-group-error-msg">
              <label v-if="$v.senderemail.$dirty && !$v.senderemail.required"
                >Sender email is required.</label
              >
              <label v-if="$v.senderemail.$dirty && !$v.senderemail.email"
                >Invalid email.</label
              >
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-4 column node-container py-0">
          <div class="eos-form-group">
            <label
              class="eos-form-group-label"
              for="hostname"
              id="lblDTNetworkServeradd"
              >Protocol*</label
            >
            <eos-dropdown
              @update:selectedOption="handleDropdownSelect"
              :options="protocolList"
              :title="protocolLabel ? protocolLabel : undefined"
            ></eos-dropdown>
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
              >SMTP port*</label
            >
            <input
              class="eos-form__input_text"
              type="number"
              id="txtEmailIpAddress"
              name="smtp_port"
              v-model.trim="smtpport"
              @input="$v.smtpport.$touch"
            />
            <div class="eos-form-group-label eos-form-group-error-msg">
              <label v-if="$v.smtpport.$dirty && !$v.smtpport.required"
                >SMTP port is required.</label
              >
              <label v-if="$v.smtpport.$dirty && !$v.smtpport.maxLength"
                >SMTP port is not valid.</label
              >
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
              >Sender password*</label
            >
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
                >Sender password is required.</label
              >
              <label
                v-if="$v.senderpassword.$dirty && !$v.senderpassword.minLength"
                >Minimum 4 characters are required.</label
              >
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
              >Confirm password*</label
            >
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
                v-if="
                  $v.confirmpassword.$dirty &&
                    !$v.confirmpassword.sameAsPassword
                "
                >Confirm password do not match.</label
              >
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
              >Receiver email addresses*</label
            >
            <textarea
              @change="setReceiverEmailAddresses"
              class="eos-form__input_textarea"
              id="txtEmailsenderemail"
              name="senderpassword"
              v-model.trim="emailaddress"
              @input="$v.emailaddress.$touch"
              placeholder="Enter comma ',' seperated values"
            ></textarea>
            <div class="eos-form-group-label eos-form-group-error-msg">
              <label v-if="$v.emailaddress.$dirty && !$v.emailaddress.required"
                >Email is required.</label
              >
              <label
                v-if="
                  $v.emailaddress.$dirty &&
                    !$v.emailaddress.commaSeparatedEmailsRegex
                "
                >Enter valid comma (,) separated emails.</label
              >
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        class="eos-btn-primary mt-5"
        @click="sendTestEmail()"
        :disabled="$v.$invalid || testEmailInProgress"
      >
        Send test email
      </button>
      <span
        v-if="testEmailMessage"
        class="ml-2"
        :class="[
          testEmailMessageError ? 'red--text error-message' : 'csmprimary--text'
        ]"
      >
        {{ testEmailMessage }}
      </span>
    </div>

    <p v-if="!isValid" class="red--text error-message">
      Please enter valid values.
    </p>
    <span class="d-none">{{ isValidForm }}{{ notificationGetter }}</span>
    <button
      type="button"
      v-if="$route.path !== '/onboarding'"
      :disabled="$v.$invalid"
      @click="applySettings()"
      class="eos-btn-primary eos-float-l my-10"
    >
      Apply
    </button>
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
  url,
  requiredIf,
  email,
  minLength,
  maxLength
} from "vuelidate/lib/validators";
import { commaSeparatedEmailsRegex } from "./../../../../common/regex-helpers";

@Component({
  name: "eos-notification"
})
export default class EosNotifications extends Vue {
  @Validations()
  private validations = {
    smtpserver: {
      required
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
      commaSeparatedEmailsRegex
    },
    smtpport: {
      required,
      maxLength: maxLength(65535)
    }
  };

  private data() {
    return {
      smtpserver: "",
      senderemail: "",
      smtpport: 465,
      protocol: "ssl",
      protocolLabel: "SSL",
      protocolList: [
        {
          label: "SSL",
          value: "ssl"
        },
        {
          label: "TLS",
          value: "tls"
        },
        {
          label: "STARTTLS",
          value: "starttls"
        }
      ],
      senderpassword: "",
      confirmpassword: "",
      emailaddress: "",
      weeklyEmail: false,
      testEmail: false,
      testEmailInProgress: false,
      testEmailMessage: "",
      testEmailMessageError: false,
      isValid: true
    };
  }

  private setReceiverEmailAddresses(e: any) {
    this.$data.emailaddress = e.target.value.replace(/\s+/g, "");
  }
  private mounted() {
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
  get notificationGetter(): any {
    const notificationConfiguration = this.$store.getters[
      "systemConfig/userConfigData"
    ];
    if (
      notificationConfiguration &&
      notificationConfiguration.notifications &&
      notificationConfiguration.notifications.email
    ) {
      this.$data.smtpserver =
        notificationConfiguration.notifications.email.smtp_server;
      this.$data.senderemail =
        notificationConfiguration.notifications.email.smtp_sender_email;
      this.$data.smtpport =
        notificationConfiguration.notifications.email.smtp_port;
      this.$data.protocol =
        notificationConfiguration.notifications.email.smtp_protocol;
      this.$data.emailaddress =
        notificationConfiguration.notifications.email.email;
    }
    return true;
  }

  private setEmailNotificationSettings() {
    const queryParams: Email = {
      smtp_server: this.$data.smtpserver,
      smtp_port: this.$data.smtpport,
      smtp_protocol: this.$data.protocol,
      smtp_sender_email: this.$data.senderemail,
      smtp_sender_password: this.$data.senderpassword,
      email: this.$data.emailaddress
    };
    return this.$store.dispatch(
      "systemConfig/updateEmailNotificationUserConfig",
      queryParams
    );
  }
  private sendTestEmail() {
    this.$data.testEmailMessage = "";
    this.$data.testEmailMessageError = false;
    this.$data.testEmailInProgress = true;

    const queryParams: Email = {
      smtp_server: this.$data.smtpserver,
      smtp_port: this.$data.smtpport,
      smtp_protocol: this.$data.protocol,
      smtp_sender_email: this.$data.senderemail,
      smtp_sender_password: this.$data.senderpassword,
      email: this.$data.emailaddress
    };
    this.$store
      .dispatch("systemConfig/sendTestEmailNotification", queryParams)
      .then((res: any) => {
        if (res) {
          if (res.status) {
            this.$data.testEmailInProgress = false;

            this.$data.testEmailMessage = "Success";
          } else {
            let failedRecipientsList = "";
            if (res.failed_recipients) {
              failedRecipientsList = `Failed Recipients: ${res.failed_recipients.join(
                ", "
              )}`;
            }
            throw new Error(`${res.error} ${failedRecipientsList}`);
          }
        } else {
          throw new Error("Test email check failed");
        }
      })
      .catch((error: any) => {
        this.$data.testEmailMessage = error.message;
        this.$data.testEmailMessageError = true;
        this.$data.testEmailInProgress = false;
      });
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
  private applySettings() {
    const queryParams: Email = {
      smtp_server: this.$data.smtpserver,
      smtp_port: this.$data.smtpport,
      smtp_protocol: this.$data.protocol,
      smtp_sender_email: this.$data.senderemail,
      smtp_sender_password: this.$data.senderpassword,
      email: this.$data.emailaddress
    };
    this.$emit("apply-settings", queryParams);
  }
  private handleDropdownSelect(selected: any) {
    this.$data.protocol = selected.value;
    this.$data.protocolLabel = selected.label;
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
