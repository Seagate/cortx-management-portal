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
      :to="$cortxUserPermissions.s3iamusers + $cortxUserPermissions.list"
    >
      <div class="mt-2 pl-2">
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
      <v-col class="py-0 pr-0 col-9">
        <cortx-has-access
          :to="$cortxUserPermissions.s3iamusers + $cortxUserPermissions.list"
        >
          <v-data-table
            id="iam-datatable"
            calculate-widths
            :items="usersList"
            item-key="user_name"
            class="cortx-table"
            :hide-default-header="true"
            :items-per-page.sync="itemsPerPage"
          >
            <template v-slot:header="{}">
              <tr id="iam-tableheader">
                <th
                  v-for="header in usersTableHeaderList"
                  :key="header.text"
                  class="tableheader"
                >
                  <span id="iam-header-data">{{ header.text }}</span>
                </th>
              </tr>
            </template>

            <template v-slot:item="props">
              <tr
                :id="props.item.user_name"
                :class="{
                  'grey lighten-3': props.item.user_name === selectedIAMUser
                }"
                class="cortx-cursor-pointer"
              >
                <td @click.stop="handleRowClick(props.item)">
                  {{ props.item.user_name }}
                </td>
                <td @click.stop="handleRowClick(props.item)">
                  {{ props.item.user_id }}
                </td>
                <td @click.stop="handleRowClick(props.item)">
                  {{ props.item.arn }}
                </td>
                <td>
                  <cortx-has-access
                    :to="
                      $cortxUserPermissions.s3iamusers +
                        $cortxUserPermissions.delete
                    "
                  >
                    <img
                      id="iam-delete-user"
                      @click="openConfirmDeleteDialog(props.item.user_name)"
                      class="cortx-cursor-pointer"
                      src="./../../assets/actions/delete-green.svg"
                    />
                    <img
                      id="iam-reset-password"
                      v-on:click="onResetBtnClick(props.item.user_name)"
                      class="cortx-cursor-pointer"
                      src="@/assets/actions/edit-green.svg"
                    />
                  </cortx-has-access>
                </td>
              </tr>
            </template>
          </v-data-table>
          <cortx-has-access
            :to="$cortxUserPermissions.s3iamusers + $cortxUserPermissions.list"
          >
            <cortx-access-key-management
              :userNameIAM="selectedIAMUser"
              :s3Url="s3Url.toString()"
              :s3UrlNone="s3UrlNone"
            ></cortx-access-key-management>
          </cortx-has-access>
        </cortx-has-access>
      </v-col>
      <v-col class="py-0 col-3">
        <div v-if="showCreateUserForm" class="pa-2">
          <v-row>
            <v-col class="pr-0 pb-0">
              <div
                class="cortx-form-group-custom"
                :class="{
                  'cortx-form-group--error':
                    $v.createUserForm.iamUser.user_name.$error
                }"
              >
                <label
                  class="cortx-form-group-label"
                  for="userName"
                  id="iam-userlbl"
                >
                  <cortx-info-tooltip
                    label="Username*"
                    :message="iamUsernameTooltipMessage"
                  />
                </label>
                <input
                  class="cortx-form__input_text"
                  type="text"
                  id="userName"
                  name="userName"
                  v-model.trim="createUserForm.iamUser.user_name"
                  @input="$v.createUserForm.iamUser.user_name.$touch"
                />
                <div class="cortx-form-group-label cortx-form-group-error-msg">
                  <label
                    id="iam-usernamename-required"
                    v-if="
                      $v.createUserForm.iamUser.user_name.$dirty &&
                        !$v.createUserForm.iamUser.user_name.required
                    "
                    >{{ $t("s3.iam.user-name-required") }}</label
                  >
                  <label
                    id="iam-username-invalid"
                    v-else-if="
                      $v.createUserForm.iamUser.user_name.$dirty &&
                        !$v.createUserForm.iamUser.user_name.iamUserNameRegex
                    "
                    >{{ $t("s3.iam.invalid-user") }}</label
                  >
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pr-0 pb-0">
              <div
                class="cortx-form-group-custom"
                :class="{
                  'cortx-form-group--error':
                    $v.createUserForm.iamUser.password.$error
                }"
              >
                <label
                  class="cortx-form-group-label"
                  for="userPassword"
                  id="iam-passwordlbl"
                >
                  <cortx-info-tooltip
                    label="Password*"
                    :message="passwordTooltipMessage"
                  />
                </label>
                <input
                  class="cortx-form__input_text"
                  type="password"
                  id="userPassword"
                  name="userPassword"
                  v-model.trim="createUserForm.iamUser.password"
                  @input="$v.createUserForm.iamUser.password.$touch"
                />
                <div class="cortx-form-group-label cortx-form-group-error-msg">
                  <label
                    id="iam-password-required"
                    v-if="
                      $v.createUserForm.iamUser.password.$dirty &&
                        !$v.createUserForm.iamUser.password.required
                    "
                    >{{ $t("common.password-required") }}</label
                  >
                  <label
                    id="iam-password-invalid"
                    v-else-if="
                      $v.createUserForm.iamUser.password.$dirty &&
                        !$v.createUserForm.iamUser.password.passwordRegex
                    "
                    >{{ $t("common.invalid-pass") }}</label
                  >
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pr-0">
              <div
                class="cortx-form-group-custom"
                :class="{
                  'cortx-form-group--error':
                    $v.createUserForm.confirmPassword.$error
                }"
              >
                <label
                  class="cortx-form-group-label"
                  for="confirmPassword"
                  id="iam-confirmpasslbl"
                  >{{ $t("common.confirm-pass-label") }}</label
                >
                <input
                  class="cortx-form__input_text"
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  v-model.trim="createUserForm.confirmPassword"
                  @input="$v.createUserForm.confirmPassword.$touch"
                />
                <span
                  id="iam-confirmpass-notmatch"
                  class="cortx-form-group-label cortx-form-group-error-msg"
                  v-if="
                    $v.createUserForm.confirmPassword.$dirty &&
                      !$v.createUserForm.confirmPassword.sameAsPassword
                  "
                  >{{ $t("common.pass-not-match") }}</span
                >
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <button
                id="iam-create-userbtn"
                type="button"
                class="cortx-btn-primary"
                @click="createUser()"
                :disabled="$v.createUserForm.$invalid"
              >
                {{ $t("s3.iam.create-user-btn") }}
              </button>
              <button
                id="iam-usercancelbtn"
                type="button"
                class="cortx-btn-tertiary"
                @click="closeCreateUserForm()"
              >
                {{ $t("common.cancel-btn") }}
              </button>
            </v-col>
          </v-row>
        </div>
        <cortx-has-access
          :to="$cortxUserPermissions.s3iamusers + $cortxUserPermissions.create"
        >
          <button
            id="iam-user-create-formbtn"
            type="button"
            class="mt-4 cortx-btn-primary"
            v-if="!showCreateUserForm"
            @click="openCreateUserForm()"
          >
            {{ $t("common.create-btn") }}
          </button>
        </cortx-has-access>
      </v-col>
    </v-row>
    <v-dialog 
      v-model="showResetAccountForm" 
      persistent
      max-width="500" 
      id="s3-resetaccount-form">
      <v-card>
        <v-card-title class="title mt-6 ml-3">
          <span>{{ $t("s3.account.reset-password") }}</span>
          <img id="close-reset-password-dialog"
            class="cortx-modal-close"
            :src="require('@/assets/close-green.svg')"
            @click="closeResetPasswordForm()"
          />
        </v-card-title>        
        <v-divider />
            <v-col class="col-6 ml-7">
              <div
                class="cortx-form-group-custom"
                :class="{
                  'cortx-form-group--error':
                    $v.resetAccountForm.password.$error
                }"
              >
                <label
                  class="cortx-form-group-label"
                  for="userPassword"
                  id="iam-passwordlbl"
                >
                  <cortx-info-tooltip
                    label="Password*"
                    :message="passwordTooltipMessage"
                  />
                </label>
                <input
                  class="cortx-form__input_text"
                  type="password"
                  id="userPassword"
                  name="userPassword"
                  v-model.trim="resetAccountForm.password"
                  @input="$v.resetAccountForm.password.$touch"
                />
                <div class="cortx-form-group-label cortx-form-group-error-msg">
                  <label
                    id="iam-password-required"
                    v-if="
                      $v.resetAccountForm.password.$dirty &&
                        !$v.resetAccountForm.password.required
                    "
                    >{{ $t("common.password-required") }}</label
                  >
                  <label
                    id="iam-password-invalid"
                    v-else-if="
                      $v.resetAccountForm.password.$dirty &&
                        !$v.resetAccountForm.password.passwordRegex
                    "
                    >{{ $t("common.invalid-pass") }}</label
                  >
                </div>
              </div>
            </v-col>
            <v-col class="col-6 ml-7">
              <div
                class="cortx-form-group-custom"
                :class="{
                  'cortx-form-group--error':
                    $v.resetAccountForm.confirmPassword.$error
                }"
              >
                <label
                  class="cortx-form-group-label"
                  for="confirmPassword"
                  id="iam-confirmpasslbl"
                  >{{ $t("common.confirm-pass-label") }}</label
                >
                <input
                  class="cortx-form__input_text"
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  v-model.trim="resetAccountForm.confirmPassword"
                  @input="$v.resetAccountForm.confirmPassword.$touch"
                />
                <span
                  id="iam-confirmpass-notmatch"
                  class="cortx-form-group-label cortx-form-group-error-msg"
                  v-if="
                    $v.resetAccountForm.confirmPassword.$dirty &&
                      !$v.resetAccountForm.confirmPassword.sameAsPassword
                  "
                  >{{ $t("common.pass-not-match") }}</span
                >
              </div>
            </v-col>
            <v-col class="col-6 ml-7">
              <button
                type="button"
                id="btnResetPassword"
                class="cortx-btn-primary"
                @click="resetPassword()"
                :disabled="$v.resetAccountForm.$invalid"
              >
                {{ $t("s3.account.reset-btn") }}
              </button>
              <button
                type="button"
                id="btncancelResetpass"
                class="cortx-btn-tertiary"
                @click="closeResetPasswordForm()"
              >
                {{ $t("s3.account.cancel-btn") }}
              </button>
            </v-col>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="showUserDetailsDialog"
      persistent
      max-width="790"
      id="iam-opendialogbox"
    >
      <v-card>
        <v-card-title class="title mt-6 ml-3">
          <img class="mr-2" :src="require('@/assets/resolved-default.svg')" />
          <span id="iam-acceskeytext">{{ $t("s3.iam.user-key-access") }}</span>
        </v-card-title>
        <v-divider />
        <div class="mt-2 pl-7" style="height: 30px;">
          <img
            class="cortx-float-l mr-1"
            :src="require('@/assets/actions/warning-orange.svg')"
          />
          <span
            id="iam-csvfileinfo"
            class="cortx-float-l cortx-text-md cortx-text-bold cortx-text-warning mt-1"
            >{{ $t("s3.download-csv-dialog.message") }}</span
          >
        </div>
        <table class="mt-2 ml-7 cortx-text-md" id="iam-user-data">
          <tr id="iam-username">
            <td class="py-2 cortx-text-bold credentials-item-label">
              {{ $t("s3.access-key.table-headers.user_name") }}
            </td>
            <td class="py-2">{{ user.user_name }}</td>
          </tr>
          <tr id="iam-userid">
            <td class="py-2 cortx-text-bold credentials-item-label">
              {{ $t("s3.access-key.table-headers.user_id") }}
            </td>
            <td class="py-2">{{ user.user_id }}</td>
          </tr>
          <tr v-if="!s3UrlNone">
            <td class="py-2 cortx-text-bold credentials-item-label">
              {{ $t("s3.account.s3-url") }}
            </td>
            <td class="py-2">{{ s3Url[0] }}, {{ s3Url[1] }}</td>
          </tr>
          <tr id="iamARN">
            <td class="py-2 cortx-text-bold credentials-item-label">
              {{ $t("s3.access-key.table-headers.arn") }}
            </td>
            <td class="py-2">{{ user.arn }}</td>
          </tr>
          <tr id="iam-accesskeyid">
            <td class="py-2 cortx-text-bold credentials-item-label">
              {{ $t("s3.access-key.table-headers.access_key") }}
            </td>
            <td class="py-2">{{ user.access_key_id }}</td>
          </tr>
          <tr id="iam-secretkey">
            <td class="py-2 cortx-text-bold credentials-item-label">
              {{ $t("s3.access-key.table-headers.secret_key") }}
            </td>
            <td class="py-2">{{ user.secret_key }}</td>
          </tr>
        </table>

        <div v-if="s3UrlNone" class="pl-7">{{ $t("s3.account.url-note") }}</div>
        <v-card-actions>
          <a
            id="iam-downloadcsvfile"
            class="ma-5 cortx-btn-primary cortx-download-csv-link"
            :href="credentialsFileContent"
            download="credentials.csv"
            @click="downloadAndClose()"
            >Download and close</a
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <cortx-confirmation-dialog
      id="iam-confirmation-dialogbox"
      :show="showConfirmDeleteDialog"
      title="Confirmation"
      :message="iamConfirmMsg"
      severity="warning"
      @closeDialog="closeConfirmDeleteDialog"
      cancelButtonText="No"
    ></cortx-confirmation-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Validations } from "vuelidate-property-decorators";
import { required, helpers, sameAs } from "vuelidate/lib/validators";
import { IAMUser } from "../../models/s3";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import CortxAccessKeyManagement from "./access-key-management-iam.vue";
import CommonUtils from "../../common/common-utils";
import {
  iamUserNameRegex,
  iamPathRegex,
  passwordRegex,
  passwordTooltipMessage,
  iamUsernameTooltipMessage
} from "./../../common/regex-helpers";
import i18n from "./s3.json";

@Component({
  name: "cortx-iam-user-management",
  components: { CortxAccessKeyManagement },
  i18n: {
    messages: i18n
  }
})
export default class CortxIAMUserManagement extends Vue {
  public createUserForm = {
    iamUser: {
      path: "/"
    } as IAMUser,
    confirmPassword: ""
  };
  public iamConfirmMsg: string = "";
  public resetAccountForm = {
    password: "",
    confirmPassword: ""
  };

  @Validations()
  public validations = {
    createUserForm: {
      iamUser: {
        user_name: { required, iamUserNameRegex },
        password: { required, passwordRegex }
      },
      confirmPassword: {
        sameAsPassword: sameAs(() => {
          return this.createUserForm.iamUser.password;
        })
      }
    },
    resetAccountForm: {
      password: { required, passwordRegex },
      confirmPassword: {
        sameAsPassword: sameAs("password")
      }
    }
  };

  private showCreateUserForm: boolean;
  private showUserDetailsDialog: boolean;
  private showConfirmDeleteDialog: boolean;
  private account: Account = {} as Account;
  private usersTableHeaderList: any[];
  private usersList: IAMUser[] = [];
  private user: IAMUser;
  private userToDelete: string = "";
  private passwordTooltipMessage = passwordTooltipMessage;
  private iamUsernameTooltipMessage = iamUsernameTooltipMessage;
  private credentialsFileContent: string = "";
  private isCredentialsFileDownloaded: boolean = false;
  private selectedIAMUser: string = "";
  private itemsPerPage: number = 5;
  private s3Url = [];
  private s3UrlNone: boolean = false;  
  private showResetAccountForm: boolean;
  private resetAccoutName: string;

  constructor() {
    super();
    this.showCreateUserForm = false;
    this.showUserDetailsDialog = false;
    this.showConfirmDeleteDialog = false;
    this.showResetAccountForm = false;
    this.usersTableHeaderList = [
      {
        text: "Username",
        value: "user_name",
        sortable: false
      },
      {
        text: "User id",
        value: "user_id",
        sortable: false
      },
      {
        text: "ARN",
        value: "arn",
        sortable: false
      },
      {
        text: "Action",
        value: "data-table-expand"
      }
    ];

    this.user = {} as IAMUser;
  }

  public async mounted() {
    await this.getAllUsers();
  }

  public async getAllUsers() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      "Fetching all IAM users..."
    );
    const res: any = await Api.getAll(apiRegister.s3_iam_user);
    this.usersList = res && res.data ? res.data.iam_users : [];
    this.s3Url = res && res.data.s3_urls ? res.data.s3_urls : [];
    if (this.s3Url[0] === "http://None") {
      this.s3UrlNone = true;
    }
    this.selectedIAMUser = this.usersList.length
      ? this.usersList[0].user_name
      : "";
    this.$store.dispatch("systemConfig/hideLoader");
  }

  public async createUser() {
    this.$store.dispatch("systemConfig/showLoader", "Creating IAM user...");
    const tempUser = this.createUserForm.iamUser;
    tempUser.require_reset = true;
    const res: any = await Api.post(apiRegister.s3_iam_user, tempUser);
    if (!res.error) {
      this.user = res.data;
      this.isCredentialsFileDownloaded = false;
      this.credentialsFileContent =
        "data:text/plain;charset=utf-8," +
        encodeURIComponent(this.getCredentialsFileContent());
    }
    this.$store.dispatch("systemConfig/hideLoader");
    this.showUserDetailsDialog = true;
  }
  public getCredentialsFileContent(): string {
    return (
      "User name,User id,S3 URL,ARN,Access key,Secret key\n" +
      this.user.user_name +
      "," +
      this.user.user_id +
      "," +
      `${this.s3Url[0]} ${this.s3Url[1]}` +
      "," +
      this.user.arn +
      "," +
      this.user.access_key_id +
      "," +
      this.user.secret_key
    );
  }

  public async closeUserDetailsDialog() {
    this.clearCreateUserForm();
    this.showUserDetailsDialog = false;
    this.showCreateUserForm = false;
    this.isCredentialsFileDownloaded = false;
    await this.getAllUsers();
  }

  public openCreateUserForm() {
    this.showCreateUserForm = true;
  }

  public closeCreateUserForm() {
    this.clearCreateUserForm();
    this.showCreateUserForm = false;
  }

  public clearCreateUserForm() {
    this.user = {} as IAMUser;
    this.createUserForm = {
      iamUser: {
        path: "/"
      } as IAMUser,
      confirmPassword: ""
    };
    if (this.$v.createUserForm) {
      this.$v.createUserForm.$reset();
    }
  }

  public openConfirmDeleteDialog(username: string) {
    this.iamConfirmMsg = `${this.$t("s3.iam.confirm-msg")} ${username}?`;
    this.userToDelete = username;
    this.showConfirmDeleteDialog = true;
  }

  public async closeConfirmDeleteDialog(confirmation: boolean) {
    this.showConfirmDeleteDialog = false;
    if (confirmation) {
      await this.deleteUser();
    }
    this.userToDelete = "";
  }

  public async deleteUser() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      "Deleting user " + this.userToDelete
    );
    this.userToDelete = encodeURI(this.userToDelete);
    await Api.delete(apiRegister.s3_iam_user, this.userToDelete);
    this.$store.dispatch("systemConfig/hideLoader");
    await this.getAllUsers();
  }

  public handleRowClick(item: any) {
    this.selectedIAMUser = item.user_name;
  }
  public async copyS3Url(url: string) {
    CommonUtils.copyUrlToClipboard(url);
  }

  public async downloadAndClose() {
    this.isCredentialsFileDownloaded = true;
    this.clearCreateUserForm();
    this.showUserDetailsDialog = false;
    this.showCreateUserForm = false;
    await this.getAllUsers();
  }
  
  public onResetBtnClick(item: any) {
    this.showResetAccountForm = true;
    this.resetAccoutName = item;
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
      apiRegister.s3_iam_user,
      updateDetails,
      this.resetAccoutName ? this.resetAccoutName : ""
    );
    this.closeResetPasswordForm();
    this.$store.dispatch("systemConfig/hideLoader");
  }
  public closeResetPasswordForm() {
    this.resetAccountForm = {
      password: "",
      confirmPassword: ""
    };
    if (this.$v.resetAccountForm) {
      this.$v.resetAccountForm.$reset();
    }
    this.showResetAccountForm = !this.showResetAccountForm;
  }
}
</script>
<style lang="scss" scoped>
.delete-user-confirmation-msg {
  color: #000;
  font-size: 16px;
}
.credentials-item-label {
  width: 10rem;
}
.cortx-download-csv-link {
  text-decoration: none;
  display: inline-block;
  padding-top: 10px;
  color: #ffffff;
}
</style>
