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
  <v-dialog
    :value="value"
    @input="$emit('input', value)"
    persistent
    max-width="590"
    id="add-new-user-dialog"
  >
    <v-card>
      <v-card-title class="title-section">
        <span>Edit user account</span>
        <span class="close-btn" @click="$emit('close-popup')">&times;</span>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6">
              <div class="sgt-form-group-custom">
                <label
                  class="sgt-form-group-label"
                  for="username"
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
                  class="sgt-form__input_text"
                  type="text"
                  name="txt-username"
                  v-model.trim="userDetails.username"
                  id="username"
                  disabled
                />
              </div>
            </v-col>

            <v-col cols="12" sm="6">
              <div
                class="sgt-form-group-custom"
                :class="{
                  'sgt-form-group--error': $v.userDetails.email.$error,
                }"
              >
                <label
                  class="sgt-form-group-label"
                  for="Email"
                  id="localuseremaillbl"
                  >Email</label
                >
                <input
                  class="sgt-form__input_text"
                  type="email"
                  name="email"
                  v-model.trim="userDetails.email"
                  id="useremail"
                  @input="$v.userDetails.email.$touch"
                  placeholder="example@email.com"
                />
                <div class="sgt-form-group-label sgt-form-group-error-msg">
                  <label
                    id="localuser-email-required"
                    v-if="
                      $v.userDetails.email.$dirty &&
                      !$v.userDetails.email.required
                    "
                    >Email is required</label
                  >
                  <label
                    id="localuser-email-invalid"
                    v-else-if="
                      $v.userDetails.email.$dirty && !$v.userDetails.email.email
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
                class="sgt-form-group-custom"
                :class="{
                  'sgt-form-group--error':
                    $v.userDetails.currentPassword.$error,
                }"
              >
                <label
                  class="sgt-form-group-label"
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
                  class="sgt-form__input_text"
                  type="password"
                  name="txtCreatePassword"
                  v-model.trim="userDetails.currentPassword"
                  @input="$v.userDetails.currentPassword.$touch"
                  id="txtLocalPass"
                />
                <div class="sgt-form-group-label sgt-form-group-error-msg">
                  <label
                    id="localuser-password-required"
                    v-if="
                      $v.userDetails.currentPassword.$dirty &&
                      !$v.userDetails.currentPassword.required
                    "
                    >Current password is required</label
                  >
                  <label
                    id="localuser-password-invalid"
                    v-else-if="
                      $v.userDetails.currentPassword.$dirty &&
                      !$v.userDetails.currentPassword.passwordRegex
                    "
                    >Invalid password.</label
                  >
                </div>
              </div>
            </v-col>

            <v-col cols="12" sm="6">
              <div
                class="sgt-form-group-custom"
                :class="{
                  'sgt-form-group--error': $v.userDetails.password.$error,
                }"
              >
                <label
                  class="sgt-form-group-label"
                  for="password"
                  id="localuser-confirmpasslbl"
                  >New Password*</label
                >
                <input
                  class="sgt-form__input_text"
                  type="password"
                  name="txtCreateConfirmPassword"
                  v-model="userDetails.password"
                  id="txtLocalConfirmPass"
                  @input="$v.userDetails.password.$touch"
                />
                <div class="sgt-form-group-label sgt-form-group-error-msg">
                  <label
                    id="localuser-confirmpassword-notmatch"
                    v-if="
                      $v.userDetails.password.$dirty &&
                      !$v.userDetails.password.passwordRegex
                    "
                    >Invalid new password.</label
                  >
                </div>
              </div>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" sm="6">
              <div
                class="sgt-form-group-custom"
                :class="{
                  'sgt-form-group--error':
                    $v.userDetails.confirmPassword.$error,
                }"
              >
                <label
                  class="sgt-form-group-label"
                  for="password"
                  id="localuser-confirmpasslbl"
                  >Confirm Password*</label
                >
                <input
                  class="sgt-form__input_text"
                  type="password"
                  name="txtCreateConfirmPassword"
                  v-model="userDetails.confirmPassword"
                  id="txtLocalConfirmPass"
                  @input="$v.userDetails.confirmPassword.$touch"
                />
                <div class="sgt-form-group-label sgt-form-group-error-msg">
                  <label
                    id="localuser-confirmpassword-notmatch"
                    v-if="
                      $v.userDetails.confirmPassword.$dirty &&
                      !$v.userDetails.confirmPassword.sameAsPassword
                    "
                    >Invalid confirm password.</label
                  >
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-container>
          <v-row>
            <v-col cols="12">
              <label class="mr-3">Roles</label>

              <label class="sgt-rdb-container ml-4" id="localuser-adminlbl">
                Admin
                <input
                  type="radio"
                  v-model="userDetails.role"
                  name="rbtCreateAdmin"
                  value="admin"
                  id="chkLocalAdmin"
                />
                <span class="sgt-rdb-tick" id="lblLocalAdmin"></span>
              </label>

              <label class="sgt-rdb-container ml-4" id="localuser-managelbl">
                Manage
                <input
                  type="radio"
                  v-model="userDetails.role"
                  name="rbtCreateManage"
                  value="manage"
                  id="chkLocalManage"
                />
                <span class="sgt-rdb-tick" id="lblLocalManage"></span>
              </label>

              <label class="sgt-rdb-container ml-4" id="localuser-monitorlbl">
                Monitor
                <input
                  type="radio"
                  v-model="userDetails.role"
                  name="rbtCreateMonitor"
                  value="monitor"
                  id="chkLocalMonitor"
                />
                <span class="sgt-rdb-tick" id="lblLocalMonitor"></span>
              </label>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" class="btn-container">
              <button
                v-if="value"
                type="button"
                class="sgt-btn-one sgt-btn-one-success"
                @click="editUser()"
                id="btnLocalEditUser"
                :disabled="$v.userDetails.$invalid || !userDetails.role"
              >
                Create
              </button>
              <button
                v-if="value"
                type="button"
                class="sgt-btn-two"
                @click="cancelOperation()"
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
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import SgtIButton from "../../shared/SgtIButton.vue";
import { Validations } from "vuelidate-property-decorators";
import {
  required,
  helpers,
  sameAs,
  requiredIf,
  email,
} from "vuelidate/lib/validators";
import { accountNameRegex, passwordRegex } from "../../../utils/RegexHelpers";

@Component({
  name: "EditExistingUser",
  components: {
    SgtIButton,
  },
})
export default class EditExistingUser extends Vue {
  @Prop({ required: true }) value: boolean;
  @Prop({ required: true }) userData: {
    username: string;
    role: "admin" | "manage" | "monitor";
    email: string;
  };

  public userDetails = {
    username: "",
    role: "",
    email: "",
    currentPassword: "",
    password: "",
    confirmPassword: "",
  };

  @Watch("userData")
  public userDataChangeHandler() {
    this.userDetails.username = this.userData.username;
    this.userDetails.email = this.userData.email;
    this.userDetails.role = this.userData.role;
  }

  @Validations()
  public validations = {
    userDetails: {
      password: { passwordRegex },
      currentPassword: {
        required: requiredIf(function (this: any, form: any) {
          // return this.strEqualityCaseInsensitive(
          //   this.$data.selectedItem.username,
          //   this.$data.loggedInUserName
          // );
          return true;
        }),
        passwordRegex,
      },
      confirmPassword: {
        sameAsPassword: sameAs("password"),
      },
      email: { required, email },
    },
  };

  private strEqualityCaseInsensitive(first: string, second: string) {
    return (
      first.localeCompare(second, undefined, { sensitivity: "base" }) === 0
    );
  }

  private editUser() {
    //API call to update the existing user. Data is available in this.userDetails.
  }

  private cancelOperation() {
    this.$emit("close-popup");
  }

  private clearCreateAccountForm() {
    this.$data.userDetails = {};
    this.$v.userDetails.$reset();
  }
}
</script>
<style lang="scss" scoped>
.title-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .close-btn {
    color: $primary;
    font-size: 1.5rem;
    cursor: pointer;
  }
}
.btn-container {
  display: flex;
  gap: 1rem;
  margin: 0.5em 0;
}
</style>
