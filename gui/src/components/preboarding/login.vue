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

    <cortx-reset-password
      v-if="showResetPasswordDialog"
      :showResetPasswordDialog="showResetPasswordDialog"
      :authToken="authToken"
      :username="loginForm.username"
      @closeResetPass="closeResetPassword"
    ></cortx-reset-password>

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
import { required } from "vuelidate/lib/validators";
import { UserLoginQueryParam } from "./../../models/user-login";
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
  public showResetPasswordDialog: boolean = false;
  public ifResetPassword: boolean = true;
  private showSuccessDialog: boolean = false;
  private successMessage: string = "";
  public authToken: any;

  @Validations()
  public validations = {
    loginForm: {
      username: { required },
      password: { required }
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
        if (!this.ifResetPassword) {
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

  public async closeResetPassword() {
    this.showResetPasswordDialog = false;
    this.successMessage = `${this.$t("login.password-reset-message")} ${
      this.loginForm.username
    }`;
    this.showSuccessDialog = true;
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
