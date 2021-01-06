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
  <form autocomplete="off" id="s3-create-account-form">
    <v-row>
      <v-col class="py-0 pr-0">
        <div
          class="cortx-form-group"
          :class="{
            'cortx-form-group--error':
              $v.createAccountForm.account.account_name.$error
          }"
        >
          <label
            class="cortx-form-group-label"
            for="accountName"
            id="s3-lblaccountname"
          >
            <cortx-info-tooltip
              id="account-name-label"
              :label="`${$t('udx-registration.accountName')}*`"
              :message="accountNameTooltipMessage"
            />
          </label>
          <input
            class="cortx-form__input_text"
            type="text"
            id="accountName"
            name="accountName"
            width="200px"
            v-model.trim="createAccountForm.account.account_name"
            @input="$v.createAccountForm.account.account_name.$touch"
          />
          <div class="cortx-form-group-label cortx-form-group-error-msg">
            <label
              id="s3-accountname-reuired"
              v-if="
                $v.createAccountForm.account.account_name.$dirty &&
                  !$v.createAccountForm.account.account_name.required
              "
              >{{ $t("s3.account.name-required") }}</label
            >
            <label
              id="s3account-invalid"
              v-else-if="
                $v.createAccountForm.account.account_name.$dirty &&
                  !$v.createAccountForm.account.account_name.accountNameRegex
              "
              >{{ $t("s3.account.invalid-account") }}</label
            >
          </div>
        </div>
      </v-col>
      <v-col class="py-0 pr-0">
        <div
          class="cortx-form-group"
          :class="{
            'cortx-form-group--error':
              $v.createAccountForm.account.account_email.$error
          }"
        >
          <label
            class="cortx-form-group-label"
            for="accountEmail"
            id="s3-lblemail"
            >{{ $t("s3.account.email-label") }}</label
          >
          <input
            class="cortx-form__input_text"
            type="text"
            id="accountEmail"
            name="accountEmail"
            v-model.trim="createAccountForm.account.account_email"
            @input="$v.createAccountForm.account.account_email.$touch"
            placeholder="example@email.com"
          />
          <div class="cortx-form-group-label cortx-form-group-error-msg">
            <label
              id="s3-email-required"
              v-if="
                $v.createAccountForm.account.account_email.$dirty &&
                  !$v.createAccountForm.account.account_email.required
              "
              >{{ $t("s3.account.email-required") }}</label
            >
            <label
              id="s3-email-invalid"
              v-else-if="
                $v.createAccountForm.account.account_email.$dirty &&
                  !$v.createAccountForm.account.account_email.email
              "
              >{{ $t("s3.account.invalid-email") }}</label
            >
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
              $v.createAccountForm.account.password.$error
          }"
        >
          <label
            class="cortx-form-group-label"
            for="accountPassword"
            id="s3-lblpassword"
          >
            <cortx-info-tooltip
              id="aacount-password"
              :label="`${$t('login.password-placeholder')}*`"
              :message="passwordTooltipMessage"
            />
          </label>
          <input
            class="cortx-form__input_text"
            type="password"
            id="accountPassword"
            name="accountPassword"
            v-model.trim="createAccountForm.account.password"
            @input="$v.createAccountForm.account.password.$touch"
          />
          <div class="cortx-form-group-label cortx-form-group-error-msg">
            <label
              id="s3-password-required"
              v-if="
                $v.createAccountForm.account.password.$dirty &&
                  !$v.createAccountForm.account.password.required
              "
              >{{ $t("common.password-required") }}</label
            >
            <label
              id="s3-password-invalid"
              v-else-if="
                $v.createAccountForm.account.password.$dirty &&
                  !$v.createAccountForm.account.password.passwordRegex
              "
              >{{ $t("common.invalid-pass") }}</label
            >
          </div>
        </div>
      </v-col>
      <v-col class="py-0 pr-0">
        <div
          class="cortx-form-group"
          :class="{
            'cortx-form-group--error':
              $v.createAccountForm.confirmPassword.$error
          }"
        >
          <label
            class="cortx-form-group-label"
            for="confirmPassword"
            id="s3-lblconfirmpassword"
            >{{ $t("common.confirm-pass-label") }}</label
          >
          <input
            class="cortx-form__input_text"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            v-model.trim="createAccountForm.confirmPassword"
            @input="$v.createAccountForm.confirmPassword.$touch"
            v-on:keyup.enter="createAccount()"
          />
          <span
            id="s3-password-notmatch"
            class="cortx-form-group-label cortx-form-group-error-msg"
            v-if="
              $v.createAccountForm.confirmPassword.$dirty &&
                !$v.createAccountForm.confirmPassword.sameAsPassword
            "
            >{{ $t("common.pass-not-match") }}</span
          >
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <button
          id="s3-crete-accountbtn"
          type="button"
          class="cortx-btn-primary"
          @click="createAccount()"
          :disabled="$v.createAccountForm.$invalid"
        >
          {{ $t("s3.account.create-account-btn") }}
        </button>
        <button
          id="s3-cancel-accountbtn"
          type="button"
          class="cortx-btn-secondary cancel-button"
          @click="cancelAccount()"
        >
          {{ $t("common.cancel") }}
        </button>
      </v-col>
    </v-row>
    <v-dialog
      v-model="showAccountDetailsDialog"
      persistent
      max-width="790"
      id="s3-accesskey-dialog"
    >
      <v-card>
        <v-card-title class="title mt-6 ml-3">
          <img
            class="mr-2"
            :src="require('@/assets/resolved-default.svg')"
            id="s3-account-resolve-icon"
          />
          <span>{{ $t("s3.account.account-created") }}</span>
        </v-card-title>
        <v-divider />

        <div class="mt-2 pl-7" style="height: 30px;">
          <img
            class="cortx-float-l mr-1"
            :src="require('@/assets/actions/warning-orange.svg')"
          />
          <span
            id="s3-warning-text"
            class="cortx-float-l cortx-text-md cortx-text-bold cortx-text-warning mt-1"
          >
            <span>{{ $t("s3.account.save-info") }}</span>
          </span>
        </div>

        <table class="mt-2 ml-7 cortx-text-md" id="s3-secretekey-data">
          <tr>
            <td
              class="py-2 cortx-text-bold credentials-item-label"
              id="s3-account-name-popup-label"
            >
              {{ $t("s3.account.account-name") }}
            </td>
            <td class="py-2" id="s3-account-name-popup-value">
              {{ account.account_name }}
            </td>
          </tr>
          <tr v-if="s3UrlInfo && !s3UrlInfo.s3UrlNone">
            <td
              class="py-2 cortx-text-bold credentials-item-label"
              id="s3-access-key-popup-label"
            >
              {{ $t("s3.account.url-label") }}
            </td>
            <td class="py-2">
              {{ s3UrlInfo.s3Url[0] }}, {{ s3UrlInfo.s3Url[1] }}
            </td>
          </tr>
          <tr>
            <td class="py-2 cortx-text-bold credentials-item-label">
              {{ $t("s3.account.access-key") }}
            </td>
            <td class="py-2" id="s3-access-key-popup-value">
              {{ account.access_key }}
            </td>
          </tr>
          <tr>
            <td
              class="py-2 cortx-text-bold credentials-item-label"
              id="s3-secret-key-popup-label"
            >
              {{ $t("s3.account.secret-key") }}
            </td>
            <td class="py-2" id="s3-secret-key-popup-value">
              {{ account.secret_key }}
            </td>
          </tr>
          <tr>
            <td
              class="py-2 cortx-text-bold credentials-item-label"
              id="s3-account-id-popup-label"
            >
              {{ $t("s3.account.account_id") }}
            </td>
            <td class="py-2" id="s3-secret-key-popup-value">
              {{ account.account_id }}
            </td>
          </tr>
          <tr>
            <td
              class="py-2 cortx-text-bold credentials-item-label"
              id="s3-canonical-id-popup-label"
            >
              {{ $t("s3.account.canonical_id") }}
            </td>
            <td class="py-2" id="s3-secret-key-popup-value">
              {{ account.canonical_id }}
            </td>
          </tr>
        </table>

        <div v-if="s3UrlInfo && s3UrlInfo.s3UrlNone" class="pl-7">
          {{ $t("s3.account.url-note") }}
        </div>

        <v-card-actions>
          <a
            id="s3-download-csv"
            class="ma-5 cortx-btn-primary cortx-download-csv-link"
            :href="credentialsFileContent"
            download="credentials.csv"
            @click="downloadAndClose()"
            >{{ $t("s3.account.download-as-csv-continue") }}</a
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </form>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Validations } from "vuelidate-property-decorators";
import { required, helpers, sameAs, email } from "vuelidate/lib/validators";
import { Account } from "../../models/s3";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import CortxAccessKeyManagement from "./access-key-management.vue";
import {
  accountNameRegex,
  passwordRegex,
  passwordTooltipMessage,
  accountNameTooltipMessage
} from "./../../common/regex-helpers";
import i18n from "../../i18n";
import CommonUtils from "../../common/common-utils";

@Component({
  name: "cortx-S3-account",
  components: { CortxS3Account }
})
export default class CortxS3Account extends Vue {
  public createAccountForm = {
    account: {} as Account,
    confirmPassword: ""
  };

  @Prop({ required: false })
  public s3UrlInfo: any;

  @Validations()
  public validations = {
    createAccountForm: {
      account: {
        account_name: { required, accountNameRegex },
        account_email: { required, email },
        password: { required, passwordRegex }
      },
      confirmPassword: {
        sameAsPassword: sameAs(() => {
          return this.createAccountForm.account.password;
        })
      }
    }
  };

  private expanded = [];
  private showCreateAccountForm: boolean;
  private showAccountDetailsDialog: boolean;
  private showConfirmDeleteDialog: boolean;
  private account: Account = {} as Account;
  private accountsTableHeaderList: any[];
  private accountsList: Account[] = [];
  private accountToDelete: string = "";
  private passwordTooltipMessage = passwordTooltipMessage;
  private accountNameTooltipMessage = accountNameTooltipMessage;
  private isCredentialsFileDownloaded: boolean = false;
  private credentialsFileContent: string = "";
  private showEditAccountForm: boolean;
  private editAccoutName: string;
  private s3UrlNone: boolean = false;

  constructor() {
    super();

    this.showCreateAccountForm = false;
    this.showAccountDetailsDialog = false;
    this.showConfirmDeleteDialog = false;
    this.showEditAccountForm = false;
  }

  public data() {
    return {
      constStr: require("./../../common/const-string.json")
    };
  }

  public cancelAccount() {
    this.clearCreateAccountForm();
    this.$emit("createAccount", false);
  }

  public async createAccount() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      i18n.t("s3.account.loading-create")
    );
    const res = await Api.post(
      apiRegister.s3_account,
      this.createAccountForm.account
    );
    if (!res.error) {
      this.account = res.data;
      this.isCredentialsFileDownloaded = false;
      this.credentialsFileContent =
        "data:text/plain;charset=utf-8," +
        encodeURIComponent(this.getCredentialsFileContent());
    }
    this.$store.dispatch("systemConfig/hideLoader");
    this.showAccountDetailsDialog = true;
  }

  public getCredentialsFileContent(): string {
    return (
      "Account name,S3 URL,Access key,Secret key\n" +
      this.account.account_name +
      "," +
      `${this.s3UrlInfo.s3Url[0]} ${this.s3UrlInfo.s3Url[1]}` +
      "," +
      this.account.access_key +
      "," +
      this.account.secret_key +
      "," +
      this.account.account_id +
      "," +
      this.account.canonical_id
    );
  }

  public async downloadAndClose() {
    this.isCredentialsFileDownloaded = true;
    this.showAccountDetailsDialog = false;
    this.showCreateAccountForm = false;
    this.login();
  }

  public clearCreateAccountForm() {
    this.createAccountForm.confirmPassword = "";
    this.createAccountForm.account.password = "";
    this.createAccountForm.account.account_name = "";
    this.createAccountForm.account.account_email = "";
    if (this.$v.createAccountForm) {
      this.$v.createAccountForm.$reset();
    }
  }

  public async login() {
    this.$store.dispatch("systemConfig/showLoader", "Logging in...");
    const selectedAccount: any = this.createAccountForm.account.account_name;
    const loginCredentials: any = {
      username: this.createAccountForm.account.account_name,
      password: this.createAccountForm.account.password
    };
    const res = await Api.post(apiRegister.login, loginCredentials);
    this.$store.dispatch("systemConfig/hideLoader");
    if (res && res.headers) {
      this.$emit(
        "setAuthToken",
        res.headers.authorization,
        this.createAccountForm.account.account_name,
        this.createAccountForm.account.password,
        this.createAccountForm.account.account_email
      );
      this.clearCreateAccountForm();
    }
  }
}
</script>
<style lang="scss" scoped>
.pointer {
  cursor: pointer;
}
tr {
  border-style: solid !important;
  border-width: 1px !important;
  border-color: #e3e3e3 !important;
}
.actbtn {
  position: absolute;
  float: left;
}
#clear {
  font-size: 14px;
  color: var(--v-csmprimary-base);
  float: right;
}
#title {
  color: black;
}
.active {
  display: inline-block;
  color: var(--v-csmprimary-base) !important;
}
.notActive {
  opacity: 0;
}
.tableheader:hover {
  .notActive {
    opacity: 1;
  }
}
tbody tr:active {
  border-top: 2px solid darkgray !important;
  border-bottom: 2px solid darkgray !important;
}
.delete-account-confirmation-msg {
  color: #000;
  font-size: 16px;
}
.cortx-download-csv-link {
  text-decoration: none;
  display: inline-block;
  padding-top: 10px;
  color: #ffffff;
}
.credentials-item-label {
  width: 10rem;
}
.cancel-button {
  margin-left: 15px;
}
</style>
