/*
* CORTX-CSM: CORTX Management web and CLI interface.
* Copyright (c) 2020 Seagate Technology LLC and/or its Affiliates
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU Affero General Public License for more details.
* You should have received a copy of the GNU Affero General Public License
* along with this program. If not, see <https://www.gnu.org/licenses/>.
* For any questions about this software or licensing,
* please email opensource@seagate.com or cortx-questions@seagate.com.
*/
<template>
  <v-container class="mt-0 ml-0" v-feature="unsupportedFeatures.notification">
    <div class="pl-4 body-2">
      <div class="row mt-5">
        <div class="col-2 body-2 column">
          <div class="mt-2 font-weight-bold">
            <div class="cortx-form-group">
              <label id="lblEmailSMTP">{{ $t("onBoarding.SMTPServer") }}*: </label>
            </div>
            <div class="cortx-form-group">
              <label id="lblEmailSenderEmail">{{ $t("onBoarding.senderEmail") }}*:</label>
            </div>
            <div class="cortx-form-group">
              <label id="lblEmailProtocol">{{ $t("onBoarding.protocol") }}*:</label>
            </div>
            <div class="cortx-form-group">
              <label id="lblEmailSMTPPort">{{ $t("onBoarding.SMTPPort") }}*:</label>
            </div>
            <div class="cortx-form-group">
              <label id="lblEmailSenderPass">{{ $t("onBoarding.senderPassword") }}*:</label>
            </div>
            <div class="cortx-form-group">
              <label id="lblEmailSenderConfirmPass">{{ $t("onBoarding.confirmPassword") }}*:</label>
            </div>
            <div class="cortx-form-group">
              <label id="lblEmailReceiverEmail">{{ $t("onBoarding.receiverEmails") }}*:</label>
            </div>
          </div>
        </div>
        <div class="col-4 body-2 column mr-5">
          <div
            class="cortx-form-group"
            :class="{
              'cortx-form-group--error': $v.smtpserver.$error
            }"
          >
            <input
              class="cortx-form__input_text"
              type="text"
              id="txtEmailSmtpServer"
              name="smtpserver"
              v-model.trim="smtpserver"
              @input="$v.smtpserver.$touch"
              placeholder="smtp.email.com"
            />
            <div class="cortx-form-group-label cortx-form-group-error-msg">
              <label v-if="$v.smtpserver.$dirty && !$v.smtpserver.required"
                >{{ $t("onBoarding.SMTPServerReq") }}</label
              >
            </div>
          </div>

          <div
            class="cortx-form-group"
            :class="{
              'cortx-form-group--error': $v.senderemail.$error
            }"
          >
            <input
              class="cortx-form__input_text"
              type="text"
              id="txtEmailsenderemail"
              name="senderEmail"
              v-model.trim="senderemail"
              @input="$v.senderemail.$touch"
              placeholder="example@email.com"
            />
            <div class="cortx-form-group-label cortx-form-group-error-msg">
              <label v-if="$v.senderemail.$dirty && !$v.senderemail.required" id="notification-email-required"
                >{{ $t("onBoarding.senderEmailReq") }}</label
              >
              <label v-if="$v.senderemail.$dirty && !$v.senderemail.email" id="notification-email-invalid"
                >{{ $t("onBoarding.invalidEmail") }}</label
              >
            </div>
          </div>
          <div
            class="cortx-form-group"
            :class="{
              'cortx-form-group--error': $v.protocol.$error
            }"
          >
            <cortx-dropdown
              id="notification-protocol-dropdownbox"
              @update:selectedOption="handleDropdownSelect"
              :options="protocolList"
              :title="protocol ? protocol : undefined"
            ></cortx-dropdown>
            <div class="cortx-form-group-label cortx-form-group-error-msg">
              <label v-if="$v.protocol.$dirty && !$v.protocol.required" id="notification-protocol-required"
                >{{ $t("onBoarding.protocolIsReq") }}</label
              >
            </div>
          </div>
          <div
            class="cortx-form-group"
            :class="{
              'cortx-form-group--error': $v.smtpport.$error
            }"
          >
            <input
              class="cortx-form__input_text"
              type="number"
              id="txtEmailSmtpPort"
              name="smtpPort"
              v-model.trim="smtpport"
              @input="$v.smtpport.$touch"
            />
            <div class="cortx-form-group-label cortx-form-group-error-msg">
              <label v-if="$v.smtpport.$dirty && !$v.smtpport.required" id="notification-smtpport-required"
                >{{ $t("onBoarding.SMTPPortRequired") }}</label
              >
              <label v-if="$v.smtpport.$dirty && !$v.smtpport.maxValue" id="notification-smtpport-invalid"
                >{{ $t("onBoarding.SMTPPortNotValid") }}</label
              >
            </div>
          </div>
          <div
            class="cortx-form-group"
            :class="{
              'cortx-form-group--error': $v.senderpassword.$error
            }"
          >
            <input
              class="cortx-form__input_text"
              type="password"
              id="txtEmailSenderPass"
              name="senderPassword"
              v-model.trim="senderpassword"
              @input="$v.senderpassword.$touch"
            />
            <div class="cortx-form-group-label cortx-form-group-error-msg">
              <label
                v-if="$v.senderpassword.$dirty && !$v.senderpassword.required" id="notification-senderpassword-required"
                >{{ $t("onBoarding.senderPasswordRequired") }}</label
              >
              <label
               id="notification-senderpassword"
                v-if="$v.senderpassword.$dirty && !$v.senderpassword.minLength"
                >{{ $t("onBoarding.min4CharRequired") }}</label
              >
            </div>
          </div>
          <div
            class="cortx-form-group"
            :class="{
              'cortx-form-group--error': $v.confirmpassword.$error
            }"
          >
            <input
              class="cortx-form__input_text"
              type="password"
              id="txtEmailConfirmPass"
              name="ConfirmPassword"
              v-model.trim="confirmpassword"
              @input="$v.confirmpassword.$touch"
            />
            <div class="cortx-form-group-label cortx-form-group-error-msg">
              <label id="notification-confirmpassword-required"
                v-if="
                  $v.confirmpassword.$dirty &&
                    !$v.confirmpassword.sameAsPassword
                "
                >{{ $t("onBoarding.confirmPasswordDoNotMatch") }}</label
              >
            </div>
          </div>
          <div
            class="cortx-form-group"
            :class="{
              'cortx-form-group--error': $v.emailaddress.$error
            }"
          >
            <textarea
              class="cortx-form__input_textarea"
              id="txtEmailReceiverEmail"
              name="receiverEmail"
              v-model.trim="emailaddress"
              @input="$v.emailaddress.$touch"
              placeholder="Use a comma (,) to separate multiple Receiver email values. Example, example@email.com, example2@email.com"
            ></textarea>
            <div class="cortx-form-group-label cortx-form-group-error-msg">
              <label v-if="$v.emailaddress.$dirty && !$v.emailaddress.required"
                >{{ $t("onBoarding.emailRequired") }}</label
              >
              <label
                v-if="
                  $v.emailaddress.$dirty &&
                    !$v.emailaddress.commaSeparatedEmailsRegex
                "
                >{{ $t("onBoarding.emailCommaSeparated") }}</label
              >
            </div>
          </div>
        </div>
      </div>
      <button
        id="notification-sendtestemailbtn"
        type="button"
        class="cortx-btn-primary mt-5"
        @click="sendTestEmail()"
        :disabled="$v.$invalid || testEmailInProgress"
      >
        {{ $t("onBoarding.sendTestEmail") }}
      </button>
      <span
        id="notification-emailmsg"
        v-if="testEmailMessage"
        class="ml-2"
        :class="[
          testEmailMessageError ? 'red--text error-message' : 'csmprimary--text'
        ]"
      >
        {{ testEmailMessage }}
      </span>
    </div>

    <span class="d-none" id="notification-notificationdata">{{ isValidForm }}{{ notificationGetter }}</span>
    <button
      id="notification-applybtn"
      type="button"
      v-if="$route.path !== '/onboarding'"
      :disabled="$v.$invalid"
      @click="applySettings()"
      class="cortx-btn-primary cortx-float-l my-10"
    >
      {{ $t("common.apply") }}
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
  minValue,
  maxValue
} from "vuelidate/lib/validators";
import { commaSeparatedEmailsRegex } from "./../../../../common/regex-helpers";
import i18n from "../../onboarding.json";
import { unsupportedFeatures } from "../../../../common/unsupported-feature";

@Component({
  name: "cortx-notification",
  i18n: {
    messages: i18n
  }
})
export default class CortxNotifications extends Vue {
  public unsupportedFeatures = unsupportedFeatures;
  @Validations()
  private validations = {
    smtpserver: {
      required
    },
    senderemail: {
      required,
      email
    },
    protocol: {
      required
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
      minValue: minValue(0),
      maxValue: maxValue(65535)
    }
  };

  private data() {
    return {
      smtpserver: "",
      senderemail: "",
      smtpport: 465,
      protocol: "SSL",
      protocolList: [
        {
          label: "None",
          value: "None"
        },
        {
          label: "SSL",
          value: "SSL"
        },
        {
          label: "TLS",
          value: "TLS"
        },
        {
          label: "STARTTLS",
          value: "STARTTLS"
        }
      ],
      senderpassword: "",
      confirmpassword: "",
      emailaddress: "",
      weeklyEmail: false,
      testEmail: false,
      testEmailInProgress: false,
      testEmailMessage: "",
      testEmailMessageError: false
    };
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
    // WizardHook: Emit event to sibling wizard footer component
    // to send information about data validation to enable/disable wizard footer
    EVENT_BUS.$emit("validForm", !this.$v.$invalid);
    return true;
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
      this.$data.senderpassword =
        notificationConfiguration.notifications.email.smtp_sender_password;
      this.$data.confirmpassword =
        notificationConfiguration.notifications.email.smtp_sender_password;
    }
    return true;
  }

  private setReceiverEmailAddresses(e: any) {
    return e.replace(/\s+/g, "");
  }

  private getNotificationQueryParams() {
    const queryParams: Email = {
      smtp_server: this.$data.smtpserver,
      smtp_port: this.$data.smtpport,
      smtp_protocol: this.$data.protocol,
      smtp_sender_email: this.$data.senderemail,
      smtp_sender_password: this.$data.senderpassword,
      email: this.setReceiverEmailAddresses(this.$data.emailaddress)
    };
    return queryParams;
  }
  private setEmailNotificationSettings() {
    const queryParams = this.getNotificationQueryParams();
    return this.$store.dispatch(
      "systemConfig/updateEmailNotificationUserConfig",
      queryParams
    );
  }
  private sendTestEmail() {
    this.$data.testEmailMessage = "";
    this.$data.testEmailMessageError = false;
    this.$data.testEmailInProgress = true;

    const queryParams = this.getNotificationQueryParams();

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
  private applySettings() {
    const queryParams = this.getNotificationQueryParams();
    this.$emit("apply-settings", queryParams);
  }
  private handleDropdownSelect(selected: any) {
    this.$data.protocol = selected.value;
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
