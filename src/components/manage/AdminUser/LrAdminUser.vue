<!--
* CORTX-CSM: CORTX Management web.
* Copyright (c) 2022 Seagate Technology LLC and/or its Affiliates
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
* please email opensource@seagate.com.
-->
<template>
  <div>
    <div class="title-container">
      <span class="title-label">User Settings</span>
      <SgtIButton>
        <div class="i-content">
          <div>
            <p class="section-title">User Settings: Local</p>
            <p class="description">
              Manage users. Depending on the user role, you can create, modify,
              and delete users. You can also change the password for the admin
              user. A role is a collection of permissions granted to a user.
            </p>
          </div>
          <div>
            <p class="section-title">Note:</p>
            <p class="description">
              Only admin user can create and delete users and change the
              password of the admin user.
            </p>
          </div>
        </div>
      </SgtIButton>
    </div>
    <LrDataTable
      ref="adminUserDetailsTable"
      :headers="adminUserTableConfig.adminUsersTable.headers"
      :records="adminUsersData"
      :searchConfig="adminUserTableConfig.searchConfig"
      :headerButton="{ name: 'addNewUser', label: 'Add new user' }"
      @edit="editUser"
      @delete="deleteUser"
      @addNewUser="isUserCreate = true"
    />

    <v-dialog
      v-model="isUserCreate"
      v-if="isUserCreate"
      persistent
      max-width="590"
      id="add-new-user-dialog"
    >
      <v-card>
        <v-card-title>
          <span>Add New User</span>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <div
                  class="cortx-form-group-custom"
                  :class="{
                    'cortx-form-group--error': $v.createAccount.username.$error,
                  }"
                >
                  <label
                    class="cortx-form-group-label"
                    for="Username"
                    id="lblusername"
                  >
                    Username*
                    <SgtIButton>
                      <span>
                        The username must be of minimum 4 characters and maximum
                        56 characters. The username must be alphanumeric and can
                        contain underscore (_) and dash (-).
                      </span>
                    </SgtIButton>
                  </label>
                  <input
                    class="cortx-form__input_text"
                    type="text"
                    name="txtCreateUsername"
                    v-model.trim="createAccount.username"
                    id="txtUsername"
                    @input="$v.createAccount.username.$touch"
                  />

                  <div
                    class="cortx-form-group-label cortx-form-group-error-msg"
                  >
                    <label
                      id="localusername-required"
                      v-if="
                        $v.createAccount.username.$dirty &&
                        !$v.createAccount.username.required
                      "
                      >Username is required.</label
                    >
                    <label
                      id="localuser-invalid"
                      v-else-if="
                        $v.createAccount.username.$dirty &&
                        !$v.createAccount.username.accountNameRegex
                      "
                      >Invalid username.</label
                    >
                  </div>
                </div>
              </v-col>

              <v-col cols="12" sm="6">
                <div
                  class="cortx-form-group-custom"
                  :class="{
                    'cortx-form-group--error': $v.createAccount.email.$error,
                  }"
                >
                  <label
                    class="cortx-form-group-label"
                    for="Email"
                    id="localuseremaillbl"
                    >Email</label
                  >
                  <input
                    class="cortx-form__input_text"
                    type="email"
                    name="email"
                    v-model.trim="createAccount.email"
                    id="useremail"
                    @input="$v.createAccount.email.$touch"
                    placeholder="example@email.com"
                  />
                  <div
                    class="cortx-form-group-label cortx-form-group-error-msg"
                  >
                    <label
                      id="localuser-email-required"
                      v-if="
                        $v.createAccount.email.$dirty &&
                        !$v.createAccount.email.required
                      "
                      >Email is required</label
                    >
                    <label
                      id="localuser-email-invalid"
                      v-else-if="
                        $v.createAccount.email.$dirty &&
                        !$v.createAccount.email.email
                      "
                      >Invalid email.</label
                    >
                  </div>
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="6">
                <div
                  class="cortx-form-group-custom"
                  :class="{
                    'cortx-form-group--error': $v.createAccount.password.$error,
                  }"
                >
                  <label
                    class="cortx-form-group-label"
                    for="password"
                    id="localuser-passwordlbl"
                  >
                    Password*
                    <SgtIButton>
                      <span
                        >Password must contain: Minimum 8 characters, One
                        uppercase letter, One lowercase letter, One special
                        character, One number</span
                      >
                    </SgtIButton>
                  </label>
                  <input
                    class="cortx-form__input_text"
                    type="password"
                    name="txtCreatePassword"
                    v-model.trim="createAccount.password"
                    @input="$v.createAccount.password.$touch"
                    id="txtLocalPass"
                  />
                  <div
                    class="cortx-form-group-label cortx-form-group-error-msg"
                  >
                    <label
                      id="localuser-password-required"
                      v-if="
                        $v.createAccount.password.$dirty &&
                        !$v.createAccount.password.required
                      "
                      >Password is required</label
                    >
                    <label
                      id="localuser-password-invalid"
                      v-else-if="
                        $v.createAccount.password.$dirty &&
                        !$v.createAccount.password.passwordRegex
                      "
                      >Invalid password.</label
                    >
                  </div>
                </div>
              </v-col>

              <v-col cols="12" sm="6">
                <div
                  class="cortx-form-group-custom"
                  :class="{
                    'cortx-form-group--error':
                      $v.createAccount.confirmPassword.$error,
                  }"
                >
                  <label
                    class="cortx-form-group-label"
                    for="password"
                    id="localuser-confirmpasslbl"
                    >Confirm Password*</label
                  >
                  <input
                    class="cortx-form__input_text"
                    type="password"
                    name="txtCreateConfirmPassword"
                    v-model="createAccount.confirmPassword"
                    id="txtLocalConfirmPass"
                    @input="$v.createAccount.confirmPassword.$touch"
                  />
                  <div
                    class="cortx-form-group-label cortx-form-group-error-msg"
                  >
                    <label
                      id="localuser-confirmpassword-notmatch"
                      v-if="
                        $v.createAccount.confirmPassword.$dirty &&
                        !$v.createAccount.confirmPassword.sameAsPassword
                      "
                      >Invalid confirm password.</label
                    >
                  </div>
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <label class="mr-3">Roles</label>

                <label class="cortx-rdb-container ml-4" id="localuser-adminlbl">
                  Admin
                  <input
                    type="radio"
                    v-model="checkedRoles"
                    name="rbtCreateAdmin"
                    value="admin"
                    id="chkLocalAdmin"
                  />
                  <span class="cortx-rdb-tick" id="lblLocalAdmin"></span>
                </label>

                <label
                  class="cortx-rdb-container ml-4"
                  id="localuser-managelbl"
                >
                  Manage
                  <input
                    type="radio"
                    v-model="checkedRoles"
                    name="rbtCreateManage"
                    value="manage"
                    id="chkLocalManage"
                  />
                  <span class="cortx-rdb-tick" id="lblLocalManage"></span>
                </label>

                <label
                  class="cortx-rdb-container ml-4"
                  id="localuser-monitorlbl"
                >
                  Monitor
                  <input
                    type="radio"
                    v-model="checkedRoles"
                    name="rbtCreateMonitor"
                    value="monitor"
                    id="chkLocalMonitor"
                  />
                  <span class="cortx-rdb-tick" id="lblLocalMonitor"></span>
                </label>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-container>
            <v-row>
              <v-col cols="12">
                <button
                  v-if="isUserCreate"
                  type="button"
                  class="cortx-btn-primary"
                  @click="createUser()"
                  id="btnLocalCreateUser"
                  :disabled="$v.createAccount.$invalid || !checkedRoles"
                >
                  Create
                </button>
                <button
                  v-if="isUserCreate"
                  type="button"
                  class="cortx-btn-tertiary"
                  @click="onAddNewUser()"
                  id="lblLocalCancel"
                >
                  Cancel
                </button>
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Validations } from "vuelidate-property-decorators";
import {
  required,
  helpers,
  sameAs,
  requiredIf,
  email,
} from "vuelidate/lib/validators";
import { accountNameRegex, passwordRegex } from "../../../utils/RegexHelpers";
import SgtIButton from "../../shared/SgtIButton.vue";
import { adminUserTableConst, IUserDetail } from "./AdminUserDetails.constant";
import { Api } from "../../../services/Api";
import LrDataTable from "../../shared/LrDataTable/LrDataTable.vue";

@Component({
  name: "LrAdminUser",
  components: {
    SgtIButton,
    LrDataTable,
  },
})
export default class LrAdminUser extends Vue {
  public adminUserTableConfig = adminUserTableConst;
  public adminUsersData = [];
  public isUserCreate = false;

  // public createAccount = {
  //   username: "",
  //   password: "",
  //   confirmPassword: "",
  //   email: "",
  // };
  // public checkedRoles = "";

  public data() {
    return {
      createAccount: {
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
      },
      checkedRoles: "",
    };
  }

  @Validations()
  public validations = {
    createAccount: {
      username: { required, accountNameRegex },
      password: { required, passwordRegex },
      confirmPassword: {
        sameAsPassword: sameAs("password"),
      },
      email: { required, email },
    },
    // selectedItem: {
    //   password: { passwordRegex },
    //   current_password: {
    //     required: requiredIf(function (this: any, form: any) {
    //       return this.strEqualityCaseInsensitive(
    //         this.$data.selectedItem.username,
    //         this.$data.loggedInUserName
    //       );
    //     }),
    //     passwordRegex,
    //   },
    //   confirmPassword: {
    //     sameAsPassword: sameAs("password"),
    //   },
    //   email: { required, email },
    // },
  };

  public async mounted() {
    const res: any = await Api.getData("manage/admin-users", {
      isDummy: true,
    });
    this.adminUsersData = res.data;
  }

  private onAddNewUser() {
    if (this.$data.isUserCreate) {
      this.clearCreateAccountForm();
    }
    this.$data.isUserCreate = !this.$data.isUserCreate;
    return this.$data.isUserCreate;
  }

  private clearCreateAccountForm() {
    this.$data.createAccount = {};
    this.$data.checkedRoles = "";
    this.$v.createAccount.$reset();
  }

  public editUser(userInfo: IUserDetail) {
    //Open the edit user window and make the API call
    console.log("edit user");
  }

  public deleteUser(userInfo: IUserDetail) {
    //Make an API call to delete the user from the table
    console.log("delete user");
  }
}
</script>

<style lang="scss" scoped>
.title-container {
  margin: 1em 0;
  display: flex;
  align-items: center;
  gap: 5px;

  .title-label {
    font-weight: bold;
  }
}

.i-content {
  display: flex;
  flex-direction: column;
  gap: 15px;

  p {
    margin: 0;
  }
  .section-title {
    font-weight: bold;
  }
}
</style>
