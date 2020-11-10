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
      <label class="cortx-text-lg cortx-text-bold" id="udx-title">{{
        $t("udx-registration.udx-registration")
      }}</label>
    </div>
    <v-stepper v-model="stepNumber">
      <v-stepper-header>
        <v-stepper-step :complete="stepNumber > 1" step="1">
          Login/Create Account
          <small>Login using existing account or create a new Account</small>
        </v-stepper-step>
        <v-divider></v-divider>

        <v-stepper-step :complete="stepNumber > 2" step="2">
          Select/Create Bucket
        </v-stepper-step>
        <v-divider></v-divider>

        <v-stepper-step :complete="stepNumber > 3" step="3">
          Create IAM Account
        </v-stepper-step>
        <v-divider></v-divider>

        <v-stepper-step :complete="stepNumber > 4" step="4">
          Registration
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <div v-if="stepNumber === 1" style="min-height: 260px">
            <cortx-S3-account
              v-if="isCreateAccount"
              ref="s3Account"
              :s3UrlInfo="s3UrlInfo"
              @createAccount="toggleCreateAccount"
              @setAuthToken="createdS3Account"
            >
            </cortx-S3-account>
            <LoginExistingS3Account
              v-else
              @createAccount="toggleCreateAccount"
              @setS3URL="setS3URL"
              @setAuthToken="setAuthToken"
            />
          </div>
        </v-stepper-content>

        <v-stepper-content step="2">
          <cortx-select-create-bucket
            style="min-height: 260px"
            v-if="stepNumber === 2"
            :authToken="authToken"
            @onChange="updateStep"
          >
          </cortx-select-create-bucket>
        </v-stepper-content>

        <v-stepper-content step="3">
          <cortx-iam-user
            :authToken="authToken"
            :bucketName="registrationForm.bucketName"
            @onChange="updateStep4"
          ></cortx-iam-user>
        </v-stepper-content>

        <v-stepper-content step="4">
          <v-row>
            <v-col class="py-0 pr-0">
              <div id="udx-reg-token-container">
                <div class="udx-reg-token-lbl">
                  <label
                    class="cortx-text-lg cortx-float-l"
                    id="udx-tocken-title"
                    >{{ $t("udx-registration.registration-token") }}</label
                  >
                  <label class="cortx-float-l mt-1 ml-1">
                    <cortx-info-tooltip
                      message="On your Lyve Pilot web portal choose 'Add Device' and then enter the identification token below."
                    />
                  </label>
                </div>
                <div id="udx-reg-token" class="mt-1">
                  <label id="udx-reg-token-part-1" class="float-left">{{
                    registrationToken.substring(0, 4)
                  }}</label>
                  <label id="udx-reg-token-part-2" class="float-left ml-2">{{
                    registrationToken.substring(4, 8)
                  }}</label>
                  <label id="udx-reg-token-part-3" class="float-left ml-2">{{
                    registrationToken.substring(8, 12)
                  }}</label>
                </div>
              </div>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="py-0 pr-0">
              <h4>S3 Account: {{ registrationForm.accountName }}</h4>
              <h4>IAM User: {{ registrationForm.iamUsername }}</h4>
              <h4>bucket Name: {{ `ldp-${registrationForm.bucketName}` }}</h4>
              <br />
            </v-col>
          </v-row>

          <v-row>
            <v-col class="py-0 pr-0">
              <div
                class="cortx-form-group"
                :class="{
                  'cortx-form-group--error': $v.registrationForm.url.$error
                }"
              >
                <label
                  class="cortx-form-group-label"
                  for="url"
                  id="udx-url-label"
                >
                  <cortx-info-tooltip
                    label="URL*"
                    message="Enter the URL provided by your UDX portal."
                  />
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
                    id="udx-url-required"
                    v-if="
                      $v.registrationForm.url.$dirty &&
                        !$v.registrationForm.url.required
                    "
                    >{{ $t("udx-registration.udx-url-required") }}</label
                  >
                  <label
                    id="udx-url-invalid"
                    v-else-if="
                      $v.registrationForm.url.$dirty &&
                        !$v.registrationForm.url.udxURLRegex
                    "
                    >{{ $t("udx-registration.invalid-url") }}</label
                  >
                </div>
              </div>
            </v-col>
            <v-col class="py-0 pr-0">
              <div class="cortx-form-group">
                <label
                  class="cortx-form-group-label"
                  for="pin"
                  id="udx-pin-label"
                >
                  <cortx-info-tooltip
                    label="PIN*"
                    message="Enter the PIN provided by your UDX portal."
                  />
                </label>
                <input class="cortx-form__input_text" type="text" />
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-0">
              <label class="cortx-text-md" id="udx-agreelbl"
                >{{ $t("udx-registration.iagreetext") }}:</label
              >
              <br />
              <label
                class="cortx-ckb-container"
                for="consentOne"
                id="udx-firstcheck"
              >
                {{ $t("udx-registration.firstcheck-text") }}
                <input
                  type="checkbox"
                  name="consentOne"
                  v-model="registrationForm.consentOne"
                  id="consentOne"
                />
                <span class="cortx-ckb-tick"></span>
              </label>
              <br />
              <label
                class="cortx-ckb-container"
                for="consentTwo"
                id="udx-secondcheck"
              >
                {{ $t("udx-registration.secondcheck-text") }}
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
          <br />

          <button
            id="udx-registrationbtn"
            type="button"
            class="cortx-btn-primary"
            @click="registerUDX()"
            :disabled="
              $v.registrationForm.$invalid ||
                !registrationForm.consentOne ||
                !registrationForm.consentTwo
            "
          >
            {{ $t("udx-registration.register-btn") }}
          </button>
          <button
            createBucket="false"
            id="udx-clearbtn"
            type="button"
            class="ml-8 cortx-btn-secondary"
            @click="clearRegistrationForm()"
          >
            {{ $t("udx-registration.clear") }}
          </button>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Validations } from "vuelidate-property-decorators";
import { required, helpers, sameAs, email } from "vuelidate/lib/validators";
import CortxDownloadCsvDialog from "./../s3/download-csv-dialog.vue";
import CortxSelectCreateBucket from "./cortx-select-create-bucket.vue";
import CortxS3Account from "./cortx-udx-s3-creation.vue";
import i18n from "./../../i18n";
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
import LoginExistingS3Account from "./login-existing-s3account.vue";
import CortxIamUser from "./cortx-iam-user.vue";

@Component({
  name: "cortx-udx-registration",
  components: {
    CortxDownloadCsvDialog,
    CortxSelectCreateBucket,
    CortxS3Account,
    LoginExistingS3Account,
    CortxIamUser
  }
})
export default class CortxUDXRegistration extends Vue {
  public stepNumber: number = 1;
  public s3UrlInfo: any;
  public authToken: string = "";
  public isCreateAccount: boolean = false;
  public registrationToken: string = "49BUI8FNSWGZ";
  public registrationResponse: any = null;

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
  private accessKeyDetails: any = {};
  private showAccessKeyDetailsDialog: boolean;
  private secretKey:string = "";
  private accessKey: string = "";

  @Validations()
  public validations = {
    registrationForm: {
      url: { required, udxURLRegex }
    }
  };

  public setS3URL(s3UrlInfo: any) {
    this.s3UrlInfo = s3UrlInfo;
  }

  public async mounted() {
    await this.getRegistrationToken();
  }

  public async getRegistrationToken() {
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

  public createdS3Account(
    authToken: string,
    accountName: any,
    password: string,
    email: string
  ) {
    this.authToken = authToken;
    this.registrationForm.accountName = accountName;
    this.registrationForm.accountEmail = email;
    this.registrationForm.accountPassword = password;
    this.stepNumber = 2;
  }

  public setAuthToken(authToken: string, accountName: any, password: string) {
    this.authToken = authToken;
    this.registrationForm.accountName = accountName.label;
    this.registrationForm.accountEmail = accountName.email;
    this.registrationForm.accountPassword = password;
    this.stepNumber = 2;
  }

  public updateStep(selectedBucket: any) {
    this.stepNumber = this.stepNumber + 1;
    this.registrationForm.bucketName = selectedBucket;
  }

  public updateStep4(secretKey: string, accessKey: string, username: string) {
    this.stepNumber = this.stepNumber + 1;
    this.registrationForm.iamUsername = username;
    this.secretKey = secretKey;
    this.accessKey = accessKey;
  }

  public async registerUDX() {
    const config: any = {
      headers: {
        auth_token: this.authToken
      }
    };
    this.$store.dispatch("systemConfig/showLoader", "Registering UDX...");
    const payload = {
      registerDeviceParams: {
        url: this.registrationForm.url,
        regPin: "0000",
        regToken: this.registrationToken
      },
      accessParams: {
        accountName: this.registrationForm.accountName,
        uri: "s3://192.168.27.254:80",
        credentials: {
          accessKey: this.accessKey,
          secretKey: this.secretKey
        }
      },
      internalCortxParams: {
        bucketName: this.registrationForm.bucketName
      }
    };

    const res = await Api.post(
      apiRegister.udx_registration,
      payload,
      { timeout: 120000 }
    );
    this.$emit("complete");
    this.$store.dispatch("systemConfig/hideLoader");
  }

  public toggleCreateAccount(isCreateAccount: boolean) {
    this.isCreateAccount = isCreateAccount;
  }

  public clearRegistrationForm() {
    this.registrationForm.url = "";
    this.registrationForm.accountEmail = "";
    this.registrationForm.accountPassword = "";
    this.registrationForm.accountConfirmPassword = "";
    this.registrationForm.iamUserPassword = "";
    this.registrationForm.iamUserConfirmPassword = "";
    this.registrationForm.consentOne = false;
    this.registrationForm.consentTwo = false;
    if (this.$v.registrationForm) {
      this.$v.registrationForm.$reset();
    }
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
</style>
