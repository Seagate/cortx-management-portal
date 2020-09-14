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
                <th class="tableheader" />
              </tr>
            </template>

            <template v-slot:item="props">
              <tr
                id="iam-tabledata"
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
                    :message="usernameTooltipMessage"
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
                    >Username is required.</label
                  >
                  <label
                    id="iam-username-invalid"
                    v-else-if="
                      $v.createUserForm.iamUser.user_name.$dirty &&
                        !$v.createUserForm.iamUser.user_name.accountNameRegex
                    "
                    >Invalid username.</label
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
                    >Password is required.</label
                  >
                  <label
                    id="iam-password-invalid"
                    v-else-if="
                      $v.createUserForm.iamUser.password.$dirty &&
                        !$v.createUserForm.iamUser.password.passwordRegex
                    "
                    >Invalid password.</label
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
                  >Confirm password*</label
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
                  >Passwords do not match</span
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
                Create user
              </button>
              <button
                id="iam-usercancelbtn"
                type="button"
                class="cortx-btn-tertiary"
                @click="closeCreateUserForm()"
              >
                Cancel
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
            Create
          </button>
        </cortx-has-access>
      </v-col>
    </v-row>

    <v-dialog
      v-model="showUserDetailsDialog"
      persistent
      max-width="790"
      id="iam-opendialogbox"
    >
      <v-card>
        <v-system-bar color="greay lighten-3">
          <v-spacer></v-spacer>
          <v-icon
            @click="closeUserDetailsDialog()"
            style="cursor: pointer;"
            id="iam-closedialogbox"
            >mdi-close</v-icon
          >
        </v-system-bar>
        <v-card-title class="title mt-6 ml-3">
          <img class="mr-2" :src="require('@/assets/resolved-default.svg')" />
          <span id="iam-acceskeytext"
            >User created:access key and secret key</span
          >
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
            >Save this information, you will not see it again. Download as CSV
            and close.</span
          >
        </div>
        <table class="mt-2 ml-7 cortx-text-md" id="iam-user-data">
          <tr id="iam-username">
            <td class="py-2 cortx-text-bold credentials-item-label">
              Username
            </td>
            <td class="py-2">{{ user.user_name }}</td>
          </tr>
          <tr id="iam-userid">
            <td class="py-2 cortx-text-bold credentials-item-label">User id</td>
            <td class="py-2">{{ user.user_id }}</td>
          </tr>
          <tr id="iamARN">
            <td class="py-2 cortx-text-bold credentials-item-label">ARN</td>
            <td class="py-2">{{ user.arn }}</td>
          </tr>
          <tr id="iam-accesskeyid">
            <td class="py-2 cortx-text-bold credentials-item-label">
              Access key
            </td>
            <td class="py-2">{{ user.access_key_id }}</td>
          </tr>
          <tr id="iam-secretkey">
            <td class="py-2 cortx-text-bold credentials-item-label">
              Secret key
            </td>
            <td class="py-2">{{ user.secret_key }}</td>
          </tr>
        </table>

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
      message="Are you sure you want to delete the user?"
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
import {
  accountNameRegex,
  iamPathRegex,
  passwordRegex,
  passwordTooltipMessage,
  usernameTooltipMessage
} from "./../../common/regex-helpers";

@Component({
  name: "cortx-iam-user-management",
  components: { CortxAccessKeyManagement }
})
export default class CortxIAMUserManagement extends Vue {
  public createUserForm = {
    iamUser: {
      path: "/"
    } as IAMUser,
    confirmPassword: ""
  };

  @Validations()
  public validations = {
    createUserForm: {
      iamUser: {
        user_name: { required, accountNameRegex },
        password: { required, passwordRegex }
      },
      confirmPassword: {
        sameAsPassword: sameAs(() => {
          return this.createUserForm.iamUser.password;
        })
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
  private passwordTooltipMessage: string = passwordTooltipMessage;
  private usernameTooltipMessage: string = usernameTooltipMessage;
  private credentialsFileContent: string = "";
  private isCredentialsFileDownloaded: boolean = false;
  private selectedIAMUser: string = "";
  private itemsPerPage: number = 5;

  constructor() {
    super();
    this.showCreateUserForm = false;
    this.showUserDetailsDialog = false;
    this.showConfirmDeleteDialog = false;
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
      "User name,Access key,Secret key\n" +
      this.user.user_name +
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

  public async downloadAndClose() {
    this.isCredentialsFileDownloaded = true;
    this.clearCreateUserForm();
    this.showUserDetailsDialog = false;
    this.showCreateUserForm = false;
    await this.getAllUsers();
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
