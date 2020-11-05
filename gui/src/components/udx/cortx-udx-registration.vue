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
  <v-stepper v-model="e1" >
    <v-stepper-header>
      <v-stepper-step color="green"  
        :complete="e1 > 1"
        step="1"
      >
        Bucket List
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step color="green"
        :complete="e1 > 2"
        step="2"
      >
       IAM User
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step color="green"
        :complete="e1 > 3"
        step="3"
      >
     S3 Account
      </v-stepper-step>
         <v-divider></v-divider>
     <v-stepper-step  color="green"
        step="4">
      URL
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-card
          class="mb-12"
         
          height="100px" flat
        > </v-row>
      <v-row class="mb-2">
        <v-col class="py-0">
          <!-- <label class="cortx-text-md cortx-text-bold" id="udx-account-detailslbl">{{ $t("udx-registration.s3-details") }}</label> -->
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
            <label class="cortx-form-group-label" for="accountName" udx-account-namelbl>
              <cortx-info-tooltip label="Select Bucket *"  />
            </label>
            <!-- <input
              class="cortx-form__input_text"
              type="text"
              id="accountName"
              name="accountName"
              v-model.trim="registrationForm.accountName"
              @input="$v.registrationForm.accountName.$touch"
            /> -->
            <select name="cars" id="cars" class="cortx-form__input_text">
            <option value="volvo">ldp-Volvo</option>
            <option value="saab">ldp-Saab</option>
            <option value="mercedes">ldp-Mercedes</option>
            <option ><a>Create-new-Bucket</a></option>
            </select>
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
           
          </div>
        </v-col>
      </v-row>
      
      <!-- <v-row>
        <v-col class="py-0">
          <label class="cortx-text-md" id="udx-agreelbl">{{ $t("udx-registration.iagreetext") }}:</label>
          <br />
          <label class="cortx-ckb-container" for="consentOne" id="udx-firstcheck">
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
          <label class="cortx-ckb-container" for="consentTwo" id="udx-secondcheck">
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
      </v-row> -->
      </v-card>

        <v-btn
          color="green"
          @click="e1 = 2"
        >
          Create and Continue
        </v-btn>

        <v-btn text>
          Cancel
        </v-btn>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-card
          class="mb-12"
          height="200px" flat
        > </v-row>
      <v-row>
        <v-col class="py-0 pr-0">
          <div
            class="cortx-form-group"
            :class="{
              'cortx-form-group--error':
                $v.registrationForm.iamUsername.$error
            }"
          >
            <label class="cortx-form-group-label" for="iamUsername" id="udx-iamuserlbl">
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
            <label class="cortx-form-group-label" for="iamUserPassword" id="udx-iamuserpasswordlbl">
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
            <label class="cortx-form-group-label" for="iamUserConfirmPassword" id="udx-confirm-passwordlbl">{{ $t("udx-registration.confirm-pass") }}*</label>
            <input
              class="cortx-form__input_text"
              type="password"
              id="iamUserConfirmPassword"
              name="iamUserConfirmPassword"
              v-model.trim="registrationForm.iamUserConfirmPassword"
              @input="$v.registrationForm.iamUserConfirmPassword.$touch"
            />
          </div>
        </v-col>
      </v-row></v-card>

        <v-btn
          color="green"
          @click="e1 = 3"
        >
           Create and Continue
        </v-btn>

        <v-btn text>
          Cancel
        </v-btn>
      </v-stepper-content>
 <v-stepper-content step="3">
        <v-card
          class="mb-12"
          height="200px" flat
        > <v-row class="mb-2">
        <v-col class="py-0">
          <label class="cortx-text-md cortx-text-bold" id="udx-account-detailslbl">{{ $t("udx-registration.s3-details") }}</label>
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
            <label class="cortx-form-group-label" for="accountName" udx-account-namelbl>
              <cortx-info-tooltip label="Account List*" :message="accountNameTooltipMessage" />
            </label>
            <select name="cars" id="cars" class="cortx-form__input_text">
              <option value="volvo">S3admin</option>
              <option value="saab">s3testaccount2</option>
              <option value="mercedes">s3testaccount4</option>
              <option value="audi">Creat-New-S3Account</option>
            </select>
          </div>
        </v-col>
      
        <v-col class="py-0 pl-0">
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
            <label class="cortx-form-group-label" for="accountPassword" id="udx-accounpasswordlbl">
              <cortx-info-tooltip label="S3 Account Password*" :message="passwordTooltipMessage" />
            </label>
            <input
              class="cortx-form__input_text"
              type="password"
              id="accountPassword"
              name="accountPassword"
              v-model.trim="registrationForm.accountPassword"
              @input="$v.registrationForm.accountPassword.$touch"
            />
          </div>
        </v-col>
       
      </v-row>
        </v-card>

        <v-btn
          color="green"
          @click="e1 = 4"
        >
          login
        </v-btn>

        <v-btn text>
          Cancel
        </v-btn>
      </v-stepper-content>
      
      <v-stepper-content step="4">
        <v-card
          class="mb-12"
          height="100px" flat
        ><v-row>
        <v-col class="py-0 pr-0">
          <div
            class="cortx-form-group"
            :class="{
              'cortx-form-group--error':
                $v.registrationForm.url.$error
            }"
          >
            <label class="cortx-form-group-label" for="url" id="udx-url-label">
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
           
          </div>
        </v-col>
      </v-row></v-card>

        <v-btn
          color="green"
          @click="e1 = 1"
        >
          Register
        </v-btn>

        <v-btn text>
          Cancel
        </v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Validations } from "vuelidate-property-decorators";
import { required, helpers, sameAs, email } from "vuelidate/lib/validators";
import CortxDownloadCsvDialog from "./../s3/download-csv-dialog.vue";
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

@Component({
  name: "cortx-udx-registration",
  components: { CortxDownloadCsvDialog }
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
 data () {
      return {
        e1: 1,
      }
    }
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
  private showAccessKeyDetailsDialog: boolean;
  private accessKeyDetails: any = {};
  private accessKeyTableHeaderList: any[];

  constructor() {
    super();
    this.showAccessKeyDetailsDialog = false;
    this.accessKeyDetails = {};
    this.accessKeyTableHeaderList = [
      {
        text: i18n.t("s3.access-key.table-headers.access_key"),
        value: "access_key",
        sortable: false
      },
      {
        text: i18n.t("s3.access-key.table-headers.secret_key"),
        value: "secret_key",
        sortable: false
      },
      {
        text: i18n.t("s3.access-key.table-headers.iam_access_key"),
        value: "IAM access_key",
        sortable: false
      },
      {
        text: i18n.t("s3.access-key.table-headers.iam_secret_key"),
        value: "IAM secret_key",
        sortable: false
      },
      { text: "", value: "data-table-expand" }
    ];
  }

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
        bucket_name: "ldp-" + this.registrationForm.bucketName
      },
      { timeout: 120000 }
    );
    if (res && res.data) {
      this.registrationResponse = res.data;
      this.accessKeyDetails = {
        [`${i18n.t("s3.access-key.table-headers.access_key")}`]: this
          .registrationResponse.s3_account.access_key,
        [`${i18n.t("s3.access-key.table-headers.secret_key")}`]: this
          .registrationResponse.s3_account.secret_key,
        [`${i18n.t("s3.access-key.table-headers.iam_access_key")}`]: this
          .registrationResponse.iam_user.access_key,
        [`${i18n.t("s3.access-key.table-headers.iam_secret_key")}`]: this
          .registrationResponse.iam_user.secret_key,
        [`${i18n.t("s3.access-key.table-headers.bucket_name")}`]: "ldp-" + this.registrationForm.bucketName

      };
      this.showAccessKeyDetailsDialog = true;
    }
    this.$store.dispatch("systemConfig/hideLoader");
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
  public async closeDialogbox() {
    this.showAccessKeyDetailsDialog = false;
    this.$emit("complete");
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
.v-stepper__label {
  color: red !important;
}
</style>
