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
      <cortx-has-access
        :to="$cortxUserPermissions.sysconfig + $cortxUserPermissions.list"
      >
        <div class="mt-1" style="color: #454545;font-size: 14px;">
          <label>
            Create an S3 account. You must log in to the system using S3 account
            credentials to manage S3 account, IAM users, and buckets.
          </label>
        </div>
      </cortx-has-access>

      <cortx-has-access
        :to="$cortxUserPermissions.s3iamusers + $cortxUserPermissions.list"
      >
        <div class="mt-1" style="color: #454545;font-size: 14px;">
          <label>
            Manage IAM users and buckets.
          </label>
        </div>
      </cortx-has-access>
    </div>
    <v-divider class="mt-2" />
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
              <div style="width: 90px;">
                <cortx-has-access
                  class="mx-2"
                  :to="
                    $cortxUserPermissions.s3accounts + $cortxUserPermissions.update
                  "
                >
                  <img
                    v-on:click="onEditBtnClick(item)"
                    class="cortx-cursor-pointer"
                    src="@/assets/actions/edit-green.svg"
                  />
                </cortx-has-access>
                <cortx-has-access
                  class="mx-2"
                  :to="
                    $cortxUserPermissions.s3accounts + $cortxUserPermissions.delete
                  "
                >
                  <img
                    @click="openConfirmDeleteDialog(item.account_name)"
                    class="cortx-cursor-pointer"
                    src="@/assets/actions/delete-green.svg"
                  />
                </cortx-has-access>
              </div>
            </template>
          </v-data-table>
        </cortx-has-access>

        <cortx-has-access
          :to="$cortxUserPermissions.s3iamusers + $cortxUserPermissions.list"
        >
          <cortx-access-key-management></cortx-access-key-management>
        </cortx-has-access>
      </v-col>
      <v-col class="py-0 col-5">
        <div v-if="showCreateAccountForm" class="pa-2">
          <v-row>
            <v-col class="pl-4 col-6 pb-0">
              <div
                class="cortx-form-group-custom"
                :class="{
                  'cortx-form-group--error':
                    $v.createAccountForm.account.account_name.$error
                }"
              >
                <label class="cortx-form-group-label" for="accountName">
                  <cortx-info-tooltip
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
                    v-if="
                      $v.createAccountForm.account.account_name.$dirty &&
                        !$v.createAccountForm.account.account_name.required
                    "
                    >Account name is required.</label
                  >
                  <label
                    v-else-if="
                      $v.createAccountForm.account.account_name.$dirty &&
                        !$v.createAccountForm.account.account_name
                          .accountNameRegex
                    "
                    >Invalid account name.</label
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
                <label class="cortx-form-group-label" for="accountEmail"
                  >Email*</label
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
                    v-if="
                      $v.createAccountForm.account.account_email.$dirty &&
                        !$v.createAccountForm.account.account_email.required
                    "
                    >Email id is required.</label
                  >
                  <label
                    v-else-if="
                      $v.createAccountForm.account.account_email.$dirty &&
                        !$v.createAccountForm.account.account_email.email
                    "
                    >Invalid email id.</label
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
                <label class="cortx-form-group-label" for="accountPassword">
                  <cortx-info-tooltip
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
                    v-if="
                      $v.createAccountForm.account.password.$dirty &&
                        !$v.createAccountForm.account.password.required
                    "
                    >Password is required.</label
                  >
                  <label
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
                <label class="cortx-form-group-label" for="confirmPassword"
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
                type="button"
                class="cortx-btn-primary"
                @click="createAccount()"
                :disabled="$v.createAccountForm.$invalid"
              >
                Create account
              </button>
              <button
                type="button"
                class="cortx-btn-tertiary"
                @click="closeCreateAccountForm()"
              >
                Cancel
              </button>
            </v-col>
          </v-row>
        </div>
        <div v-if="showEditAccountForm" class="pa-2">
          <v-row>
            <v-col class="pb-0">
              <div
                class="cortx-form-group-custom"
                :class="{
                  'cortx-form-group--error': $v.editAccountForm.password.$error
                }"
              >
                <label class="cortx-form-group-label" for="accountPasswordEdit">
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
                    v-if="
                      $v.editAccountForm.password.$dirty &&
                        !$v.editAccountForm.password.required
                    "
                    >Password is required.</label
                  >
                  <label
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
                <label class="cortx-form-group-label" for="confirmPasswordEdit"
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
                Update
              </button>
              <button
                type="button"
                id="btncancelEditpass"
                class="cortx-btn-tertiary"
                @click="closeEditAccountForm()"
              >
                Cancel
              </button>
            </v-col>
          </v-row>
        </div>
        <cortx-has-access
          :to="$cortxUserPermissions.s3accounts + $cortxUserPermissions.create"
        >
          <button
            type="button"
            class="mt-4 mb-2 cortx-btn-primary"
            v-if="!showCreateAccountForm"
            @click="openCreateAccountForm()"
          >
            Add new account
          </button>
        </cortx-has-access>
      </v-col>
    </v-row>

    <v-dialog v-model="showAccountDetailsDialog" persistent max-width="790">
      <v-card>
        <v-system-bar color="greay lighten-3">
          <v-spacer></v-spacer>
          <v-icon @click="closeAccountDetailsDialog()" style="cursor: pointer;"
            >mdi-close</v-icon
          >
        </v-system-bar>
        <v-card-title class="title mt-6 ml-3">
          <img class="mr-2" :src="require('@/assets/resolved-default.svg')" />
          <span>Account created: access key and secret key</span>
        </v-card-title>
        <v-divider />

        <div class="mt-2 pl-7" style="height: 30px;">
          <img
            class="cortx-float-l mr-1"
            :src="require('@/assets/actions/warning-orange.svg')"
          />
          <span
            class="cortx-float-l cortx-text-md cortx-text-bold cortx-text-warning mt-1"
            >Save this information, you will not see it again. Download as CSV
            and close.</span
          >
        </div>

        <table class="mt-2 ml-7 cortx-text-md">
          <tr>
            <td class="py-2 cortx-text-bold credentials-item-label">
              Account name
            </td>
            <td class="py-2">{{ account.account_name }}</td>
          </tr>
          <tr>
            <td class="py-2 cortx-text-bold credentials-item-label">
              Access key
            </td>
            <td class="py-2">{{ account.access_key }}</td>
          </tr>
          <tr>
            <td class="py-2 cortx-text-bold credentials-item-label">
              Secret key
            </td>
            <td class="py-2">{{ account.secret_key }}</td>
          </tr>
        </table>

        <v-card-actions>
          <a
            class="ma-5 cortx-btn-primary cortx-download-csv-link"
            :href="credentialsFileContent"
            download="credentials.csv"
            @click="isCredentialsFileDownloaded = true"
            >Download as CSV</a
          >
          <button
            :disabled="!isCredentialsFileDownloaded"
            type="button"
            class="ma-5 cortx-btn-primary"
            @click="closeAccountDetailsDialog()"
          >
            Ok
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <cortx-confirmation-dialog
      :show="showConfirmDeleteDialog"
      title="Confirmation"
      message="Are you sure you want to delete the account?"
      severity="warning"
      @closeDialog="closeConfirmDeleteDialog"
      cancelButtonText="No"
    ></cortx-confirmation-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
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

@Component({
  name: "cortx-account-management",
  components: { CortxAccessKeyManagement }
})
export default class CortxAccountManagement extends Vue {
  public createAccountForm = {
    account: {} as Account,
    confirmPassword: ""
  };

  public editAccountForm = {
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
  private passwordTooltipMessage: string = passwordTooltipMessage;
  private accountNameTooltipMessage: string = accountNameTooltipMessage;
  private isCredentialsFileDownloaded: boolean = false;
  private credentialsFileContent: string = "";
  private showEditAccountForm: boolean;
  private editAccoutName: string;

  constructor() {
    super();

    this.showCreateAccountForm = false;
    this.showAccountDetailsDialog = false;
    this.showConfirmDeleteDialog = false;
    this.showEditAccountForm = false;
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
      { text: "", value: "data-table-expand" }
    ];
  }

  public async mounted() {
    await this.getAllAccounts();
  }

  public async getAllAccounts() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      "Fetching all S3 accounts..."
    );
    const res: any = await Api.getAll(apiRegister.s3_account);
    this.accountsList = res && res.data ? res.data.s3_accounts : [];
    this.$store.dispatch("systemConfig/hideLoader");
  }

  public async createAccount() {
    this.$store.dispatch("systemConfig/showLoader", "Creating account...");
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
      "Account name,Access key,Secret key\n" +
      this.account.account_name +
      "," +
      this.account.access_key +
      "," +
      this.account.secret_key
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
    this.$store.dispatch("systemConfig/showLoader", "Updating account...");
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
  private async deleteAccount() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      "Deleting account " + this.accountToDelete
    );
    await Api.delete(apiRegister.s3_account, this.accountToDelete);
    this.$store.dispatch("systemConfig/hideLoader");
    this.$router.push("/login");
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
</style>
