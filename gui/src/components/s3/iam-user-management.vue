<template>
  <div>
    <div v-if="showCreateUserForm" class="pa-2">
      <v-row>
        <v-col class="py-0 pr-0">
          <div
            class="eos-form-group"
            :class="{
              'eos-form-group--error':
                $v.createUserForm.iamUser.user_name.$error
            }"
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
                v-if="
                  $v.createUserForm.iamUser.user_name.$dirty &&
                    !$v.createUserForm.iamUser.user_name.required
                "
                >Username is required</label
              >
              <label
                v-else-if="
                  $v.createUserForm.iamUser.user_name.$dirty &&
                    !$v.createUserForm.iamUser.user_name.userNameRegex
                "
                >Invalid username</label
              >
            </div>
          </div>
        </v-col>
        <v-col class="py-0 pl-0">
          <div
            class="eos-form-group"
            :class="{
              'eos-form-group--error': $v.createUserForm.iamUser.password.$error
            }"
          >
            <label class="eos-form-group-label" for="userPassword"
              >Password*</label
            >
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
                >Password is required</label
              >
              <label
                v-else-if="
                  $v.createUserForm.iamUser.password.$dirty &&
                    !$v.createUserForm.iamUser.password.passwordRegex
                "
                >Invalid password</label
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
              'eos-form-group--error': $v.createUserForm.iamUser.path.$error
            }"
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
                v-if="
                  $v.createUserForm.iamUser.path.$dirty &&
                    !$v.createUserForm.iamUser.path.required
                "
                >Path is required</label
              >
              <label
                v-else-if="
                  $v.createUserForm.iamUser.path.$dirty &&
                    !$v.createUserForm.iamUser.path.pathRegex
                "
                >Invalid path</label
              >
            </div>
          </div>
        </v-col>
        <v-col class="py-0 pl-0">
          <div
            class="eos-form-group"
            :class="{
              'eos-form-group--error': $v.createUserForm.confirmPassword.$error
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
        <v-col class="pt-0">
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
            class="ml-8 eos-btn-secondary"
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
        class="mt-2 mb-2 eos-btn-primary"
        v-if="!showCreateUserForm"
        @click="openCreateUserForm()"
      >
        Create
      </button>
    </eos-has-access>
    <v-dialog v-model="showUserDetailsDialog" persistent max-width="790">
      <v-card>
        <v-system-bar color="greay lighten-3">
          <v-spacer></v-spacer>
          <v-icon @click="closeUserDetailsDialog()" style="cursor: pointer;"
            >mdi-close</v-icon
          >
        </v-system-bar>
        <v-card-title class="title mt-6 ml-3">
          <img class="mr-2" src="./../../assets/status/healthy-icon.png" />
          <span>User created: access key and secret</span>
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
            <th style="width:24.2rem;text-align: left">User id</th>
            <th style="width:5rem;text-align: left">ARN</th>
          </tr>
          <tr>
            <td style="width:15rem;height:2rem;text-align: left">
              {{ user.user_name }}
            </td>
            <td>{{ user.user_id }}</td>
            <td>{{ user.arn }}</td>
          </tr>
        </table>

        <v-card-actions>
          <button
            type="button"
            class="ma-5 eos-btn-primary"
            @click="closeUserDetailsDialog()"
          >
            Ok
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showConfirmDeleteDialog" persistent max-width="790">
      <v-card>
        <v-system-bar color="greay lighten-3">
          <v-spacer></v-spacer>
          <v-icon
            @click="closeConfirmDeleteDialog('no')"
            style="cursor: pointer;"
            >mdi-close</v-icon
          >
        </v-system-bar>
        <v-card-title class="title ml-3">
          <img class="mr-2" src="./../../assets/status/warning.png" />
          <span>Confirmation</span>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <label class="ml-3 delete-user-confirmation-msg"
            >Are you sure you want to delete the user?</label
          >
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
            <td>{{ props.item.user_name }}</td>
            <td>{{ props.item.user_id }}</td>
            <td>{{ props.item.arn }}</td>
            <td>{{ props.item.path }}</td>
            <eos-has-access
              :to="$eosUserPermissions.s3iamusers + $eosUserPermissions.delete"
            >
              <td>
                <img
                  @click="openConfirmDeleteDialog(props.item.user_name)"
                  style="cursor: pointer;"
                  src="./../../assets/actions/delete-green.svg"
                />
              </td>
            </eos-has-access>
          </tr>
        </template>
      </v-data-table>
    </eos-has-access>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Validations } from "vuelidate-property-decorators";
import { required, helpers, sameAs } from "vuelidate/lib/validators";
import { IAMUser } from "../../models/s3";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";

const userNameRegex = helpers.regex("userNameRegex", /^[a-zA-Z0-9_-]{1,64}$/);
const pathRegex = helpers.regex("pathRegex", /^(\/[^/ ]*)+\/?$/);
const passwordRegex = helpers.regex(
  "passwordRegex",
  // tslint:disable-next-line
  /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\(\)\_\+\-\=\[\]\{\}\|\'])[A-Za-z\d!@#\$%\^&\*\(\)\_\+\-\=\[\]\{\}\|\']{8,}/
);

@Component({
  name: "eos-iam-user-management"
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
  private showUserDetailsDialog: boolean;
  private showConfirmDeleteDialog: boolean;

  private usersTableHeaderList: any[];
  private usersList: IAMUser[] = [];
  private user: IAMUser;
  private userToDelete: string = "";

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
      },
      {
        text: "Path",
        value: "path",
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
    this.$store.dispatch("systemConfig/hideLoader");
  }

  public async createUser() {
    this.$store.dispatch("systemConfig/showLoader", "Creating IAM user...");
    const tempUser = this.createUserForm.iamUser;
    tempUser.require_reset = true;
    const res: any = await Api.post(apiRegister.s3_iam_user, tempUser);
    if (!res.error) {
      this.user = res.data;
    }
    this.$store.dispatch("systemConfig/hideLoader");
    this.showUserDetailsDialog = true;
  }

  public async closeUserDetailsDialog() {
    this.clearCreateUserForm();
    this.showUserDetailsDialog = false;
    this.showCreateUserForm = false;
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

  public async closeConfirmDeleteDialog(confirmation: string) {
    this.showConfirmDeleteDialog = false;
    if (confirmation === "yes") {
      await this.deleteUser();
    }
    this.userToDelete = "";
  }

  private async deleteUser() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      "Deleting user " + this.userToDelete
    );
    this.userToDelete = encodeURI(this.userToDelete);
    await Api.delete(apiRegister.s3_iam_user, this.userToDelete);
    this.$store.dispatch("systemConfig/hideLoader");
    await this.getAllUsers();
  }
}
</script>
<style lang="scss" scoped>
.delete-user-confirmation-msg {
  color: #000;
  font-size: 16px;
}
</style>
