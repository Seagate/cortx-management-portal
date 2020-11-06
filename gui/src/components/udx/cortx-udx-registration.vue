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

        <v-stepper-step step="4">
          Registration 
        </v-stepper-step>

      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>

          <button class="cortx-btn-primary" @click="stepNumber = 2">
            Continue
          </button>

          <v-btn text>
            Cancel
          </v-btn>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>

          <button class="cortx-btn-primary" @click="stepNumber = 3">
            Continue
          </button>

          <v-btn text>
            Cancel
          </v-btn>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>

          <button class="cortx-btn-primary" @click="stepNumber = 4">
            Continue
          </button>

          <v-btn text>
            Cancel
          </v-btn>
        </v-stepper-content>
        <v-stepper-content step="4">
           <v-row>
            <v-col class="py-0 pr-0">
           <div id="udx-reg-token-container" v-if="registrationToken">
            <div class="udx-reg-token-lbl">
              <label class="cortx-text-lg cortx-float-l" id="udx-tocken-title">{{ $t("udx-registration.registration-token") }}</label>
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
          <br>
          <v-row>
            <v-col class="py-0 pr-0">
          <div class="cortx-form-group">
            <label class="cortx-form-group-label" for="url" id="udx-url-label">
              <cortx-info-tooltip label="URL*" message="Enter the URL provided by your UDX portal." />
            </label>
            <input
              class="cortx-form__input_text"
              type="text"
            />
          </div>
            </v-col>
            <v-col class="py-0 pr-0">
           <div class="cortx-form-group">
            <label class="cortx-form-group-label" for="pin" id="udx-pin-label">
              <cortx-info-tooltip label="PIN*" message="Enter the PIN provided by your UDX portal." />
            </label>
            <input
              class="cortx-form__input_text"
              type="text"
            />
          </div>
            </v-col>
          </v-row>
          <button
            id="udx-registrationbtn"
            type="button"
            class="cortx-btn-primary"
          >
            {{ $t("udx-registration.register-btn") }}
          </button>
          <button
            id="udx-clearbtn"
            type="button"
            class="ml-8 cortx-btn-secondary"
            @click="clearRegistrationForm()"
          >
            {{ $t("udx-registration.clear") }}
          </button>
          <v-row>
             <v-data-table
            :headers="accountsTableHeaderList"
            :items="accountsList"
            :expanded.sync="expanded"
            v-bind:single-expand="true"
            item-key="account_name"
            class="cortx-table"
            id="s3-datatable"
            show-expand
            :hide-default-header="true"
          >
            <template v-slot:header="{}">
              <tr>
                <th
                  v-for="header in accountsTableHeaderList"
                  :key="header.text"
                  class="tableheader"
                >
                  <span>{{ header.text }}</span>
                </th>
              </tr>
            </template>
            <template v-slot:item.data-table-expand="{ item }">
            </template>
          </v-data-table>
          </v-row>
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
  components: { CortxDownloadCsvDialog },
  data() {
    return {
      stepNumber: 1,
    };
  }
})
export default class CortxUDXRegistration extends Vue {
  public registrationToken: string = "";
  public registrationResponse: any = null;
  public passwordTooltipMessage: string = passwordTooltipMessage;
  public accountNameTooltipMessage: string = accountNameTooltipMessage;
  public bucketNameTooltipMessage: string = udxBucketNameTooltipMessage;
  private showAccessKeyDetailsDialog: boolean;
  private accessKeyDetails: any = {};
  private accessKeyTableHeaderList: any[];
  private accountsTableHeaderList: any[];
  private accountsList: Account[] = [];
  constructor() {
    super();
    this.showAccessKeyDetailsDialog = false;
    this.accessKeyDetails = {};
    this.accountsTableHeaderList = [
      {
        text: "Account name",
        value: "account_name",
        sortable: false
      },
      {
        text: "Bucket Name",
        value: "bucket_name",
        sortable: false
      },
      {
        text: "IAM User",
        value: "iam_user",
        sortable: false
      },
      { text: "", value: "data-table-expand" }
    ];
    
  }
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

  public beforeMount() {
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
        [`${i18n.t("s3.access-key.table-headers.bucket_name")}`]:
          "ldp-" + this.registrationForm.bucketName
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
</style>
