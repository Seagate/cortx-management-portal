<template>
  <v-container class="pa-0 ma-0 col-12 black">
    <div height="70em" class="pl-10 py-5">
      <img src="../../assets/logo.png" />
    </div>
    <v-divider class="mx-0 grey darken-3"></v-divider>
    <v-container class="black px-10 pt-5" fluid>
      <div class="ml-4 white--text headline my-10">EXOS Edge Login</div>
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
              placeholder="Username"
              v-model.trim="loginForm.username"
              @input="$v.loginForm.username.$touch"
              v-on:keyup.enter="handleEnterEvent()"
            />
            <span
              class="eos-form-group-label eos-form-group-error-msg"
              v-if="
                $v.loginForm.username.$dirty && !$v.loginForm.username.required
              "
              >Username is required</span
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
              placeholder="Password"
              v-model.trim="loginForm.password"
              @input="$v.loginForm.password.$touch"
              v-on:keyup.enter="handleEnterEvent()"
            />
            <span
              class="eos-form-group-label eos-form-group-error-msg"
              v-if="
                $v.loginForm.password.$dirty && !$v.loginForm.password.required
              "
              >Password is required</span
            >
          </div>

          <button
            type="button"
            class="eos-btn-primary-dark"
            @click="gotToNextPage()"
            :disabled="$v.loginForm.$invalid"
          >
            Login
          </button>
          <!--TODO: This is temporary error handling for Demo-->
          <div v-if="!isValidLogin" class="red--text mt-1">Login failed !</div>
        </form>
      </div>
    </v-container>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Validations } from "vuelidate-property-decorators";
import { required } from "vuelidate/lib/validators";
import { UserLoginQueryParam } from "./../../models/user-login";

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
      conststr: require("./../../common/const-string.json"),
      isValidLogin: true
    };
  }

  private handleEnterEvent() {
    if (this.$v.loginForm && !this.$v.loginForm.$invalid) {
      this.gotToNextPage();
    }
  }

  private gotToNextPage() {
    // Hide login err message
    this.$data.isValidLogin = true;
    this.$store
      .dispatch("userLogin/loginAction", this.loginForm)
      .then((res: any) => {
        if (res.authorization) {
          const user: any = {
            username: this.loginForm.username
          };
          this.$store.commit("userLogin/setUser", user);
          localStorage.setItem(
            this.$data.conststr.access_token,
            res.authorization
          );
          this.navigate();
        } else {
          // Show error message on screen
          this.$data.isValidLogin = false;
        }
      })
      .catch(() => {
        // Show error message on screen
        this.$data.isValidLogin = false;
      });
  }

  private navigate() {
    if (this.$route.name === "normal-login") {
      this.$router.push("/");
    } else {
      this.$router.push("/onboarding");
    }
  }
}
</script>

<style lang="scss" scoped></style>
