<template>
  <div>
    <Loader :show="showLoader" :message="loaderMessage" />

    <div style="width: 100%">
      <div v-if="showCreateUserForm" class="px-2">
        <v-row>
          <v-col class="py-0 pr-0">
            <div
              class="eos-form-group"
              :class="{ 'eos-form-group--error': $v.createUserForm.iamUser.user_name.$error }"
            >
              <label class="eos-form-group-label" for="userName">Username*</label>
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
                  v-if="$v.createUserForm.iamUser.user_name.$dirty && !$v.createUserForm.iamUser.user_name.required"
                >Username is required</label>
                <label
                  v-else-if="$v.createUserForm.iamUser.user_name.$dirty && !$v.createUserForm.iamUser.user_name.userNameRegex"
                >Invalid Username</label>
              </div>
            </div>
          </v-col>
          <v-col class="py-0 pl-0">
            <div
              class="eos-form-group"
              :class="{ 'eos-form-group--error': $v.createUserForm.iamUser.password.$error }"
            >
              <label class="eos-form-group-label" for="userPassword">Password*</label>
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
                  v-if="$v.createUserForm.iamUser.password.$dirty && !$v.createUserForm.iamUser.password.required"
                >Password is required</label>
                <label
                  v-else-if="$v.createUserForm.iamUser.password.$dirty && !$v.createUserForm.iamUser.password.passwordRegex"
                >Invalid Password</label>
              </div>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="py-0 pr-0">
            <div
              class="eos-form-group"
              :class="{ 'eos-form-group--error': $v.createUserForm.iamUser.path.$error }"
            >
              <label class="eos-form-group-label" for="userPath">Path*</label>
              <input
                class="eos-form__input_text"
                type="text"
                id="userPath"
                name="userPath"
                v-model.trim="createUserForm.iamUser.path"
                @input="$v.createUserForm.iamUser.path.$touch"
              />
              <div class="eos-form-group-label eos-form-group-error-msg">
                <label
                  v-if="$v.createUserForm.iamUser.path.$dirty && !$v.createUserForm.iamUser.path.required"
                >Path is required</label>
                <label
                  v-else-if="$v.createUserForm.iamUser.path.$dirty && !$v.createUserForm.iamUser.path.pathRegex"
                >Invalid Path</label>
              </div>
            </div>
          </v-col>
          <v-col class="py-0 pl-0">
            <div
              class="eos-form-group"
              :class="{ 'eos-form-group--error': $v.createUserForm.confirmPassword.$error }"
            >
              <label class="eos-form-group-label" for="confirmPassword">Confirm Password*</label>
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
                v-if="$v.createUserForm.confirmPassword.$dirty && !$v.createUserForm.confirmPassword.sameAsPassword"
              >Passwords do not match</span>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pt-0">
            <button
              type="button"
              class="eos-btn-primary"
              @click="createUser()"
              :disabled="$v.createUserForm.$invalid"
            >Create User</button>
            <button
              type="button"
              class="ml-8 eos-btn-secondary"
              @click="closeCreateUserForm()"
            >Cancel</button>
          </v-col>
        </v-row>
      </div>

      <button
        type="button"
        class="mt-2 mb-4 eos-btn-primary"
        v-if="!showCreateUserForm"
        @click="openCreateUserForm()"
      >Create</button>

      <v-dialog v-model="showUserDetailsDialog" persistent max-width="790">
        <v-card>
          <v-system-bar color="greay lighten-3">
            <v-spacer></v-spacer>
            <v-icon @click="closeUserDetailsDialog()" style="cursor: pointer;">mdi-close</v-icon>
          </v-system-bar>
          <v-card-title class="title mt-6 ml-3">
            <img class="mr-2" src="./../../assets/status/healthy-icon.png" />
            <span>User Created: Access Key and Secret</span>
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
              <th style="width:15rem;height:6rem;text-align: left">Username</th>
              <th style="width:24.2rem;text-align: left">User Id</th>
              <th style="width:5rem;text-align: left">ARN</th>
            </tr>
            <tr>
              <td style="width:15rem;height:2rem;text-align: left">{{ user.user_name }}</td>
              <td>{{ user.user_id }}</td>
              <td>{{ user.arn }}</td>
            </tr>
          </table>

          <v-card-actions>
            <button type="button" class="ma-5 eos-btn-primary" @click="closeUserDetailsDialog()">Ok</button>
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
              class="ml-3 delete-user-confirmation-msg"
            >Are you sure you want to delete the user?</label>
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
        :items="usersList"
        item-key="user_name"
        class="eos-table"
        :hide-default-header="true"
        :hide-default-footer="true"
        :disable-pagination="true"
      >
        <template v-slot:header="{props}">
          <tr>
            <th
              v-for="header in usersTableHeaderList"
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
            <td>{{props.item.user_name}}</td>
            <td>{{props.item.user_id}}</td>
            <td>{{props.item.arn}}</td>
            <td>{{props.item.path}}</td>
            <td>
              <img
                @click="openConfirmDeleteDialog(props.item.user_name)"
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
import { Validations } from "vuelidate-property-decorators";
import { required, helpers, sameAs } from "vuelidate/lib/validators";
import { IAMUser } from "../../models/s3";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import Loader from "../widgets/loader.vue";

const userNameRegex = helpers.regex("userNameRegex", /^[a-zA-Z0-9_-]{1,64}$/);
const pathRegex = helpers.regex("pathRegex", /^(\/[^/ ]*)+\/?$/);
const passwordRegex = helpers.regex(
  "passwordRegex",
  /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\(\)\_\+\-\=\[\]\{\}\|\'])[A-Za-z\d!@#\$%\^&\*\(\)\_\+\-\=\[\]\{\}\|\']{8,}/
);

@Component({
  name: "eos-iam-user-management",
  components: { Loader }
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
        user_name: { required, userNameRegex },
        path: { required, pathRegex },
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
  private showLoader: boolean;
  private loaderMessage: string;
  private showUserDetailsDialog: boolean;
  private showConfirmDeleteDialog: boolean;

  private usersTableHeaderList: any[];
  private usersList: IAMUser[] = [];
  private user: IAMUser;
  private userToDelete: string = "";

  constructor() {
    super();
    this.showCreateUserForm = false;
    this.showLoader = false;
    this.loaderMessage = "";
    this.showUserDetailsDialog = false;
    this.showConfirmDeleteDialog = false;
    this.usersTableHeaderList = [
      {
        text: "Username",
        value: "user_name",
        sortable: false
      },
      {
        text: "User Id",
        value: "user_id",
        sortable: false
      },
      {
        text: "ARN",
        value: "arn",
        sortable: false
      },
      {
        text: "Path",
        value: "path",
        sortable: false
      }
    ];

    this.user = {} as IAMUser;
  }

  public mounted() {
    this.getAllUsers();
  }

  public async getAllUsers() {
    this.showLoader = true;
    this.loaderMessage = "Fetching All IAM Users...";
    try {
      const res: any = await Api.getAll(apiRegister.s3_iam_user);
      this.usersList = res.data.iam_users;
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.error(error);
    }
    this.showLoader = false;
    this.loaderMessage = "";
  }

  public async createUser() {
    this.showLoader = true;
    this.loaderMessage = "Creating User...";
    const tempUser = this.createUserForm.iamUser;
    tempUser.require_reset = true;
    try {
      const res: any = await Api.post(apiRegister.s3_iam_user, tempUser);
      this.user = res.data;
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.error(error);
    }
    this.showLoader = false;
    this.loaderMessage = "";
    this.showUserDetailsDialog = true;
  }

  public closeUserDetailsDialog() {
    this.clearCreateUserForm();
    this.showUserDetailsDialog = false;
    this.showCreateUserForm = false;
    this.getAllUsers();
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

  public async deleteUser() {
    this.showLoader = true;
    this.loaderMessage = "Deleting User " + this.userToDelete;
    this.userToDelete = encodeURI(this.userToDelete);
    try {
      await Api.delete(apiRegister.s3_iam_user, this.userToDelete);
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.error(error);
    }
    this.showLoader = false;
    this.loaderMessage = "";
    this.getAllUsers();
  }

  public openConfirmDeleteDialog(username: string) {
    this.userToDelete = username;
    this.showConfirmDeleteDialog = true;
  }

  public async closeConfirmDeleteDialog(confirmation: string) {
    this.showConfirmDeleteDialog = false;
    if (confirmation === "yes") {
      this.deleteUser();
    }
    this.userToDelete = "";
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
.delete-user-confirmation-msg {
  color: #000;
  font-size: 16px;
}
</style>
