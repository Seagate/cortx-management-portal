<template>
  <div>
    <Loader :show="showLoader" :message="loaderMessage" />

    <div style="width: 100%">
      <div v-if="showCreateAccountForm">
        <v-row>
          <v-col class="pl-5">
            <div class="pt-3">
              <InputBox :form="createAccountForm" :control="createAccountForm.controls[0]" />
            </div>
            <div class="pt-3">
              <InputBox :form="createAccountForm" :control="createAccountForm.controls[1]" />
            </div>
          </v-col>
          <v-col>
            <div class="pt-3">
              <InputBox :form="createAccountForm" :control="createAccountForm.controls[2]" />
            </div>
            <div class="pt-3">
              <InputBox
                :form="createAccountForm"
                :control="createAccountForm.controls[3]"
                :compareWithControl="createAccountForm.controls[2]"
              />
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn
              v-if="showCreateAccountForm"
              color="csmprimary"
              class="mx-2"
              @click="createAccount()"
              :disabled="!createAccountForm.isValid"
            >
              <span class="white--text">Create account</span>
            </v-btn>
            <v-btn
              v-if="showCreateAccountForm"
              text
              small
              color="csmprimary"
              class="ml-5"
              @click="closeCreateAccountForm()"
            >Cancel</v-btn>
          </v-col>
        </v-row>
      </div>

      <v-btn
        v-if="!showCreateAccountForm"
        color="csmprimary"
        class="mt-2 mb-4 elevation-0 white--text"
        @click="openCreateAccountForm()"
      >Create</v-btn>

      <v-dialog v-model="showAccountDetailsDialog" persistent max-width="790">
        <v-card>
          <v-system-bar color="greay lighten-3">
            <v-spacer></v-spacer>
            <v-icon @click="closeAccountDetailsDialog()" style="cursor: pointer;">mdi-close</v-icon>
          </v-system-bar>
          <v-card-title class="title mt-6 ml-3">
            <img class="mr-2" src="./../../assets/status/healthy-icon.png" />
            <span>Account Created: Access Key and Secret</span>
          </v-card-title>
          <v-divider />
          <v-row class="mx-4">
            <v-col cols="8">
              <span>Save this information, you will not see it again.</span>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>

          <table class="mx-7 mb-7">
            <tr style>
              <th style="width:15rem;height:6rem;text-align: left">Account name</th>
              <th style="width:24.2rem;text-align: left">Access key</th>
              <th style="width:5rem;text-align: left">Secret</th>
            </tr>
            <tr>
              <td style="width:15rem;height:2rem;text-align: left">{{ account.account_name }}</td>
              <td>{{ account.access_key }}</td>
              <td>{{ account.secret_key }}</td>
            </tr>
          </table>

          <v-card-actions>
            <v-btn
              color="csmprimary"
              @click="closeAccountDetailsDialog()"
              class="ma-5 elevation-0 white--text"
            >OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="showConfirmDeleteDialog" persistent max-width="790">
        <v-card>
          <v-system-bar color="greay lighten-3">
            <v-spacer></v-spacer>
            <v-icon @click="closeConfirmDeleteDialog('no')" style="cursor: pointer;">mdi-close</v-icon>
          </v-system-bar>
          <v-card-title class="title ml-3">
            <img class="mr-2" src="./../../assets/status/warning.png" />
            <span>Confirmation</span>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <label
              class="ml-3 delete-account-confirmation-msg"
            >Are you sure you want to delete the account?</label>
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="csmprimary"
              @click="closeConfirmDeleteDialog('yes')"
              class="ma-5 elevation-0"
            >
              <span class="white--text">Yes</span>
            </v-btn>
            <v-btn
              color="csmprimary"
              outlined
              @click="closeConfirmDeleteDialog('no')"
              class="ma-5 elevation-0"
            >
              <span style="text-transform: none;">No</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-data-table
        calculate-widths
        :items="accountsList"
        item-key="account_name"
        class="eos-table"
        :hide-default-header="true"
        :hide-default-footer="true"
        :disable-pagination="true"
      >
        <template v-slot:header="{props}">
          <tr>
            <th
              v-for="header in accountsTableHeaderList"
              :key="header.text"
              class="tableheader font-weight-medium text--black"
            >
              <span class="headerText">{{ header.text }}</span>
            </th>
            <th class="tableheader" />
          </tr>
        </template>

        <template v-slot:item="props">
          <tr class="font-weight-small">
            <td>{{props.item.account_name}}</td>
            <td>{{props.item.account_email}}</td>
            <td>
              <img
                @click="openConfirmDeleteDialog(props.item.account_name)"
                style="cursor: pointer;"
                src="./../../assets/delete-off.png"
              />
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Account } from "../../models/s3";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import Loader from "../widgets/loader.vue";
import InputBox from "../widgets/input-box.vue";
import { Form, FormControl, Validator } from "../widgets/form-widget";

@Component({
  name: "eos-account-management",
  components: { Loader, InputBox }
})
export default class EosAccountManagement extends Vue {
  private showCreateAccountForm: boolean;
  private showLoader: boolean;
  private loaderMessage: string;
  private showAccountDetailsDialog: boolean;
  private showConfirmDeleteDialog: boolean;

  private accountsTableHeaderList: any[];
  private accountsList: Account[] = [];
  private account: Account;
  private accountToDelete: string = "";

  private createAccountForm: Form;

  constructor() {
    super();
    this.showCreateAccountForm = false;
    this.showLoader = false;
    this.loaderMessage = "";
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
      }
    ];

    this.account = new Account();

    const controls: FormControl[] = [
      new FormControl(
        "Account name",
        "account_name",
        "text",
        "",
        true,
        "Account Name is required",
        new Validator(new RegExp("^[a-zA-Z0-9_-]*$"), "Invalid Account Name"),
        "Account Name should be alphanumeric " +
          "and can have _ or - but no spaces"
      ),
      new FormControl(
        "Email Id",
        "account_email",
        "email",
        "",
        true,
        "Email Id is required",
        new Validator(
          /[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*/,
          "Invalid Email Id"
        )
      ),
      new FormControl(
        "Password",
        "password",
        "password",
        "",
        true,
        "Password is required",
        new Validator(
          /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\(\)\_\+\-\=\[\]\{\}\|\'])[A-Za-z\d!@#\$%\^&\*\(\)\_\+\-\=\[\]\{\}\|\']{8,}/,
          "Invalid Password"
        ),
        "Password should be minimum eight characters, " +
          "at least one uppercase letter, one lowercase letter, " +
          "one number and one special character"
      ),
      new FormControl(
        "Confirm password",
        "confirm_password",
        "password",
        "",
        true,
        "Confirm above Password"
      )
    ];
    this.createAccountForm = new Form(controls, false);
  }

  public mounted() {
    this.getAllAccounts();
  }

  public async getAllAccounts() {
    this.showLoader = true;
    this.loaderMessage = "Fetching All S3 accounts...";
    try {
      const res: any = await Api.getAll(apiRegister.s3_account);
      this.accountsList = res.data.s3_accounts;
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.error(error);
    }
    this.showLoader = false;
    this.loaderMessage = "";
  }

  public async createAccount() {
    this.showLoader = true;
    this.loaderMessage = "Creating Account...";
    const tempAccount = this.createAccountForm.getModel();
    delete tempAccount.confirm_password;
    try {
      const res = await Api.post(apiRegister.s3_account, tempAccount);
      this.account = res.data;
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.error(error);
    }
    this.showLoader = false;
    this.loaderMessage = "";
    this.showAccountDetailsDialog = true;
  }

  public closeAccountDetailsDialog() {
    this.clearCreateAccountForm();
    this.showAccountDetailsDialog = false;
    this.showCreateAccountForm = false;
    this.getAllAccounts();
  }

  public openCreateAccountForm() {
    this.showCreateAccountForm = true;
  }

  public closeCreateAccountForm() {
    this.clearCreateAccountForm();
    this.showCreateAccountForm = false;
  }

  public clearCreateAccountForm() {
    this.account = new Account();
    this.createAccountForm.isValid = false;
    this.createAccountForm.controls.forEach(control => {
      control.value = "";
      control.isDirty = false;
      control.isValid = false;
    });
  }

  public async deleteAccount() {
    this.showLoader = true;
    this.loaderMessage = "Deleting Account " + this.accountToDelete;
    try {
      await Api.delete(apiRegister.s3_account, this.accountToDelete);
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.error(error);
    }
    this.showLoader = false;
    this.loaderMessage = "";
    this.getAllAccounts();
  }

  public openConfirmDeleteDialog(accountName: string) {
    this.accountToDelete = accountName;
    this.showConfirmDeleteDialog = true;
  }

  public async closeConfirmDeleteDialog(confirmation: string) {
    this.showConfirmDeleteDialog = false;
    if (confirmation === "yes") {
      this.deleteAccount();
    }
    this.accountToDelete = "";
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
.tableheader {
  height: 2.5em;
  background-color: #e3e3e3;
  border-top: 1px solid whitesmoke;
  padding-top: 0.5em;
}
.active {
  display: inline-block;
  color: var(--v-csmprimary-base) !important;
}
.notActive {
  opacity: 0;
}
.headerText {
  color: black;
}
.backoverview {
  position: relative;
  top: 1em;
  cursor: pointer;
}
.backoverviewimg {
  position: relative;
  display: inline-block;
}
.backoverviewtxt {
  position: relative;
  top: -0.3em;
}
.tableheader:hover {
  .notActive {
    opacity: 1;
  }
}
.largeAlert {
  border: 2px solid #e3e3e3;
}
tbody tr {
  background-color: #ffffff !important ;
}
tbody tr:hover {
  border-top: 2px solid darkgray !important;
  border-bottom: 2px solid darkgray !important;
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
