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
    <div
      id="s3-configuration-title-container"
      class="mt-2 s3-configuration-page-title"
    >
      <label id="s3-account-form-title" class="headline font-weight-bold"
        >S3 configuration</label
      >
      <eos-has-access
        :to="$eosUserPermissions.sysconfig + $eosUserPermissions.list"
      >
        <div class="mt-1" style="color: #454545;font-size: 14px;">
          <label>
            Create an S3 account. You must log in to the system using S3 account
            credentials to manage S3 account, IAM users, and buckets.
          </label>
        </div>
      </eos-has-access>

      <eos-has-access
        :to="$eosUserPermissions.s3iamusers + $eosUserPermissions.list"
      >
        <div class="mt-1" style="color: #454545;font-size: 14px;">
          <label>
            Manage IAM users and buckets.
          </label>
        </div>
      </eos-has-access>
    </div>
    <v-divider class="mt-2" />
    <v-row>
      <v-col class="py-0 pr-0 col-9">
        <eos-has-access
          :to="$eosUserPermissions.s3iamusers + $eosUserPermissions.list"
        >
          <v-data-table
            calculate-widths
            :items="usersList"
            item-key="user_name"
            class="eos-table"
            :hide-default-header="true"
            :hide-default-footer="true"
            :disable-pagination="true"
          >
            <template v-slot:header="{}">
              <tr>
                <th
                  v-for="header in usersTableHeaderList"
                  :key="header.text"
                  class="tableheader"
                >
                  <span>{{ header.text }}</span>
                </th>
                <th class="tableheader" />
              </tr>
            </template>

            <template v-slot:item="props">
              <tr>
                <td
                  @click.stop="handleRowClick(props.item)"
                  class="eos-cursor-pointer"
                >
                  {{ props.item.user_name }}
                </td>
                <td
                  @click.stop="handleRowClick(props.item)"
                  class="eos-cursor-pointer"
                >
                  {{ props.item.user_id }}
                </td>
                <td
                  @click.stop="handleRowClick(props.item)"
                  class="eos-cursor-pointer"
                >
                  {{ props.item.arn }}
                </td>
                <td>
                  <eos-has-access
                    :to="
                      $eosUserPermissions.s3iamusers +
                        $eosUserPermissions.delete
                    "
                  >
                    <img
                      @click="openConfirmDeleteDialog(props.item.user_name)"
                      class="eos-cursor-pointer"
                      src="./../../assets/actions/delete-green.svg"
                    />
                  </eos-has-access>
                </td>
              </tr>
            </template>
          </v-data-table>
        </eos-has-access>
        <eos-has-access
          :to="$eosUserPermissions.s3iamusers + $eosUserPermissions.list"
        >
          <cortx-access-key-management
            :userNameIAM="selectedIAMUser"
          ></cortx-access-key-management>
        </eos-has-access>
      </v-col>
      <v-col class="py-0 col-3">
        <div v-if="showCreateUserForm" class="pa-2">
          <v-row>
            <v-col class="pr-0 pb-0">
              <div
                class="eos-form-group-custom"
                :class="{
                  'eos-form-group--error':
                    $v.createUserForm.iamUser.user_name.$error
                }"
              >
                <label class="eos-form-group-label" for="userName">
                  <eos-info-tooltip
                    label="Username*"
                    :message="usernameTooltipMessage"
                  />
                </label>
                <input
                  class="eos-form__input_text"
                  type="text"
                  id="userName"
                  name="userName"
                  v-model.trim="createUserForm.iamUser.user_name"
                  @input="$v.createUserForm.iamUser.user_name.$touch"
                />
                <div class="eos-form-group-label eos-form-group-error-msg">
                  <label
                    v-if="
                      $v.createUserForm.iamUser.user_name.$dirty &&
                        !$v.createUserForm.iamUser.user_name.required
                    "
                    >Username is required.</label
                  >
                  <label
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
                class="eos-form-group-custom"
                :class="{
                  'eos-form-group--error':
                    $v.createUserForm.iamUser.password.$error
                }"
              >
                <label class="eos-form-group-label" for="userPassword">
                  <eos-info-tooltip
                    label="Password*"
                    :message="passwordTooltipMessage"
                  />
                </label>
                <input
                  class="eos-form__input_text"
                  type="password"
                  id="userPassword"
                  name="userPassword"
                  v-model.trim="createUserForm.iamUser.password"
                  @input="$v.createUserForm.iamUser.password.$touch"
                />
                <div class="eos-form-group-label eos-form-group-error-msg">
                  <label
                    v-if="
                      $v.createUserForm.iamUser.password.$dirty &&
                        !$v.createUserForm.iamUser.password.required
                    "
                    >Password is required.</label
                  >
                  <label
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
                class="eos-form-group-custom"
                :class="{
                  'eos-form-group--error':
                    $v.createUserForm.confirmPassword.$error
                }"
              >
                <label class="eos-form-group-label" for="confirmPassword"
                  >Confirm password*</label
                >
                <input
                  class="eos-form__input_text"
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  v-model.trim="createUserForm.confirmPassword"
                  @input="$v.createUserForm.confirmPassword.$touch"
                />
                <span
                  class="eos-form-group-label eos-form-group-error-msg"
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
                type="button"
                class="eos-btn-primary"
                @click="createUser()"
                :disabled="$v.createUserForm.$invalid"
              >
                Create user
              </button>
              <button
                type="button"
                class="eos-btn-tertiary"
                @click="closeCreateUserForm()"
              >
                Cancel
              </button>
            </v-col>
          </v-row>
        </div>
        <eos-has-access
          :to="$eosUserPermissions.s3iamusers + $eosUserPermissions.create"
        >
          <button
            type="button"
            class="mt-5 eos-btn-primary"
            v-if="!showCreateUserForm"
            @click="openCreateUserForm()"
          >
            Create
          </button>
        </eos-has-access>
      </v-col>
    </v-row>

    <v-dialog v-model="showUserDetailsDialog" persistent max-width="790">
      <v-card>
        <v-system-bar color="greay lighten-3">
          <v-spacer></v-spacer>
          <v-icon @click="closeUserDetailsDialog()" style="cursor: pointer;"
            >mdi-close</v-icon
          >
        </v-system-bar>
        <v-card-title class="title mt-6 ml-3">
          <img class="mr-2" :src="require('@/assets/resolved-default.svg')" />
          <span>User created:access key and secret key</span>
        </v-card-title>
        <v-divider />
        <div class="mt-2 pl-7" style="height: 30px;">
          <img
            class="eos-float-l mr-1"
            :src="require('@/assets/actions/warning-orange.svg')"
          />
          <span
            class="eos-float-l eos-text-md eos-text-bold eos-text-warning mt-1"
            >Save this information, you will not see it again. Download as CSV
            and close.</span
          >
        </div>
        <table class="mt-2 ml-7 eos-text-md">
          <tr>
            <td class="py-2 eos-text-bold credentials-item-label">Username</td>
            <td class="py-2">{{ user.user_name }}</td>
          </tr>
          <tr>
            <td class="py-2 eos-text-bold credentials-item-label">User id</td>
            <td class="py-2">{{ user.user_id }}</td>
          </tr>
          <tr>
            <td class="py-2 eos-text-bold credentials-item-label">ARN</td>
            <td class="py-2">{{ user.arn }}</td>
          </tr>
          <tr>
            <td class="py-2 eos-text-bold credentials-item-label">
              Access key
            </td>
            <td class="py-2">{{ user.access_key_id }}</td>
          </tr>
          <tr>
            <td class="py-2 eos-text-bold credentials-item-label">
              Secret key
            </td>
            <td class="py-2">{{ user.secret_key }}</td>
          </tr>
        </table>

        <v-card-actions>
          <a
            class="ma-5 eos-btn-primary eos-download-csv-link"
            :href="credentialsFileContent"
            download="credentials.csv"
            @click="isCredentialsFileDownloaded = true"
            >Download as CSV</a
          >
          <button
            :disabled="!isCredentialsFileDownloaded"
            type="button"
            class="ma-5 eos-btn-primary"
            @click="closeUserDetailsDialog()"
          >
            Ok
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <eos-confirmation-dialog
      :show="showConfirmDeleteDialog"
      title="Confirmation"
      message="Are you sure you want to delete the user?"
      severity="warning"
      @closeDialog="closeConfirmDeleteDialog"
      cancelButtonText="No"
    ></eos-confirmation-dialog>
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
  name: "eos-iam-user-management",
  components: { CortxAccessKeyManagement }
})
export default class EosIAMUserManagement extends Vue {
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
        // path: { required, iamPathRegex },
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
.eos-download-csv-link {
  text-decoration: none;
  display: inline-block;
  padding-top: 10px;
  color: #ffffff;
}
</style>
