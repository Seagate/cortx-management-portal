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
          {{ $t("udx-registration.loginCreateAccount") }}
          <small>{{ $t("udx-registration.loginCreateAccountMsg") }}</small>
        </v-stepper-step>
        <v-divider></v-divider>

        <v-stepper-step :complete="stepNumber > 2" step="2">
          {{ $t("udx-registration.selectCreateBucket") }}
          <small>{{ $t("udx-registration.selectCreateBucketMsg") }}</small>
        </v-stepper-step>
        <v-divider></v-divider>

        <v-stepper-step :complete="stepNumber > 3" step="3">
          {{ $t("udx-registration.createIAMAccount") }}
          <small>{{ $t("udx-registration.createIAMAccountMsg") }}</small>
        </v-stepper-step>
        <v-divider></v-divider>

        <v-stepper-step :complete="stepNumber > 4" step="4">
          {{ $t("udx-registration.udx-registration") }}
          <small>{{ $t("udx-registration.udx-registrationMsg") }}</small>
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <div v-if="stepNumber === 1">
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
            v-if="stepNumber === 2"
            :authToken="authToken"
            :bucketName="registrationForm.bucketName"
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
                    >{{ $t("udx-registration.registration-token") }}</label>
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
            <v-col class="p-0" md="4">
              <v-expansion-panels class="mt-2 mb-5">
                <v-expansion-panel>
                  <v-expansion-panel-header class="cortx-text-lg font-weight-bold">
                    {{ $t("udx-registration.account-details") }}
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div>{{ $t("udx-registration.S3Account") }}: {{ registrationForm.accountName || $t("common.not-available") }}</div>
                    <div>{{ $t("udx-registration.IAMUser") }}: {{ registrationForm.iamUsername || $t("common.not-available") }}</div>
                    <div>{{ $t("udx-registration.bucketName") }}: {{ registrationForm.bucketName || $t("common.not-available") }}</div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>

          <form autocomplete="off" id="create-new-lyvepilot">
            <v-row>
               <v-col class="py-0 pr-0">
                <div
                  :class="{
                    'cortx-form-group--error': $v.registrationForm.url.$error
                  }"
                >
                  <label
                    class="cortx-form-group-label"
                    for="url"
                    id="udx-url-label"
                  >
                  {{ $t("udx-registration.url") }}*: {{ registrationForm.url || $t("common.not-available") }}
                  </label>
                  <input
                    v-if="hideInput"
                    class="cortx-form__input_text"
                    type="text"
                    id="url"
                    name="url"
                    :disabled="!isDevEnv"
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
            </v-row>
            <v-row>
              <v-col class="py-0 pr-0">
                <div class="cortx-form-group">
                  <label
                    class="cortx-form-group-label"
                    for="pin"
                    id="udx-pin-label"
                  >
                    <cortx-info-tooltip
                      :label="$t('udx-registration.deviceRegistrationPIN')"
                      message="Enter the PIN provided by your Lyve Pilot portal."
                    />
                  </label>
                  <input class="cortx-form__input_text" type="number" 
                  v-model.trim="registrationForm.pin"
                  v-on:keyup.enter="registerUDX()"
                  />
                </div>
              </v-col>
            </v-row>
            <br />

            <button
              id="udx-registrationbtn"
              type="button"
              class="cortx-btn-primary"
              @click="registerUDX()"
              :disabled="
                $v.registrationForm.$invalid
              "
            >
              {{ $t("udx-registration.register-btn") }}
            </button>
            <button
              id="udx-backbtn"
              type="button"
              class="cortx-btn-secondary ml-5"
              @click="backToPreviousStep()"
            >
              {{ $t("common.back") }}
            </button>
          </form>
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
  passwordTooltipMessage
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
  public isDevEnv: boolean = false;
  public registrationToken: string = "";
  public s3URI: string = "";
  public registrationResponse: any = null;
  public hideInput: boolean = false;
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
    pin: ""
  };

  @Validations()
  public validations = {
    registrationForm: {
      url: { required, udxURLRegex },
      pin: { required }
    }
  };

  private accessKeyDetails: any = {};
  private showAccessKeyDetailsDialog: boolean;
  private secretKey: string = "";
  private accessKey: string = "";

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
    if (this.$route.query && this.$route.query.dev) {
      this.isDevEnv = (this.$route.query.dev === "true");
    }
    const res = await Api.getAll(apiRegister.udx_registration_token);
    if (res && res.data) {
      this.registrationToken = res.data.registrationToken;
    }
    const resUDXSASS = await Api.getAll(apiRegister.udx_saas);
    if (resUDXSASS && resUDXSASS.data) {
      this.registrationForm.url = resUDXSASS.data.saas_url;
    }
    this.$store.dispatch("systemConfig/hideLoader");
  }

  public backToPreviousStep() {
    this.stepNumber = this.stepNumber - 1;
  }

  public createdS3Account(
    authToken: string,
    accountName: any,
    password: string,
    accountEmail: string
  ) {
    this.authToken = authToken;
    this.registrationForm.accountName = accountName;
    this.registrationForm.accountEmail = accountEmail;
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

  public updateStep(back: boolean, selectedBucket: string, s3URI: string) {
    this.isCreateAccount = false;
    if (back) {
      this.clearRegistrationForm();
      this.stepNumber = this.stepNumber - 1;
    } else {
      this.stepNumber = this.stepNumber + 1;
      this.registrationForm.bucketName = selectedBucket;
      this.s3URI = s3URI;
    }
  }

  public updateStep4(
    back: boolean,
    secretKey: string,
    accessKey: string,
    username: string
  ) {
    if (back) {
      this.stepNumber = this.stepNumber - 1;
    } else {
      this.stepNumber = this.stepNumber + 1;
      this.registrationForm.iamUsername = username;
      this.secretKey = secretKey;
      this.accessKey = accessKey;
    }
  }

  public async registerUDX() {
    const config: any = {
      headers: {
        auth_token: this.authToken
      }
    };
    this.$store.dispatch("systemConfig/showLoader", "Registering LDP...");
    const payload = {
      registerDeviceParams: {
        url: this.registrationForm.url,
        regPin: this.registrationForm.pin,
        regToken: this.registrationToken
      },
      accessParams: {
        accountName: this.registrationForm.accountName,
        uri: this.s3URI,
        credentials: {
          accessKey: this.accessKey,
          secretKey: this.secretKey
        }
      },
      internalCortxParams: {
        bucketName: this.registrationForm.bucketName
      }
    };

    const res = await Api.post(apiRegister.udx_registration, payload, {
      timeout: 120000
    });
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
    this.registrationForm.pin = "";
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
