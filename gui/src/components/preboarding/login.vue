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
  <v-container
    v-if="!isUserLoggedIn"
    class="pa-0 ma-0 col-12 black black-container-height"
  >
    <div class="cortx-header pl-10 py-3">
      <div class="cortx-brand-logo"></div>
    </div>
    <v-divider class="mx-0 grey darken-3"></v-divider>
    <v-container class="black px-10 pt-5" fluid>
      <div class="ml-4 white--text headline my-10" id="login-racklogin-title">{{ $t("common.login") }}</div>
      <div class="ma-4">
        <form autocomplete="off">
          <div
            class="cortx-form-group"
            :class="{ 'cortx-form-group--error': $v.loginForm.username.$error }"
          >
            <input
              class="cortx-form__input_text"
              type="text"
              id="username"
              name="username"
              :placeholder="userNamePlaceholder"
              v-model.trim="loginForm.username"
              @input="$v.loginForm.username.$touch"
              v-on:keyup.enter="handleEnterEvent()"
            />
            <span
             id="login-username-required"
              class="cortx-form-group-label cortx-form-group-error-msg"
              v-if="
                $v.loginForm.username.$dirty && !$v.loginForm.username.required
              "
              >{{ $t("login.user-name-required") }}</span
            >
          </div>
          <div
            class="cortx-form-group"
            :class="{ 'cortx-form-group--error': $v.loginForm.password.$error }"
          >
            <input
              class="cortx-form__input_text"
              type="password"
              id="password"
              name="password"
              :placeholder="passwordPlaceholder"
              v-model.trim="loginForm.password"
              @input="$v.loginForm.password.$touch"
              v-on:keyup.enter="handleEnterEvent()"
            />
            <span id="login-password-required"
              class="cortx-form-group-label cortx-form-group-error-msg"
              v-if="
                $v.loginForm.password.$dirty && !$v.loginForm.password.required
              "
              >{{ $t("login.password-required") }}</span
            >
          </div>
          <button
            id="login-userbtn"
            type="button"
            class="cortx-btn-primary-dark"
            @click="gotToNextPage()"
            :disabled="$v.loginForm.$invalid || loginInProgress"
          >
          {{ $t("login.login-btn") }}
          </button>
          <!--TODO: This is temporary error handling for Demo-->
          <div v-if="!isValidLogin" class="red--text mt-1" id="login-failsmsg">{{ $t("login.login-failed") }}</div>
        </form>
      </div>
    </v-container>
    
    <v-dialog
      v-model="showResetPasswordDialog"
      persistent
      max-width="500"
      id="reset-password-form"
      >
      <v-card>
        <v-card-title class="title mt-6 ml-3">
          <span>{{ $t("login.change-password") }}</span>
        </v-card-title>
        <v-divider />
        <v-col class="col-6 ml-7 pb-0">
          <div
            class="cortx-form-group"
            :class="{
              'cortx-form-group--error': $v.resetAccountForm.password.$error
            }"
          >
            <label
              class="cortx-form-group-label"
              for="user-password"
              id="new-password-label"
            >
              <cortx-info-tooltip
                :label="$t('common.new-password-label')"
                :message="passwordTooltipMessage"
              />
            </label>
            <input
              class="cortx-form__input_text"
              type="password"
              id="user-password"
              name="user-password"
              v-model.trim="resetAccountForm.password"
              @input="$v.resetAccountForm.password.$touch"
            />
            <div class="cortx-form-group-label cortx-form-group-error-msg">
              <label
                id="new-password-required-error"
                v-if="
                  $v.resetAccountForm.password.$dirty &&
                  !$v.resetAccountForm.password.required
                "
                >{{ $t("common.password-required") }}</label
              >
              <label
                id="new-password-invalid-error"
                v-else-if="
                  $v.resetAccountForm.password.$dirty &&
                  !$v.resetAccountForm.password.passwordRegex
                "
                >{{ $t("common.invalid-password") }}</label
              >
            </div>
          </div>
        </v-col>
        <v-col class="col-6 ml-7 pt-0">
          <div
            class="cortx-form-group"
            :class="{
              'cortx-form-group--error':
                $v.resetAccountForm.confirmPassword.$error
            }"
          >
            <label
              class="cortx-form-group-label"
              for="confirm-password"
              id="confirm-password-label"
              >{{ $t("common.confirm-password-label") }}</label
            >
            <input
              class="cortx-form__input_text"
              type="password"
              id="confirm-password"
              name="confirm-password"
              v-model.trim="resetAccountForm.confirmPassword"
              @input="$v.resetAccountForm.confirmPassword.$touch"
            />
            <span
              id="confirm-password-notmatch-error"
              class="cortx-form-group-label cortx-form-group-error-msg"
              v-if="
                $v.resetAccountForm.confirmPassword.$dirty &&
                !$v.resetAccountForm.confirmPassword.sameAsPassword
              "
              >{{ $t("common.password-not-match") }}</span
            >
          </div>
        </v-col>
        <v-col class="col-6 ml-7 pb-6 pt-0">
          <button
            type="button"
            id="reset-password-button"
            class="cortx-btn-primary"
            @click="resetPassword()"
            :disabled="$v.resetAccountForm.$invalid"
          >
            {{ $t("login.reset-btn") }}
          </button>
        </v-col>
      </v-card>
    </v-dialog>
      
    <cortx-confirmation-dialog
      id="success-dialog"
      :show="showSuccessDialog"
      title="Success"
      :message="successMessage"
      @closeDialog="closeSuccessDialog"
      confirmButtonText="Ok"
      cancelButtonText=""
    ></cortx-confirmation-dialog>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Validations } from "vuelidate-property-decorators";
import { required, sameAs } from "vuelidate/lib/validators";
import { UserLoginQueryParam } from "./../../models/user-login";
import {
  accountNameRegex,
  passwordRegex,
  passwordTooltipMessage
} from "./../../common/regex-helpers";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import i18n from "./preboarding.json";

@Component({
  name: "cortx-login",
  i18n: {
    messages: i18n
  }
})
export default class CortxLogin extends Vue {
  public loginForm: UserLoginQueryParam = {
    username: "",
    password: ""
  };  
  public resetAccountForm = {
    password: "",
    confirmPassword: ""
  };
  public showResetPasswordDialog: boolean = false;
  private passwordTooltipMessage = passwordTooltipMessage;
  private showSuccessDialog: boolean = false;
  private successMessage: string = "";
  public ifResetPassword: boolean = true;
  public authToken: any;

  @Validations()
  public validations = {
    loginForm: {
      username: { required },
      password: { required }
    },
    resetAccountForm: {
      password: { required, passwordRegex },
      confirmPassword: {
        sameAsPassword: sameAs("password")
      }
    }
  };

  private data() {
    return {
      constStr: require("./../../common/const-string.json"),
      isValidLogin: true,
      loginInProgress: false,
      isUserLoggedIn: false,
      userNamePlaceholder: this.$t("login.user-name-placeholder"),
      passwordPlaceholder: this.$t("login.password-placeholder"),
      loginFailed: this.$t("login.login-failed")
    };
  }

  @Watch("$route", { immediate: true, deep: true })
  private onUrlChange(newVal: any) {
    this.$data.isUserLoggedIn = !!localStorage.getItem("username");
  }

  private mounted() {
    this.$store.dispatch("systemConfig/hideLoader");
    this.$store.commit("messageDialog/hide");
    this.$store.commit("userLogin/setUserPermissions", {});
    const token = localStorage.getItem(this.$data.constStr.access_token);
    if (token) {
      this.navigate();
    }
  }
  private async handleEnterEvent() {
    if (
      this.$v.loginForm &&
      !this.$v.loginForm.$invalid &&
      !this.$data.loginInProgress
    ) {
      await this.gotToNextPage();
    }
  }

  private async gotToNextPage() {
    // Hide login err message
    this.$data.isValidLogin = true;
    this.$data.loginInProgress = true;
    try {
      const loginResp: any = await this.$store.dispatch("userLogin/loginAction", this.loginForm);
      if (loginResp.headers.authorization) {
        this.ifResetPassword = loginResp.data.reset_password;
        if (this.ifResetPassword === false) {
          this.authToken = loginResp.headers.authorization;
          this.showResetPasswordDialog = true;
        } else {
          await this.setUserAuthDetails(loginResp.headers.authorization);
        }
      } else {
        throw new Error(this.$data.loginFailed);
      }
    } catch(e) {
      this.$data.isValidLogin = false;
      this.$data.loginInProgress = false;
    }
  }

  private async setUserAuthDetails(authToken: any) {
    const user: any = {
      username: this.loginForm.username
    };
    this.$store.commit("userLogin/setUser", user);
    localStorage.setItem(
      this.$data.constStr.access_token,
      authToken
    );
    localStorage.setItem(this.$data.constStr.username, user.username);
    const permissionsAndUnSuppFeaturesResp: any[] = await Promise.all([
      this.$store.dispatch("userLogin/getUserPermissionsAction"),
      this.$store.dispatch("userLogin/getUnsupportedFeaturesAction")
    ]);
    if (permissionsAndUnSuppFeaturesResp && permissionsAndUnSuppFeaturesResp.length) {
      this.navigate();
    } else {
      throw new Error(this.$data.loginFailed);
    }
  }

  private navigate() {
    if (this.$route.name === "normal-login") {
      this.$router.push("/");
    } else {
      this.$router.push("/onboarding");
    }
  }

  private async resetPassword() {
    const updateDetails = {
      confirmPassword: this.resetAccountForm.confirmPassword,
      password: this.resetAccountForm.password,
      reset_password: true
    };
    this.$store.dispatch(
      "systemConfig/showLoader",
      this.$t("login.loading-reset")
    );
    const res: any = await Api.patch(
      apiRegister.csm_user,
      updateDetails,
      this.loginForm.username,
      {
        headers: {
          auth_token: this.authToken
        }
      }
    );
    this.closeResetPasswordForm();
    this.successMessage = `${this.$t("login.password-reset-message")} ${
      this.loginForm.username
    }`;
    this.showSuccessDialog = true;
    this.$store.dispatch("systemConfig/hideLoader");
  }

  public closeResetPasswordForm() {
    this.resetAccountForm = {
      password: "",
      confirmPassword: ""
    };
    if (this.$v.resetAccountForm) {
      this.$v.resetAccountForm.$reset();
    }
    this.showResetPasswordDialog = false;
  }

  public async closeSuccessDialog() {
    this.showSuccessDialog = false;
    await this.setUserAuthDetails(this.authToken);
    this.navigate();
  }

}
</script>

<style lang="scss" scoped>
</style>
