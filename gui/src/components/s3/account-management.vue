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
  <div class="body-2">
    <cortx-has-access
      :to="$cortxUserPermissions.sysconfig + $cortxUserPermissions.list"
    >
      <div
        id="s3-configuration-title-container"
        class="mt-2 s3-configuration-page-title"
      >
        <label id="s3-account-form-title" class="headline font-weight-bold">{{
          $t("s3.account.configuration")
        }}</label>
        <div class="mt-1" style="color: #454545; font-size: 14px">
          <label id="s3-account-form-text">
            {{ $t("s3.account.header-text") }}
          </label>
        </div>
      </div>
    </cortx-has-access>
    <cortx-has-access
      :to="$cortxUserPermissions.s3iamusers + $cortxUserPermissions.list"
    >
      <div class="mt-2 pl-2" v-if="!isS3UrlNone">
        <label id="s3-account-manage-lbl" class="cortx-text-lg cortx-text-bold">
          {{ $t("s3.account.url-label") }}
        </label>
        <span v-for="(url, i) in s3Url" v-bind:key="url">
          <span :id="'s3-url-id-' + i" class="pl-2">{{ url }}</span>
          <span v-if="url" class="pr-5">
            <v-tooltip right max-width="300">
              <template v-slot:activator="{ on }">
                <img
                  :id="'copy-url-btn-' + i"
                  v-on:click="copyS3Url(url)"
                  v-on="on"
                  class="cortx-cursor-pointer copy-url"
                  src="@/assets/actions/copy-text.svg"
                />
              </template>
              <span :id="'copy-tooltip-' + i">{{
                $t("s3.account.copy-tooltip")
              }}</span>
            </v-tooltip>
          </span>
        </span>
      </div>
    </cortx-has-access>
    <v-row>
      <v-col class="py-0 col-7">
        <cortx-has-access
          :to="$cortxUserPermissions.s3accounts + $cortxUserPermissions.list"
        >
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
            :hide-default-footer="
              $hasAccessToCsm(
                `${$cortxUserPermissions.s3iamusers}${$cortxUserPermissions.list}`
              )
            "
            :disable-pagination="
              $hasAccessToCsm(
                `${$cortxUserPermissions.s3iamusers}${$cortxUserPermissions.list}`
              )
            "
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
              <div class="wrapper-width">
                <div v-if="isUpdatePasswordAllowed" class="cortx-float-l cortx-margin-r">
                  <v-tooltip right max-width="300">
                    <template v-slot:activator="{ on }">                      
                      <img
                        id="s3-edit-account"
                        v-on:click="onEditBtnClick(item)"
                        v-on="on"
                        class="cortx-cursor-pointer"
                        src="@/assets/actions/edit-green.svg"
                      />
                    </template>
                    <span id="update-password-tooltip">
                      {{ $t("s3.account.update-password") }}
                    </span>
                  </v-tooltip>
                </div>
                <div v-if="isResetPasswordAllowed" class="cortx-float-l cortx-margin-r">
                  <v-tooltip right max-width="300">
                    <template v-slot:activator="{ on }">
                      <img
                        id="iam-reset-password"
                        v-on:click="onResetBtnClick(item)"
                        v-on="on"
                        class="cortx-cursor-pointer"
                        src="@/assets/actions/edit-green.svg"
                      />
                    </template>
                    <span id="reset-password-tooltip">
                      {{ $t("s3.account.reset-password") }}
                    </span>
                  </v-tooltip>
                </div>
                <div v-if="isDeleteAccountAllowed" class="cortx-float-l">
                  <v-tooltip right max-width="300">
                    <template v-slot:activator="{ on }">
                      <img
                        id="s3-delete-account"
                        v-on:click="openConfirmDeleteDialog(item.account_name)"
                        v-on="on"
                        class="cortx-cursor-pointer"
                        src="@/assets/actions/delete-green.svg"
                      />
                    </template>
                    <span id="reset-password-tooltip">
                      {{ $t("s3.account.delete-account") }}
                    </span>
                  </v-tooltip>
                </div>
              </div>
            </template>
          </v-data-table>
        </cortx-has-access>

        <cortx-has-access
          :to="$cortxUserPermissions.s3iamusers + $cortxUserPermissions.list"
        >
          <cortx-access-key-management
            :s3Url="s3Url.toString()"
            :s3UrlNone="isS3UrlNone"
          ></cortx-access-key-management>
        </cortx-has-access>
      </v-col>
      <v-col class="py-0 col-5">
        <div
          v-if="showCreateAccountForm"
          class="pa-2"
          id="s3-create-account-form"
        >
          <v-row>
            <v-col class="pl-4 col-6 pb-0">
              <div
                class="cortx-form-group-custom"
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
                    label="Account name*"
                    :message="accountNameTooltipMessage"
                  />
                </label>
                <input
                  class="cortx-form__input_text"
                  type="text"
                  id="accountName"
                  name="accountName"
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
                  >
                    {{ $t("s3.account.name-required") }}</label
                  >
                  <label
                    id="s3account-invalid"
                    v-else-if="
                      $v.createAccountForm.account.account_name.$dirty &&
                      !$v.createAccountForm.account.account_name
                        .accountNameRegex
                    "
                    >{{ $t("s3.account.invalid-account") }}</label
                  >
                </div>
              </div>
            </v-col>
            <v-col class="pl-4 col-6 pb-0">
              <div
                class="cortx-form-group-custom"
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
            <v-col class="pl-4 col-6">
              <div
                class="cortx-form-group-custom"
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
                    label="Password*"
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
                    >Password is required.</label
                  >
                  <label
                    id="s3-password-invalid"
                    v-else-if="
                      $v.createAccountForm.account.password.$dirty &&
                      !$v.createAccountForm.account.password.passwordRegex
                    "
                    >Invalid password.</label
                  >
                </div>
              </div>
            </v-col>
            <v-col class="pl-4 col-6">
              <div
                class="cortx-form-group-custom"
                :class="{
                  'cortx-form-group--error':
                    $v.createAccountForm.confirmPassword.$error
                }"
              >
                <label
                  class="cortx-form-group-label"
                  for="confirmPassword"
                  id="s3-lblconfirmpassword"
                  >Confirm password*</label
                >
                <input
                  class="cortx-form__input_text"
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  v-model.trim="createAccountForm.confirmPassword"
                  @input="$v.createAccountForm.confirmPassword.$touch"
                />
                <span
                  id="s3-password-notmatch"
                  class="cortx-form-group-label cortx-form-group-error-msg"
                  v-if="
                    $v.createAccountForm.confirmPassword.$dirty &&
                    !$v.createAccountForm.confirmPassword.sameAsPassword
                  "
                  >Passwords do not match</span
                >
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pt-0">
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
                id="s3-account-cancelbtn"
                type="button"
                class="cortx-btn-tertiary"
                @click="closeCreateAccountForm()"
              >
                {{ $t("s3.account.cancel-btn") }}
              </button>
            </v-col>
          </v-row>
        </div>
        <div v-if="showEditAccountForm" class="pa-2" id="s3-editaccount-form">
          <v-row>
            <v-col class="pb-0">
              <div
                class="cortx-form-group-custom"
                :class="{
                  'cortx-form-group--error': $v.editAccountForm.password.$error
                }"
              >
                <label
                  class="cortx-form-group-label"
                  for="accountPasswordEdit"
                  id="s3-editpasswordlbl"
                >
                  <cortx-info-tooltip
                    label="Password*"
                    :message="passwordTooltipMessage"
                  />
                </label>
                <input
                  class="cortx-form__input_text"
                  type="password"
                  id="accountPasswordEdit"
                  name="accountPasswordEdit"
                  v-model.trim="editAccountForm.password"
                  @input="$v.editAccountForm.password.$touch"
                />
                <div class="cortx-form-group-label cortx-form-group-error-msg">
                  <label
                    id="s3-editpassword-required"
                    v-if="
                      $v.editAccountForm.password.$dirty &&
                      !$v.editAccountForm.password.required
                    "
                    >Password is required.</label
                  >
                  <label
                    id="s3-editpassword-invalid"
                    v-else-if="
                      $v.editAccountForm.password.$dirty &&
                      !$v.editAccountForm.password.passwordRegex
                    "
                    >Invalid password.</label
                  >
                </div>
              </div>
            </v-col>
            <v-col class="pb-0">
              <div
                class="cortx-form-group-custom"
                :class="{
                  'cortx-form-group--error':
                    $v.editAccountForm.confirmPassword.$error
                }"
              >
                <label
                  class="cortx-form-group-label"
                  for="confirmPasswordEdit"
                  id="s3-editconfrimpassword"
                  >Confirm password*</label
                >
                <input
                  class="cortx-form__input_text"
                  type="password"
                  id="confirmPasswordEdit"
                  name="confirmPasswordEdit"
                  v-model.trim="editAccountForm.confirmPassword"
                  @input="$v.editAccountForm.confirmPassword.$touch"
                />
                <span
                  id="s3-editpassword-notmatch"
                  class="cortx-form-group-label cortx-form-group-error-msg"
                  v-if="
                    $v.editAccountForm.confirmPassword.$dirty &&
                    !$v.editAccountForm.confirmPassword.sameAsPassword
                  "
                  >Passwords do not match</span
                >
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <button
                type="button"
                id="btnEditPassword"
                class="cortx-btn-primary"
                @click="editAccount()"
                :disabled="$v.editAccountForm.$invalid"
              >
                {{ $t("s3.account.update-btn") }}
              </button>
              <button
                type="button"
                id="btncancelEditpass"
                class="cortx-btn-tertiary"
                @click="closeEditAccountForm()"
              >
                {{ $t("s3.account.cancel-btn") }}
              </button>
            </v-col>
          </v-row>
        </div>
        <cortx-has-access
          :to="$cortxUserPermissions.s3accounts + $cortxUserPermissions.create"
        >
          <button
            id="s3-addnewuserbtn"
            type="button"
            class="mt-4 mb-2 cortx-btn-primary"
            v-if="!showCreateAccountForm"
            @click="openCreateAccountForm()"
          >
            {{ $t("s3.account.add-new-account") }}
          </button>
        </cortx-has-access>
      </v-col>
    </v-row>

    <v-dialog
      v-model="showResetPasswordDialog"
      persistent
      max-width="500"
      id="s3-resetaccount-form"
    >
      <v-card>
        <v-card-title class="title mt-6 ml-3">
          <span>{{ $t("s3.account.reset-password") }}</span>
          <img
            id="close-reset-password-dialog"
            class="cortx-modal-close"
            :src="require('@/assets/close-green.svg')"
            @click="closeResetPasswordForm()"
          />
        </v-card-title>
        <v-divider />
        <v-col class="col-6 ml-7 pb-0">
          <div
            class="cortx-form-group"
            :class="{
              'cortx-form-group--error': $v.resetAccountForm.password.$error
            }"
          >
            <label
              class="cortx-form-group-label"
              for="user-password"
              id="iam-password-label"
            >
              <cortx-info-tooltip
                :label="$t('common.new-password-label')"
                :message="passwordTooltipMessage"
              />
            </label>
            <input
              class="cortx-form__input_text"
              type="password"
              id="user-password"
              name="user-password"
              v-model.trim="resetAccountForm.password"
              @input="$v.resetAccountForm.password.$touch"
            />
            <div class="cortx-form-group-label cortx-form-group-error-msg">
              <label
                id="iam-password-required-error"
                v-if="
                  $v.resetAccountForm.password.$dirty &&
                  !$v.resetAccountForm.password.required
                "
                >{{ $t("common.password-required") }}</label
              >
              <label
                id="iam-password-invalid-error"
                v-else-if="
                  $v.resetAccountForm.password.$dirty &&
                  !$v.resetAccountForm.password.passwordRegex
                "
                >{{ $t("common.invalid-password") }}</label
              >
            </div>
          </div>
        </v-col>
        <v-col class="col-6 ml-7 pt-0">
          <div
            class="cortx-form-group"
            :class="{
              'cortx-form-group--error':
                $v.resetAccountForm.confirmPassword.$error
            }"
          >
            <label
              class="cortx-form-group-label"
              for="confirm-password"
              id="iam-confirmpass-label"
              >{{ $t("common.confirm-password-label") }}</label
            >
            <input
              class="cortx-form__input_text"
              type="password"
              id="confirm-password"
              name="confirm-password"
              v-model.trim="resetAccountForm.confirmPassword"
              @input="$v.resetAccountForm.confirmPassword.$touch"
            />
            <span
              id="iam-confirmpass-notmatch-error"
              class="cortx-form-group-label cortx-form-group-error-msg"
              v-if="
                $v.resetAccountForm.confirmPassword.$dirty &&
                !$v.resetAccountForm.confirmPassword.sameAsPassword
              "
              >{{ $t("common.password-not-match") }}</span
            >
          </div>
        </v-col>
        <v-col class="col-6 ml-7 pb-6 pt-0">
          <button
            type="button"
            id="reset-password-button"
            class="cortx-btn-primary"
            @click="resetPassword()"
            :disabled="$v.resetAccountForm.$invalid"
          >
            {{ $t("s3.account.reset-btn") }}
          </button>
          <button
            type="button"
            id="cancel-button"
            class="cortx-btn-tertiary"
            @click="closeResetPasswordForm()"
          >
            {{ $t("s3.account.cancel-btn") }}
          </button>
        </v-col>
      </v-card>
    </v-dialog>

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

        <div class="mt-2 pl-7" style="height: 30px">
          <img
            class="cortx-float-l mr-1"
            :src="require('@/assets/actions/warning-orange.svg')"
          />
          <span
            id="s3-warning-text"
            class="cortx-float-l cortx-text-md cortx-text-bold cortx-text-warning mt-1"
            ><span>{{ $t("s3.account.save-info") }}</span></span
          >
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
          <tr v-if="!isS3UrlNone">
            <td
              class="py-2 cortx-text-bold credentials-item-label"
              id="s3-access-key-popup-label"
            >
              {{ $t("s3.account.url-label") }}
            </td>
            <td class="py-2">{{ s3Url[0] }}, {{ s3Url[1] }}</td>
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

        <div v-if="isS3UrlNone" class="pl-7">
          {{ $t("s3.account.url-note") }}
        </div>

        <v-card-actions>
          <a
            id="s3-download-csv"
            class="ma-5 cortx-btn-primary cortx-download-csv-link"
            :href="credentialsFileContent"
            download="credentials.csv"
            @click="downloadAndClose()"
            >{{ $t("s3.account.download-as-csv") }}</a
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <cortx-confirmation-dialog
      id="s3-confirmation-dialog"
      :show="showConfirmDeleteDialog"
      title="Confirmation"
      message="Are you sure you want to delete the account?"
      severity="warning"
      @closeDialog="closeConfirmDeleteDialog"
      cancelButtonText="No"
    ></cortx-confirmation-dialog>

    <cortx-confirmation-dialog
      id="s3-success-dialog"
      :show="showSuccessDialog"
      title="Success"
      :message="successMessage"
      @closeDialog="closeSuccessDialog"
      confirmButtonText="Ok"
      cancelButtonText=""
    ></cortx-confirmation-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
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
import i18n from "./s3.json";
import CommonUtils from "../../common/common-utils";
import { userPermissions } from "../../common/user-permissions-map"
import { ROLES } from "@/common/consts";
import LogoutMixin from "./../../mixins/logout";

@Component({
  name: "cortx-account-management",
  i18n: {
    messages: i18n
  },
  components: { CortxAccessKeyManagement }
})
export default class CortxAccountManagement extends Mixins(LogoutMixin) {
  public ROLES: any = ROLES;
  public createAccountForm = {
    account: {} as Account,
    confirmPassword: ""
  };

  public editAccountForm = {
    password: "",
    confirmPassword: ""
  };
  public resetAccountForm = {
    password: "",
    confirmPassword: ""
  };

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
    },
    editAccountForm: {
      password: { required, passwordRegex },
      confirmPassword: {
        sameAsPassword: sameAs("password")
      }
    },
    resetAccountForm: {
      password: { required, passwordRegex },
      confirmPassword: {
        sameAsPassword: sameAs("password")
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
  private s3Url = [];
  private showResetPasswordDialog: boolean;
  private resetAccoutName: string;
  private showSuccessDialog: boolean = false;
  private userData: any[];
  private loggedInUserName: string | null = "";
  private successMessage: string = "";
  private isResetPasswordAllowed: boolean = false;
  private isUpdatePasswordAllowed: boolean = false;
  private isDeleteAccountAllowed: boolean = false;

  private isS3UrlNone: boolean = true;

  constructor() {
    super();

    this.showCreateAccountForm = false;
    this.showAccountDetailsDialog = false;
    this.showConfirmDeleteDialog = false;
    this.showEditAccountForm = false;
    this.showResetPasswordDialog = false;
    this.loggedInUserName = localStorage.getItem("username");
    this.accountsTableHeaderList = [
      {
        text: "Account name",
        value: "account_name",
        sortable: false
      },
      {
        text: "Email",
        value: "account_email",
        sortable: false
      },
      {
        text: "Action",
        value: "data-table-expand"
      }
    ];
  }

  public async mounted() {
    await this.checkPermissions();
    await this.getAllAccounts();
  }

  public async getAllAccounts() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      this.$t("s3.account.loading-list")
    );
    const res: any = await Api.getAll(apiRegister.s3_account);
    this.accountsList = res && res.data ? res.data.s3_accounts : [];
    this.s3Url = res.data && res.data.s3_urls ? res.data.s3_urls : [];
    this.isS3UrlNone = this.s3Url.length === 0 || this.s3Url.filter((url:any) => url.includes("None")).length !== 0;
    this.$store.dispatch("systemConfig/hideLoader");
  }

  public async checkPermissions() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      this.$t("s3.account.loading-checking-permissions")
    );
    const vueInstance: any = this;
    if (vueInstance.$hasAccessToCsm(userPermissions.s3accounts + userPermissions.delete)) {
      this.isDeleteAccountAllowed = true;
    }
    if (vueInstance.$hasAccessToCsm(userPermissions.users + userPermissions.list)) {
      const cms_res = await Api.getAll(apiRegister.csm_user + "/" + this.loggedInUserName);
      if (cms_res && cms_res.data) {
        this.isResetPasswordAllowed = cms_res.data.role === this.ROLES.ADMIN
                                        || cms_res.data.role === this.ROLES.MANAGE;
      }
    } else if (vueInstance.$hasAccessToCsm(userPermissions.s3accounts + userPermissions.update)) {
      this.isUpdatePasswordAllowed = true;
    }
    this.$store.dispatch("systemConfig/hideLoader");
  }

  public async createAccount() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      this.$t("s3.account.loading-create")
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
      this.isS3UrlNone = true;
    }
    this.$store.dispatch("systemConfig/hideLoader");
    this.showAccountDetailsDialog = true;
  }

  public getCredentialsFileContent(): string {
    return (
      "Account name,S3 URL,Access key,Secret key,Account id,Canonical id\n" +
      this.account.account_name +
      "," +
      `${this.s3Url[0]} ${this.s3Url[1]}` +
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

  public onEditBtnClick(item: any) {
    this.showEditAccountForm = true;
    this.editAccoutName = item.account_name;
  }

  public async editAccount() {
    const updateDetails = {
      password: this.editAccountForm.password
    };
    this.$store.dispatch(
      "systemConfig/showLoader",
      this.$t("s3.account.loading-update")
    );
    const res = await Api.patch(
      apiRegister.s3_account,
      updateDetails,
      this.editAccoutName ? this.editAccoutName : ""
    );
    this.closeEditAccountForm();
    this.$store.dispatch("systemConfig/hideLoader");
  }

  public async closeAccountDetailsDialog() {
    this.clearCreateAccountForm();
    this.showAccountDetailsDialog = false;
    this.showCreateAccountForm = false;
    this.isCredentialsFileDownloaded = false;
    this.credentialsFileContent = "";
    await this.getAllAccounts();
  }

  public openCreateAccountForm() {
    this.showCreateAccountForm = true;
  }

  public closeCreateAccountForm() {
    this.clearCreateAccountForm();
    this.showCreateAccountForm = false;
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

  public openConfirmDeleteDialog(accountName: string) {
    this.accountToDelete = accountName;
    this.showConfirmDeleteDialog = true;
  }

  public closeEditAccountForm() {
    this.expanded = [];
    this.editAccountForm = {
      password: "",
      confirmPassword: ""
    };
    if (this.$v.editAccountForm) {
      this.$v.editAccountForm.$reset();
    }
    this.showEditAccountForm = !this.showEditAccountForm;
  }

  public async closeConfirmDeleteDialog(confirmation: boolean) {
    this.showConfirmDeleteDialog = false;
    if (confirmation) {
      await this.deleteAccount();
    }
    this.accountToDelete = "";
  }

  public onResetBtnClick(item: any) {
    this.showResetPasswordDialog = true;
    this.resetAccoutName = item.account_name;
  }

  public async resetPassword() {
    const updateDetails = {
      password: this.resetAccountForm.password
    };
    this.$store.dispatch(
      "systemConfig/showLoader",
      this.$t("s3.account.loading-update")
    );
    const res = await Api.patch(
      apiRegister.s3_account,
      updateDetails,
      this.resetAccoutName ? this.resetAccoutName : ""
    );
    this.closeResetPasswordForm();
    this.$store.dispatch("systemConfig/hideLoader");
    this.successMessage = `${this.$t("s3.account.password-reset-message")} ${
      res.data.account_name
    }`;
    this.showSuccessDialog = true;
  }

  public async closeSuccessDialog() {
    this.showSuccessDialog = false;
  }

  public closeResetPasswordForm() {
    this.resetAccountForm = {
      password: "",
      confirmPassword: ""
    };
    if (this.$v.resetAccountForm) {
      this.$v.resetAccountForm.$reset();
    }
    this.showResetPasswordDialog = false;
  }

  private async deleteAccount() {
    const vueInstance: any = this;
    this.$store.dispatch(
      "systemConfig/showLoader",
      "Deleting account " + this.accountToDelete
    );
    await Api.delete(apiRegister.s3_account, this.accountToDelete);
    if (
      (!vueInstance.$hasAccessToCsm(userPermissions.stats + userPermissions.list)) &&
      (vueInstance.$hasAccessToCsm(userPermissions.s3accounts + userPermissions.delete))
    ) {
      // S3 account user can delete her/his Account
      this.logout();
    } else if (vueInstance.$hasAccessToCsm(userPermissions.stats + userPermissions.list)) {
      // Admin can delete any user account..........
      this.getAllAccounts();
    }
  }

  private async copyS3Url(url: string) {
    CommonUtils.copyUrlToClipboard(url);
  }

  private async downloadAndClose() {
    this.isCredentialsFileDownloaded = true;
    this.showAccountDetailsDialog = false;
    this.showCreateAccountForm = false;
    this.clearCreateAccountForm();
    await this.getAllAccounts();
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
.wrapper-width {
  width: 70px;
}
.cortx-margin-r {
  margin-right: 10px
}
</style>