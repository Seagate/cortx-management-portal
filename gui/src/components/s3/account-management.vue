<template>
  <div>
    <div v-if="showCreateAccountForm" class="pa-2">
      <v-row>
        <v-col class="py-0 pr-0">
          <div
            class="eos-form-group"
            :class="{
              'eos-form-group--error':
                $v.createAccountForm.account.account_name.$error
            }"
          >
            <label class="eos-form-group-label" for="accountName">
              <eos-info-tooltip
                label="Account name*"
                :message="accountNameTooltipMessage"
              />
            </label>
            <input
              class="eos-form__input_text"
              type="text"
              id="accountName"
              name="accountName"
              v-model.trim="createAccountForm.account.account_name"
              @input="$v.createAccountForm.account.account_name.$touch"
            />
            <div class="eos-form-group-label eos-form-group-error-msg">
              <label
                v-if="
                  $v.createAccountForm.account.account_name.$dirty &&
                    !$v.createAccountForm.account.account_name.required
                "
                >Account name is required</label
              >
              <label
                v-else-if="
                  $v.createAccountForm.account.account_name.$dirty &&
                    !$v.createAccountForm.account.account_name.accountNameRegex
                "
                >Invalid account name</label
              >
            </div>
          </div>
        </v-col>
        <v-col class="py-0 pl-0">
          <div
            class="eos-form-group"
            :class="{
              'eos-form-group--error':
                $v.createAccountForm.account.account_email.$error
            }"
          >
            <label class="eos-form-group-label" for="accountEmail"
              >Email id*</label
            >
            <input
              class="eos-form__input_text"
              type="text"
              id="accountEmail"
              name="accountEmail"
              v-model.trim="createAccountForm.account.account_email"
              @input="$v.createAccountForm.account.account_email.$touch"
            />
            <div class="eos-form-group-label eos-form-group-error-msg">
              <label
                v-if="
                  $v.createAccountForm.account.account_email.$dirty &&
                    !$v.createAccountForm.account.account_email.required
                "
                >Email id is required</label
              >
              <label
                v-else-if="
                  $v.createAccountForm.account.account_email.$dirty &&
                    !$v.createAccountForm.account.account_email.email
                "
                >Invalid email id</label
              >
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="py-0 pr-0">
          <div
            class="eos-form-group"
            :class="{
              'eos-form-group--error':
                $v.createAccountForm.account.password.$error
            }"
          >
            <label class="eos-form-group-label" for="accountPassword">
              <eos-info-tooltip
                label="Password*"
                :message="passwordTooltipMessage"
              />
            </label>
            <input
              class="eos-form__input_text"
              type="password"
              id="accountPassword"
              name="accountPassword"
              v-model.trim="createAccountForm.account.password"
              @input="$v.createAccountForm.account.password.$touch"
            />
            <div class="eos-form-group-label eos-form-group-error-msg">
              <label
                v-if="
                  $v.createAccountForm.account.password.$dirty &&
                    !$v.createAccountForm.account.password.required
                "
                >Password is required</label
              >
              <label
                v-else-if="
                  $v.createAccountForm.account.password.$dirty &&
                    !$v.createAccountForm.account.password.passwordRegex
                "
                >Invalid password</label
              >
            </div>
          </div>
        </v-col>
        <v-col class="py-0 pl-0">
          <div
            class="eos-form-group"
            :class="{
              'eos-form-group--error':
                $v.createAccountForm.confirmPassword.$error
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
              v-model.trim="createAccountForm.confirmPassword"
              @input="$v.createAccountForm.confirmPassword.$touch"
            />
            <span
              class="eos-form-group-label eos-form-group-error-msg"
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
            class="eos-btn-primary"
            @click="createAccount()"
            :disabled="$v.createAccountForm.$invalid"
          >
            Create account
          </button>
          <button
            type="button"
            class="eos-btn-tertiary"
            @click="closeCreateAccountForm()"
          >
            Cancel
          </button>
        </v-col>
      </v-row>
    </div>
    <eos-has-access
      :to="$eosUserPermissions.s3accounts + $eosUserPermissions.create"
    >
      <button
        type="button"
        class="mt-2 mb-2 eos-btn-primary"
        v-if="!showCreateAccountForm"
        @click="openCreateAccountForm()"
      >
        Create
      </button>
    </eos-has-access>
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
        <v-row class="mx-4">
          <v-col cols="8">
            <span>Save this information, you will not see it again.</span>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>

        <table class="mx-7">
          <tr style>
            <th style="width:15rem;height:6rem;text-align: left">
              Account name
            </th>
            <th style="width:24.2rem;text-align: left">Access key</th>
            <th style="width:5rem;text-align: left">Secret key</th>
          </tr>
          <tr>
            <td style="width:15rem;height:2rem;text-align: left">
              {{ account.account_name }}
            </td>
            <td>{{ account.access_key }}</td>
            <td>{{ account.secret_key }}</td>
          </tr>
        </table>

        <v-card-actions>
          <button
            type="button"
            class="ma-5 eos-btn-primary"
            @click="closeAccountDetailsDialog()"
          >
            Ok
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <eos-has-access
      :to="$eosUserPermissions.s3accounts + $eosUserPermissions.list"
    >
      <v-data-table
        :headers="accountsTableHeaderList"
        :items="accountsList"
        :expanded.sync="expanded"
        v-bind:single-expand="true"
        item-key="account_name"
        class="eos-table"
        show-expand
        :hide-default-header="true"
        :hide-default-footer="true"
        :disable-pagination="true"
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
        <template v-slot:expanded-item="props">
          <td colspan="3" style="background: #FFFFFF;">
            <v-row>
              <v-col class="pb-0">
                <div
                  class="eos-form-group"
                  :class="{
                    'eos-form-group--error': $v.editAccountForm.password.$error
                  }"
                >
                  <label class="eos-form-group-label" for="accountPasswordEdit">
                    <eos-info-tooltip
                      label="Password*"
                      :message="passwordTooltipMessage"
                    />
                  </label>
                  <input
                    class="eos-form__input_text"
                    type="password"
                    id="accountPasswordEdit"
                    name="accountPasswordEdit"
                    v-model.trim="editAccountForm.password"
                    @input="$v.editAccountForm.password.$touch"
                  />
                  <div class="eos-form-group-label eos-form-group-error-msg">
                    <label
                      v-if="
                        $v.editAccountForm.password.$dirty &&
                          !$v.editAccountForm.password.required
                      "
                      >Password is required</label
                    >
                    <label
                      v-else-if="
                        $v.editAccountForm.password.$dirty &&
                          !$v.editAccountForm.password.passwordRegex
                      "
                      >Invalid password</label
                    >
                  </div>
                </div>
              </v-col>
              <v-col class="pb-0">
                <div
                  class="eos-form-group"
                  :class="{
                    'eos-form-group--error':
                      $v.editAccountForm.confirmPassword.$error
                  }"
                >
                  <label class="eos-form-group-label" for="confirmPasswordEdit"
                    >Confirm password*</label
                  >
                  <input
                    class="eos-form__input_text"
                    type="password"
                    id="confirmPasswordEdit"
                    name="confirmPasswordEdit"
                    v-model.trim="editAccountForm.confirmPassword"
                    @input="$v.editAccountForm.confirmPassword.$touch"
                  />
                  <span
                    class="eos-form-group-label eos-form-group-error-msg"
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
              <v-col class="pt-0">
                <button
                  type="button"
                  id="btnEditPassword"
                  class="eos-btn-primary"
                  @click="editAccount(props)"
                  :disabled="$v.editAccountForm.$invalid"
                >
                  Update
                </button>
                <button
                  type="button"
                  id="btncancelEditpass"
                  class="eos-btn-tertiary"
                  @click="closeEditAccountForm()"
                >
                  Cancel
                </button>
              </v-col>
            </v-row>
          </td>
        </template>
        <template v-slot:item.data-table-expand="{ item, expand, isExpanded }">
          <div style="width: 90px;">
            <eos-has-access
              class="mx-2"
              :to="$eosUserPermissions.s3accounts + $eosUserPermissions.update"
            >
              <img
                v-on:click="expand(!isExpanded)"
                class="eos-cursor-pointer"
                src="@/assets/actions/edit-green.svg"
              />
            </eos-has-access>
            <eos-has-access
              class="mx-2"
              :to="$eosUserPermissions.s3accounts + $eosUserPermissions.delete"
            >
              <img
                @click="openConfirmDeleteDialog(item.account_name)"
                class="eos-cursor-pointer"
                src="@/assets/actions/delete-green.svg"
              />
            </eos-has-access>
          </div>
        </template>
      </v-data-table>
    </eos-has-access>

    <eos-confirmation-dialog
      :show="showConfirmDeleteDialog"
      title="Confirmation"
      message="Are you sure you want to delete the account?"
      severity="warning"
      @closeDialog="closeConfirmDeleteDialog"
      cancelButtonText="No"
    ></eos-confirmation-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Validations } from "vuelidate-property-decorators";
import { required, helpers, sameAs, email } from "vuelidate/lib/validators";
import { Account } from "../../models/s3";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import {
  accountNameRegex,
  passwordRegex,
  passwordTooltipMessage,
  accountNameTooltipMessage
} from "./../../common/regex-helpers";

@Component({
  name: "eos-account-management"
})
export default class EosAccountManagement extends Vue {
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

  constructor() {
    super();

    this.showCreateAccountForm = false;
    this.showAccountDetailsDialog = false;
    this.showConfirmDeleteDialog = false;
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
    }
    this.$store.dispatch("systemConfig/hideLoader");
    this.showAccountDetailsDialog = true;
  }

  public async editAccount(props: any) {
    const updateDetails = {
      password: this.editAccountForm.password
    };
    this.$store.dispatch("systemConfig/showLoader", "Updating account...");
    const res = await Api.patch(
      apiRegister.s3_account,
      updateDetails,
      props.item.account_name
    );
    this.closeEditAccountForm();
    this.$store.dispatch("systemConfig/hideLoader");
  }

  public async closeAccountDetailsDialog() {
    this.clearCreateAccountForm();
    this.showAccountDetailsDialog = false;
    this.showCreateAccountForm = false;
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
</style>
