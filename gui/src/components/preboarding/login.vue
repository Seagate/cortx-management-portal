<template>
  <v-container
    v-if="!isUserLoggedIn"
    class="pa-0 ma-0 col-12 black black-container-height"
  >
    <div height="70em" class="pl-10 py-5">
      <img :src="require('@/assets/seagate-green.svg/')" />
      <div class="eos-brand-div">
        <img class="ml-3" :src="require('@/assets/lyve-drive-green.svg/')" />
        <span class="ml-1 eos-brand-label">{{ $t("login.login-label") }}</span>
      </div>
    </div>
    <v-divider class="mx-0 grey darken-3"></v-divider>
    <v-container class="black px-10 pt-5" fluid>
      <div class="ml-4 white--text headline my-10">RACK Login</div>
      <div class="ma-4">
        <form autocomplete="off">
          <div
            class="eos-form-group"
            :class="{ 'eos-form-group--error': $v.loginForm.username.$error }"
          >
            <input
              class="eos-form__input_text"
              type="text"
              id="username"
              name="username"
              :placeholder="userNamePlaceholder"
              v-model.trim="loginForm.username"
              @input="$v.loginForm.username.$touch"
              v-on:keyup.enter="handleEnterEvent()"
            />
            <span
              class="eos-form-group-label eos-form-group-error-msg"
              v-if="
                $v.loginForm.username.$dirty && !$v.loginForm.username.required
              "
              >{{ $t("login.user-name-required") }}</span
            >
          </div>
          <div
            class="eos-form-group"
            :class="{ 'eos-form-group--error': $v.loginForm.password.$error }"
          >
            <input
              class="eos-form__input_text"
              type="password"
              id="password"
              name="password"
              :placeholder="passwordPlaceholder"
              v-model.trim="loginForm.password"
              @input="$v.loginForm.password.$touch"
              v-on:keyup.enter="handleEnterEvent()"
            />
            <span
              class="eos-form-group-label eos-form-group-error-msg"
              v-if="
                $v.loginForm.password.$dirty && !$v.loginForm.password.required
              "
              >{{ $t("login.password-required") }}</span
            >
          </div>
          <button
            type="button"
            class="eos-btn-primary-dark"
            @click="gotToNextPage()"
            :disabled="$v.loginForm.$invalid || loginInProgress"
          >
          {{ $t("login.login-btn") }}
          </button>
          <!--TODO: This is temporary error handling for Demo-->
          <div v-if="!isValidLogin" class="red--text mt-1">{{ $t("login.login-failed") }}</div>
        </form>
      </div>
    </v-container>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Validations } from "vuelidate-property-decorators";
import { required } from "vuelidate/lib/validators";
import { UserLoginQueryParam } from "./../../models/user-login";
import i18n from "./../../i18n";

@Component({
  name: "eos-login"
})
export default class EosLogin extends Vue {
  public loginForm: UserLoginQueryParam = {
    username: "",
    password: ""
  };

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
      userNamePlaceholder: i18n.t("login.user-name-placeholder"),
      passwordPlaceholder: i18n.t("login.password-placeholder")
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
  private handleEnterEvent() {
    if (
      this.$v.loginForm &&
      !this.$v.loginForm.$invalid &&
      !this.$data.loginInProgress
    ) {
      this.gotToNextPage();
    }
  }

  private gotToNextPage() {
    // Hide login err message
    this.$data.isValidLogin = true;
    this.$data.loginInProgress = true;

    this.$store
      .dispatch("userLogin/loginAction", this.loginForm)
      .then((res: any) => {
        if (res.authorization) {
          const user: any = {
            username: this.loginForm.username
          };
          this.$store.commit("userLogin/setUser", user);
          localStorage.setItem(
            this.$data.constStr.access_token,
            res.authorization
          );
          localStorage.setItem(this.$data.constStr.username, user.username);
          return this.$store.dispatch("userLogin/getUserPermissionsAction");
        } else {
          throw new Error("Login Failed");
        }
      })
      .then((res: any) => {
        if (res) {
          this.navigate();
        } else {
          throw new Error("Login Failed");
        }
      })
      .catch(() => {
        // Show error message on screen
        this.$data.isValidLogin = false;
        this.$data.loginInProgress = false;
      });
  }

  private navigate() {
    if (this.$route.name === "normal-login") {
      // Check if user is S3 user by checking the s3accounts:update permission
      // As only the s3 user will have this permission
      const vueInstance: any = this;
      if (
        vueInstance.$hasAccessToCsm(
          vueInstance.$eosUserPermissions.s3accounts +
            vueInstance.$eosUserPermissions.update
        )
      ) {
        this.$router.push("/provisioning/s3");
      } else {
        this.$router.push("/");
      }
    } else {
      this.$router.push("/onboarding");
    }
  }
}
</script>

<style lang="scss" scoped></style>
