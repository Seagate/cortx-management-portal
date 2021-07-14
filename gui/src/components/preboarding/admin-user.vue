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
  <v-container class="white pa-0 ma-0" fluid v-feature="unsupportedFeatures.admin_user">
    <div class="cortx-header pl-10 py-3 col-12 black">
      <div class="cortx-brand-logo"></div>
    </div>
    <div class="body-2 ma-5">
      <div
        id="admin-configuration-title"
        class="ml-4 mb-1 black--text font-weight-bold"
        style="font-size: 18px"
      >
        {{ $t("admin.headerText") }}
      </div>
      <div class="ml-4 my-2" id="admin-configuarion-text">
        {{ $t("admin.adminConfigurationText") }}
      </div>
      <v-divider class="mt-2" />
      <div class="ma-4">
        <form autocomplete="off" @submit.prevent="submitForm">
          <v-row>
            <v-col class="py-0 col-xs-6 col-sm-3">
              <div>
                <div
                  class="cortx-form-group"
                  :class="{
                    'cortx-form-group--error': $v.createAccount.username.$error
                  }"
                >
                  <label
                    class="cortx-form-group-label"
                    for="Username"
                    id="lblAdminUsername"
                  >
                    <cortx-info-tooltip
                      label="Username*"
                      :message="usernameTooltipMessage"
                    />
                  </label>
                  <div></div>
                  <input
                    class="cortx-form__input_text"
                    type="text"
                    name="username"
                    id="adminUsername"
                    v-model.trim="createAccount.username"
                    @input="$v.createAccount.username.$touch"
                  />
                  <div
                    class="cortx-form-group-label cortx-form-group-error-msg"
                  >
                    <label
                      id="admin-username-required"
                      v-if="
                        $v.createAccount.username.$dirty &&
                        !$v.createAccount.username.required
                      "
                    >
                      {{ $t("admin.adminUsernameReq") }}</label
                    >
                    <label
                      id="admin-username-invalid"
                      v-else-if="
                        $v.createAccount.username.$dirty &&
                        !$v.createAccount.username.accountNameRegex
                      "
                      >{{ $t("admin.usernameInvalid") }}</label
                    >
                    <label
                      id="admin-username-invalid"
                      v-else-if="
                        $v.createAccount.username.$dirty &&
                        !$v.createAccount.username.userNameRegex
                      "
                      >{{ $t("admin.invalidRootUsername") }}</label
                    >
                  </div>
                </div>
              </div>
            </v-col>
            <v-col class="py-0 col-xs-6 col-sm-3">
              <div>
                <div
                  class="cortx-form-group"
                  :class="{
                    'cortx-form-group--error': $v.createAccount.email.$error
                  }"
                >
                  <label
                    class="cortx-form-group-label"
                    for="Email"
                    id="lblAdminEmail"
                    >{{ $t("admin.email") }}*</label
                  >
                  <div></div>
                  <input
                    class="cortx-form__input_text"
                    type="email"
                    name="email"
                    id="adminEmail"
                    v-model.trim="createAccount.email"
                    @input="$v.createAccount.email.$touch"
                  />
                  <div
                    class="cortx-form-group-label cortx-form-group-error-msg"
                  >
                    <label
                      id="admin-email-required"
                      v-if="
                        $v.createAccount.email.$dirty &&
                        !$v.createAccount.email.required
                      "
                    >
                      {{ $t("admin.email-required") }}</label
                    >
                    <label
                      id="admin-email-invalid"
                      v-else-if="
                        $v.createAccount.email.$dirty &&
                        !$v.createAccount.email.email
                      "
                      >{{ $t("admin.email-invalid") }}</label
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
                  class="cortx-form-group"
                  :class="{
                    'cortx-form-group--error': $v.createAccount.password.$error
                  }"
                >
                  <label
                    class="cortx-form-group-label"
                    for="password"
                    id="lblAdminPassword"
                  >
                    <cortx-info-tooltip
                      label="Password*"
                      :message="passwordTooltipMessage"
                    />
                  </label>
                  <div></div>
                  <input
                    class="cortx-form__input_text"
                    type="password"
                    name="password"
                    id="adminPassword"
                    v-model.trim="createAccount.password"
                    @input="$v.createAccount.password.$touch"
                  />
                  <div
                    class="cortx-form-group-label cortx-form-group-error-msg"
                  >
                    <label
                      id="admin-password-required"
                      v-if="
                        $v.createAccount.password.$dirty &&
                        !$v.createAccount.password.required
                      "
                      >{{ $t("admin.password-required") }}</label
                    >
                    <label
                      id="admin-password-invalid"
                      v-else-if="
                        $v.createAccount.password.$dirty &&
                        !$v.createAccount.password.passwordRegex
                      "
                      >{{ $t("admin.password-invalid") }}</label
                    >
                  </div>
                </div>
              </div>
            </v-col>
            <v-col class="py-0 col-xs-6 col-sm-3">
              <div>
                <div
                  class="cortx-form-group"
                  :class="{
                    'cortx-form-group--error':
                      $v.createAccount.confirmPassword.$error
                  }"
                >
                  <label
                    class="cortx-form-group-label"
                    for="confirmPassword"
                    id="lblConfirmAdminPassword"
                    >{{ $t("admin.confirm-password") }}*</label
                  >
                  <div></div>
                  <input
                    class="cortx-form__input_text"
                    type="password"
                    name="confirmPassword"
                    id="confirmAdminPassword"
                    v-model.trim="createAccount.confirmPassword"
                    @input="$v.createAccount.confirmPassword.$touch"
                    v-on:keyup.enter="handleEnterEvent()"
                  />
                  <div
                    class="cortx-form-group-label cortx-form-group-error-msg"
                  >
                    <label
                      id="admin-confirmpass-notmatch"
                      v-if="
                        $v.createAccount.confirmPassword.$dirty &&
                        !$v.createAccount.confirmPassword.sameAsPassword
                      "
                      >{{ $t("admin.confirm-password-invalid") }}</label
                    >
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
          <button
            id="admin-createadminuser"
            type="button"
            class="cortx-btn-primary"
            @click="gotToNextPage()"
            :disabled="
              !isSystemStable ||
              $v.createAccount.$invalid ||
              createUserInProgress
            "
          >
            {{ $t("admin.applyContinue") }}
          </button>
        </form>
        <div
          v-if="!isValidResponse"
          class="red--text mt-2"
          id="admin-invalidmsg"
        >
          {{ invalidMessage }}
        </div>
        <CortxMessageDialog></CortxMessageDialog>
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
  commaSeparatedEmailsRegex,
  userNameRegex
} from "./../../common/regex-helpers";
import { invalid } from "moment";
import i18n from "./preboarding.json";
import CortxMessageDialog from "../widgets/cortx-message-dialog.vue";
import { unsupportedFeatures } from "../../common/unsupported-feature";

@Component({
  name: "cortx-admin-user",
  i18n: {
    messages: i18n
  },
  components: {
    CortxMessageDialog
  }
})
export default class CortxAdminUser extends Vue {
  public unsupportedFeatures = unsupportedFeatures;

  @Validations()
  public validations = {
    createAccount: {
      username: { required, accountNameRegex, userNameRegex },
      password: { required, passwordRegex },
      confirmPassword: {
        sameAsPassword: sameAs("password")
      },
      email: { required, email }
    }
  };

  public data() {
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
      usernameTooltipMessage,
      isSystemStable: true
    };
  }

  public async mounted() {
    await this.getSyetmStatus();
  }

  public async getSyetmStatus() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      this.$t("admin.systemStatus")
    );
    try {
      const dbName = { key: "consul" };
      const res: any = await Api.getAll(apiRegister.system_status, dbName);
      this.$store.dispatch("systemConfig/hideLoader");
    } catch (error) {
      this.$data.isSystemStable = false;
      let errorMessage = "Please check service status.";
      if (error.data.consul !== "success" && error.data.es !== "success") {
        errorMessage = error.data.consul + " " + "and" + " " + error.data.es;
      } else if (error.data.consul !== "success") {
        errorMessage = error.data.consul;
      } else if (error.data.es !== "success") {
        errorMessage = error.data.es;
      }
      throw {
        error: {
          message: errorMessage
        }
      };
    } finally {
      this.$store.dispatch("systemConfig/hideLoader");
    }
  }

  private async gotToNextPage() {
    const queryParams = {
      username: this.$data.createAccount.username,
      password: this.$data.createAccount.password,
      email: this.$data.createAccount.email,
      alert_notification: this.$data.createAccount.alert_notification,
      role: 'admin'
    };
    this.$data.isValidResponse = true;
    this.$data.createUserInProgress = true;
    this.$data.invalidMessage = "";

    this.$store.dispatch("systemConfig/showLoader", "Creating admin user...");
    try {
      const res = await Api.post(apiRegister.csm_user, queryParams, {
        timeout: 60000
      });
      if (res) {
        this.$router.push({ name: "preboarding-login" });
      } else {
        throw new Error("Create admin user failed");
      }
    } catch (error) {
      this.$data.isValidResponse = false;
      this.$data.invalidMessage = error.data.message;
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
.cortx-form__input_text {
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
