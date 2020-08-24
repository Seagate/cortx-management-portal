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
  <v-container class="white pa-0 ma-0" fluid>
    <div class="cortx-header pl-10 py-3 col-12 black">
      <div class="cortx-brand-logo"></div>
    </div>
    <div class="body-2 ma-5">
      <div
        class="ml-4 mb-1 black--text font-weight-bold"
        style="font-size: 18px"
      >
        Admin user configuration
      </div>
      <div class="ml-4 my-2">
        Configure the username and password for the user with administrative
        rights. You must remember the admin user login credentials because the
        admin user can be created only once.
      </div>
      <v-divider class="mt-2" />
      <div class="ma-4">
        <form autocomplete="off" @submit.prevent="submitForm">
          <v-row>
            <v-col class="py-0 col-xs-6 col-sm-3">
              <div>
                <div
                  class="eos-form-group"
                  :class="{
                    'eos-form-group--error': $v.createAccount.username.$error
                  }"
                >
                  <label
                    class="eos-form-group-label"
                    for="Username"
                    id="lblAdminUsername"
                  >
                    <eos-info-tooltip
                      label="Username*"
                      :message="usernameTooltipMessage"
                    />
                  </label>
                  <div></div>
                  <input
                    class="eos-form__input_text"
                    type="text"
                    name="username"
                    id="adminUsername"
                    v-model.trim="createAccount.username"
                    @input="$v.createAccount.username.$touch"
                  />
                  <div class="eos-form-group-label eos-form-group-error-msg">
                    <label
                      v-if="
                        $v.createAccount.username.$dirty &&
                          !$v.createAccount.username.required
                      "
                      >Username is required.</label
                    >
                    <label
                      v-else-if="
                        $v.createAccount.username.$dirty &&
                          !$v.createAccount.username.accountNameRegex
                      "
                      >Invalid username.</label
                    >
                  </div>
                </div>
              </div>
            </v-col>
            <v-col class="py-0 col-xs-6 col-sm-3">
              <div>
                <div
                  class="eos-form-group"
                  :class="{
                    'eos-form-group--error': $v.createAccount.email.$error
                  }"
                >
                  <label
                    class="eos-form-group-label"
                    for="Email"
                    id="lblAdminEmail"
                    >Email*</label
                  >
                  <div></div>
                  <input
                    class="eos-form__input_text"
                    type="email"
                    name="email"
                    id="adminEmail"
                    v-model.trim="createAccount.email"
                    @input="$v.createAccount.email.$touch"
                  />
                  <div class="eos-form-group-label eos-form-group-error-msg">
                    <label
                      v-if="
                        $v.createAccount.email.$dirty &&
                          !$v.createAccount.email.required
                      "
                      >Email is required.</label
                    >
                    <label
                      v-else-if="
                        $v.createAccount.email.$dirty &&
                          !$v.createAccount.email.email
                      "
                      >Invalid email.</label
                    >
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-0 col-xs-6 col-sm-3">
              <div>
                <div
                  class="eos-form-group"
                  :class="{
                    'eos-form-group--error': $v.createAccount.password.$error
                  }"
                >
                  <label
                    class="eos-form-group-label"
                    for="password"
                    id="lblAdminPassword"
                  >
                    <eos-info-tooltip
                      label="Password*"
                      :message="passwordTooltipMessage"
                    />
                  </label>
                  <div></div>
                  <input
                    class="eos-form__input_text"
                    type="password"
                    name="password"
                    id="adminPassword"
                    v-model.trim="createAccount.password"
                    @input="$v.createAccount.password.$touch"
                  />
                  <div class="eos-form-group-label eos-form-group-error-msg">
                    <label
                      v-if="
                        $v.createAccount.password.$dirty &&
                          !$v.createAccount.password.required
                      "
                      >Password is required.</label
                    >
                    <label
                      v-else-if="
                        $v.createAccount.password.$dirty &&
                          !$v.createAccount.password.passwordRegex
                      "
                      >Invalid password.</label
                    >
                  </div>
                </div>
              </div>
            </v-col>
            <v-col class="py-0 col-xs-6 col-sm-3">
              <div>
                <div
                  class="eos-form-group"
                  :class="{
                    'eos-form-group--error':
                      $v.createAccount.confirmPassword.$error
                  }"
                >
                  <label
                    class="eos-form-group-label"
                    for="confirmPassword"
                    id="lblConfirmAdminPassword"
                    >Confirm password*</label
                  >
                  <div></div>
                  <input
                    class="eos-form__input_text"
                    type="password"
                    name="confirmPassword"
                    id="confirmAdminPassword"
                    v-model.trim="createAccount.confirmPassword"
                    @input="$v.createAccount.confirmPassword.$touch"
                    v-on:keyup.enter="handleEnterEvent()"
                  />
                  <div class="eos-form-group-label eos-form-group-error-msg">
                    <label
                      v-if="
                        $v.createAccount.confirmPassword.$dirty &&
                          !$v.createAccount.confirmPassword.sameAsPassword
                      "
                      >Passwords do not match.</label
                    >
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pt-0">
              <label class="eos-ckb-container" for="emailCheckID">
                Subscribe to email notifications
                <input
                  type="checkbox"
                  name="emailCheckID"
                  v-model="createAccount.alert_notification"
                  id="emailCheckID"
                />
                <span class="eos-ckb-tick"></span>
              </label>
            </v-col>
          </v-row>
          <button
            type="button"
            class="eos-btn-primary"
            @click="gotToNextPage()"
            :disabled="$v.createAccount.$invalid || createUserInProgress"
          >
            Apply and continue
          </button>
        </form>
        <div v-if="!isValidResponse" class="red--text mt-2">
          {{ invalidMessage }}
        </div>
      </div>
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { UserLoginQueryParam } from "./../../models/user-login";
import { Validations } from "vuelidate-property-decorators";
import { required, sameAs, email } from "vuelidate/lib/validators";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import {
  accountNameRegex,
  passwordRegex,
  passwordTooltipMessage,
  usernameTooltipMessage,
  commaSeparatedEmailsRegex
} from "./../../common/regex-helpers";
import { invalid } from "moment";
@Component({
  name: "eos-admin-user"
})
export default class EosAdminUser extends Vue {
  @Validations()
  private validations = {
    createAccount: {
      username: { required, accountNameRegex },
      password: { required, passwordRegex },
      confirmPassword: {
        sameAsPassword: sameAs("password")
      },
      email: { required, email }
    }
  };
  private data() {
    return {
      createAccount: {
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        alert_notification: true
      },
      isValidResponse: true,
      invalidMessage: "",
      createUserInProgress: false,
      passwordTooltipMessage,
      usernameTooltipMessage
    };
  }
  private async gotToNextPage() {
    const queryParams = {
      username: this.$data.createAccount.username,
      password: this.$data.createAccount.password,
      email: this.$data.createAccount.email,
      alert_notification: this.$data.createAccount.alert_notification
    };
    this.$data.isValidResponse = true;
    this.$data.createUserInProgress = true;
    this.$data.invalidMessage = "";

    this.$store.dispatch("systemConfig/showLoader", "Creating admin user...");
    try {
      const res = await Api.post(apiRegister.create_user, queryParams, {
        timeout: 60000
      });
      if (res) {
        this.$router.push({ name: "preboarding-login" });
      } else {
        throw new Error("Create admin user failed");
      }
    } catch (error) {
      this.$data.isValidResponse = false;
      this.$data.invalidMessage = error.data.message_text;
    } finally {
      this.$data.createUserInProgress = false;
      this.$store.dispatch("systemConfig/hideLoader");
    }
  }
  private handleEnterEvent() {
    if (
      this.$v.createAccount &&
      !this.$v.createAccount.$invalid &&
      !this.$data.createUserInProgress
    ) {
      this.gotToNextPage();
    }
  }
}
</script>

<style lang="scss" scoped>
.eos-form__input_text {
  border-style: solid;
  border-width: 1px;
  border-color: #e3e3e3;
  width: 20em;
  height: 3em;
}
.pointer {
  cursor: pointer;
}
</style>
