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
  <div>
    <div class="udx-page-title">
      <label class="cortx-text-lg cortx-text-bold">UDX Registration</label>
    </div>
    <div id="udx-reg-token-container" class="mt-4" v-if="registrationToken">
      <div class="udx-reg-token-lbl">
        <label class="cortx-text-lg cortx-float-l">Your registration token</label>
        <label class="cortx-float-l mt-1 ml-1">
          <cortx-info-tooltip
            message="On your UDX web portal choose 'Add Device' and then enter the identification token below."
          />
        </label>
      </div>
      <div id="udx-reg-token" class="mt-1">
        <label id="udx-reg-token-part-1" class="float-left">
          {{
          registrationToken.substring(0, 4)
          }}
        </label>
        <label id="udx-reg-token-part-2" class="float-left ml-2">
          {{
          registrationToken.substring(4, 8)
          }}
        </label>
        <label id="udx-reg-token-part-3" class="float-left ml-2">
          {{
          registrationToken.substring(8, 12)
          }}
        </label>
      </div>
    </div>
    <div class="mt-3">
      <v-row>
        <v-col class="py-0 pr-0">
          <div
            class="cortx-form-group"
            :class="{
              'cortx-form-group--error':
                $v.registrationForm.url.$error
            }"
          >
            <label class="cortx-form-group-label" for="url">
              <cortx-info-tooltip label="URL*" message="Enter the URL provided by your UDX portal." />
            </label>
            <input
              class="cortx-form__input_text"
              type="text"
              id="url"
              name="url"
              v-model.trim="registrationForm.url"
              @input="$v.registrationForm.url.$touch"
            />
            <div class="cortx-form-group-label cortx-form-group-error-msg">
              <label
                v-if="
                  $v.registrationForm.url.$dirty &&
                    !$v.registrationForm.url.required
                "
              >URL is required</label>
              <label
                v-else-if="
                  $v.registrationForm.url.$dirty &&
                    !$v.registrationForm.url.udxURLRegex
                "
              >Invalid URL</label>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-divider class="mb-2" />
      <v-row class="mb-2">
        <v-col class="py-0">
          <label class="cortx-text-md cortx-text-bold">S3 Account details</label>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="py-0 pr-0">
          <div
            class="cortx-form-group"
            :class="{
              'cortx-form-group--error':
                $v.registrationForm.accountName.$error
            }"
          >
            <label class="cortx-form-group-label" for="accountName">
              <cortx-info-tooltip label="Account name*" :message="accountNameTooltipMessage" />
            </label>
            <input
              class="cortx-form__input_text"
              type="text"
              id="accountName"
              name="accountName"
              v-model.trim="registrationForm.accountName"
              @input="$v.registrationForm.accountName.$touch"
            />
            <div class="cortx-form-group-label cortx-form-group-error-msg">
              <label
                v-if="
                  $v.registrationForm.accountName.$dirty &&
                    !$v.registrationForm.accountName.required
                "
              >Account name is required</label>
              <label
                v-else-if="
                  $v.registrationForm.accountName.$dirty &&
                    !$v.registrationForm.accountName.accountNameRegex
                "
              >Invalid account name</label>
            </div>
          </div>
        </v-col>
        <v-col class="py-0 pl-0">
          <div
            class="cortx-form-group"
            :class="{
              'cortx-form-group--error':
                $v.registrationForm.accountEmail.$error
            }"
          >
            <label class="cortx-form-group-label" for="accountEmail">Email id*</label>
            <input
              class="cortx-form__input_text"
              type="text"
              id="accountEmail"
              name="accountEmail"
              v-model.trim="registrationForm.accountEmail"
              @input="$v.registrationForm.accountEmail.$touch"
            />
            <div class="cortx-form-group-label cortx-form-group-error-msg">
              <label
                v-if="
                  $v.registrationForm.accountEmail.$dirty &&
                    !$v.registrationForm.accountEmail.required
                "
              >Email id is required</label>
              <label
                v-else-if="
                  $v.registrationForm.accountEmail.$dirty &&
                    !$v.registrationForm.accountEmail.email
                "
              >Invalid email id</label>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="py-0 pr-0">
          <div
            class="cortx-form-group"
            :class="{
              'cortx-form-group--error':
                $v.registrationForm.accountPassword.$error
            }"
          >
            <label class="cortx-form-group-label" for="accountPassword">
              <cortx-info-tooltip label="Password*" :message="passwordTooltipMessage" />
            </label>
            <input
              class="cortx-form__input_text"
              type="password"
              id="accountPassword"
              name="accountPassword"
              v-model.trim="registrationForm.accountPassword"
              @input="$v.registrationForm.accountPassword.$touch"
            />
            <div class="cortx-form-group-label cortx-form-group-error-msg">
              <label
                v-if="
                  $v.registrationForm.accountPassword.$dirty &&
                    !$v.registrationForm.accountPassword.required
                "
              >Password is required</label>
              <label
                v-else-if="
                  $v.registrationForm.accountPassword.$dirty &&
                    !$v.registrationForm.accountPassword.passwordRegex
                "
              >Invalid password</label>
            </div>
          </div>
        </v-col>
        <v-col class="py-0 pl-0">
          <div
            class="cortx-form-group"
            :class="{
              'cortx-form-group--error':
                $v.registrationForm.accountConfirmPassword.$error
            }"
          >
            <label class="cortx-form-group-label" for="accountConfirmPassword">Confirm password*</label>
            <input
              class="cortx-form__input_text"
              type="password"
              id="accountConfirmPassword"
              name="accountConfirmPassword"
              v-model.trim="registrationForm.accountConfirmPassword"
              @input="$v.registrationForm.accountConfirmPassword.$touch"
            />
            <span
              class="cortx-form-group-label cortx-form-group-error-msg"
              v-if="
                $v.registrationForm.accountConfirmPassword.$dirty &&
                  !$v.registrationForm.accountConfirmPassword.sameAsAccountPassword
              "
            >Passwords do not match</span>
          </div>
        </v-col>
      </v-row>
      <v-divider class="mb-2" />
      <v-row class="mb-2">
        <v-col class="py-0">
          <label class="cortx-text-md cortx-text-bold">IAM User details</label>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="py-0 pr-0">
          <div
            class="cortx-form-group"
            :class="{
              'cortx-form-group--error':
                $v.registrationForm.iamUsername.$error
            }"
          >
            <label class="cortx-form-group-label" for="iamUsername">
              <cortx-info-tooltip label="Username*" :message="accountNameTooltipMessage" />
            </label>
            <input
              class="cortx-form__input_text"
              type="text"
              id="iamUsername"
              name="iamUsername"
              v-model.trim="registrationForm.iamUsername"
              @input="$v.registrationForm.iamUsername.$touch"
            />
            <div class="cortx-form-group-label cortx-form-group-error-msg">
              <label
                v-if="
                  $v.registrationForm.iamUsername.$dirty &&
                    !$v.registrationForm.iamUsername.required
                "
              >Username is required</label>
              <label
                v-else-if="
                  $v.registrationForm.iamUsername.$dirty &&
                    !$v.registrationForm.iamUsername.accountNameRegex
                "
              >Invalid username</label>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="py-0 pr-0">
          <div
            class="cortx-form-group"
            :class="{
              'cortx-form-group--error':
                $v.registrationForm.iamUserPassword.$error
            }"
          >
            <label class="cortx-form-group-label" for="iamUserPassword">
              <cortx-info-tooltip label="Password*" :message="passwordTooltipMessage" />
            </label>
            <input
              class="cortx-form__input_text"
              type="password"
              id="iamUserPassword"
              name="iamUserPassword"
              v-model.trim="registrationForm.iamUserPassword"
              @input="$v.registrationForm.iamUserPassword.$touch"
            />
            <div class="cortx-form-group-label cortx-form-group-error-msg">
              <label
                v-if="
                  $v.registrationForm.iamUserPassword.$dirty &&
                    !$v.registrationForm.iamUserPassword.required
                "
              >Password is required</label>
              <label
                v-else-if="
                  $v.registrationForm.iamUserPassword.$dirty &&
                    !$v.registrationForm.iamUserPassword.passwordRegex
                "
              >Invalid password</label>
            </div>
          </div>
        </v-col>
        <v-col class="py-0 pl-0">
          <div
            class="cortx-form-group"
            :class="{
              'cortx-form-group--error':
                $v.registrationForm.iamUserConfirmPassword.$error
            }"
          >
            <label class="cortx-form-group-label" for="iamUserConfirmPassword">Confirm password*</label>
            <input
              class="cortx-form__input_text"
              type="password"
              id="iamUserConfirmPassword"
              name="iamUserConfirmPassword"
              v-model.trim="registrationForm.iamUserConfirmPassword"
              @input="$v.registrationForm.iamUserConfirmPassword.$touch"
            />
            <span
              class="cortx-form-group-label cortx-form-group-error-msg"
              v-if="
                $v.registrationForm.iamUserConfirmPassword.$dirty &&
                  !$v.registrationForm.iamUserConfirmPassword.sameAsIAMUserPassword
              "
            >Passwords do not match</span>
          </div>
        </v-col>
      </v-row>
      <v-divider class="mb-2" />
      <v-row class="mb-2">
        <v-col class="py-0">
          <label class="cortx-text-md cortx-text-bold">S3 Bucket details</label>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="py-0 pr-0">
          <div
            class="cortx-form-group"
            :class="{
              'cortx-form-group--error':
                $v.registrationForm.bucketName.$error
            }"
          >
            <label class="cortx-form-group-label" for="bucketName">
              <cortx-info-tooltip label="Bucket name*" :message="bucketNameTooltipMessage" />
            </label>
            <div class="cortx-bucket-input-prefix">
              <label>udx-</label>
            </div>
            <input
              class="cortx-form__input_text cortx-bucket-input"
              type="text"
              id="bucketName"
              name="bucketName"
              v-model.trim="registrationForm.bucketName"
              @input="$v.registrationForm.bucketName.$touch"
            />
            <div class="cortx-form-group-label cortx-form-group-error-msg">
              <label
                v-if="
                  $v.registrationForm.bucketName.$dirty &&
                    !$v.registrationForm.bucketName.required
                "
              >Bucket name is required</label>
              <label
                v-else-if="
                  $v.registrationForm.bucketName.$dirty &&
                    !$v.registrationForm.bucketName.udxBucketNameRegex
                "
              >Invalid bucket name</label>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-divider class="mb-5" />
      <v-row>
        <v-col class="py-0">
          <label class="cortx-text-md">I agree to the following:</label>
          <br />
          <label class="cortx-ckb-container" for="consentOne">
           A dedicated UDX Bucket will be created in my account.
            <input
              type="checkbox"
              name="consentOne"
              v-model="registrationForm.consentOne"
              id="consentOne"
            />
            <span class="cortx-ckb-tick"></span>
          </label>
          <br />
          <label class="cortx-ckb-container" for="consentTwo">
            An UDX IAM User will be created having complete access only to the UDX bucket, and not to other data.
            <input
              type="checkbox"
              name="consentTwo"
              v-model="registrationForm.consentTwo"
              id="consentTwo"
            />
            <span class="cortx-ckb-tick"></span>
          </label>
        </v-col>
      </v-row>
      <v-row class="mt-2">
        <v-col>
          <button
            type="button"
            class="cortx-btn-primary"
            @click="registerUDX()"
            :disabled="$v.registrationForm.$invalid || !registrationForm.consentOne || !registrationForm.consentTwo"
          >Register</button>
          <button
            type="button"
            class="ml-8 cortx-btn-secondary"
            @click="clearRegistrationForm()"
          >Clear</button>
        </v-col>
      </v-row>
    </div>
    <div class="cortx-modal-container" v-if="registrationResponse">
      <div class="cortx-modal" style="width: 600px;">
        <div class="cortx-modal-header">
          <label>Details</label>
          <img
            class="cortx-modal-close"
            :src="require('@/assets/close-green.svg')"
            @click="closeRegResponseDetailsDialog()"
          />
        </div>
        <div class="cortx-reg-response-container">
          <table class="cortx-text-md">
            <tr>
              <td class="py-1 cortx-text-bold udx-reg-resp-table-label">S3 Account Access Key</td>
              <td class="py-1">{{ registrationResponse.s3_account.access_key }}</td>
            </tr>
            <tr>
              <td class="py-1 cortx-text-bold udx-reg-resp-table-label">S3 Account Secret Key</td>
              <td class="py-1">{{ registrationResponse.s3_account.secret_key }}</td>
            </tr>
            <tr>
              <td class="py-1 cortx-text-bold udx-reg-resp-table-label">IAM User Access Key</td>
              <td class="py-1">{{ registrationResponse.iam_user.access_key }}</td>
            </tr>
            <tr>
              <td class="py-1 cortx-text-bold udx-reg-resp-table-label">IAM User Secret Key</td>
              <td class="py-1">{{ registrationResponse.iam_user.secret_key }}</td>
            </tr>
          </table>
        </div>
        <div class="cortx-modal-footer">
          <button
            type="button"
            class="cortx-btn-primary cortx-float-r"
            @click="closeRegResponseDetailsDialog()"
          >Ok</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Validations } from "vuelidate-property-decorators";
import { required, helpers, sameAs, email } from "vuelidate/lib/validators";
import {
  udxURLRegex,
  accountNameRegex,
  udxBucketNameRegex,
  passwordRegex,
  accountNameTooltipMessage,
  passwordTooltipMessage,
  udxBucketNameTooltipMessage
} from "../../common/regex-helpers";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";

@Component({
  name: "cortx-udx-registration"
})
export default class CortxUDXRegistration extends Vue {
  public registrationToken: string = "";
  public registrationResponse: any = null;
  public passwordTooltipMessage: string = passwordTooltipMessage;
  public accountNameTooltipMessage: string = accountNameTooltipMessage;
  public bucketNameTooltipMessage: string = udxBucketNameTooltipMessage;

  public registrationForm = {
    url: "",
    accountName: "",
    accountEmail: "",
    accountPassword: "",
    accountConfirmPassword: "",
    iamUsername: "",
    iamUserPassword: "",
    iamUserConfirmPassword: "",
    bucketName: "",
    consentOne: false,
    consentTwo: false
  };

  @Validations()
  public validations = {
    registrationForm: {
      url: { required, udxURLRegex },
      accountName: { required, accountNameRegex },
      accountEmail: { required, email },
      accountPassword: { required, passwordRegex },
      accountConfirmPassword: {
        sameAsAccountPassword: sameAs("accountPassword")
      },
      iamUsername: { required, accountNameRegex },
      iamUserPassword: { required, passwordRegex },
      iamUserConfirmPassword: {
        sameAsIAMUserPassword: sameAs("iamUserPassword")
      },
      bucketName: { required, udxBucketNameRegex }
    }
  };

  public async mounted() {
    await this.getRegistrationToken();
  }

  public async registerUDX() {
    this.$store.dispatch("systemConfig/showLoader", "Registering UDX...");
    const res = await Api.post(
      apiRegister.udx_registration,
      {
        url: this.registrationForm.url,
        pin: "0000",
        s3_account_name: this.registrationForm.accountName,
        s3_account_email: this.registrationForm.accountEmail,
        s3_account_password: this.registrationForm.accountPassword,
        iam_user_name: this.registrationForm.iamUsername,
        iam_user_password: this.registrationForm.iamUserPassword,
        bucket_name: "udx-" + this.registrationForm.bucketName
      },
      { timeout: 120000 }
    );
    if (res && res.data) {
      this.registrationResponse = res.data;
    }
    this.$store.dispatch("systemConfig/hideLoader");
  }

  public closeRegResponseDetailsDialog() {
    this.registrationResponse = null;
    this.$emit("complete");
  }

  public clearRegistrationForm() {
    this.registrationForm.url = "";
    this.registrationForm.accountName = "";
    this.registrationForm.accountEmail = "";
    this.registrationForm.accountPassword = "";
    this.registrationForm.accountConfirmPassword = "";
    this.registrationForm.iamUsername = "";
    this.registrationForm.iamUserPassword = "";
    this.registrationForm.iamUserConfirmPassword = "";
    this.registrationForm.bucketName = "";
    this.registrationForm.consentOne = false;
    this.registrationForm.consentTwo = false;
    if (this.$v.registrationForm) {
      this.$v.registrationForm.$reset();
    }
  }

  private async getRegistrationToken() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      "Fetching registration token..."
    );
    const res = await Api.getAll(apiRegister.udx_registration_token);
    if (res && res.data) {
      this.registrationToken = res.data.registrationToken;
    }
    this.$store.dispatch("systemConfig/hideLoader");
  }
}
</script>
<style lang="scss" scoped>
.udx-page-title {
  height: 46px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.udx-reg-token-lbl {
  height: 30px;
}
#udx-reg-token {
  height: 30px;
  font-size: 1.5rem;
  font-weight: bold;
}
.cortx-reg-response-container {
  height: 12.5em;
  border-bottom: 1px solid #b7b7b7;
  overflow: auto;
  padding: 16px;
}
.udx-reg-resp-table-label {
  width: 13rem;
}
.cortx-modal-footer {
  height: 3.5em;
  padding: 0.5em;
}
.cortx-bucket-input-prefix {
  height: 40px;
  padding-top: 8px;
  float: left;
}
.cortx-bucket-input {
  width: 290px;
  float: left;
}
</style>