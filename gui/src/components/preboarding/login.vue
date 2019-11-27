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
          <div class="mt-4">
            <span class="white--text font-weight-medium">Username</span>
            <div>
              <InputBox :form="loginForm" :control="loginForm.controls[0]" />
            </div>
          </div>

          <div class="mt-4">
            <span class="font-weight-medium white--text">Password</span>
            <div>
              <InputBox :form="loginForm" :control="loginForm.controls[1]" />
            </div>
          </div>

          <div class="white--text mt-4">
            <div class="pr-5">Language</div>
            <select
              name="language"
              id="cmdLanguage"
              class="input-text pl-2 white black--text"
              style="width: 10em;"
            >
              <option value="celsius">English</option>
            </select>
          </div>
          <button
            type="button"
            class="btn-primary-dark mt-10"
            @click="gotToNextPage()"
            :disabled="!loginForm.isValid"
          >Get Started</button>
        </form>
      </div>
    </v-container>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { UserLoginQueryParam } from "./../../models/user-login";
import InputBox from "../widgets/input-box.vue";
import { Form, FormControl, Validator } from "../widgets/form-widget";

@Component({
  name: "eos-login",
  components: { InputBox }
})
export default class EosLogin extends Vue {
  private loginForm: Form;

  constructor() {
    super();

    const controls: FormControl[] = [
      new FormControl("", "username", "text", "", true, "Username is required"),
      new FormControl(
        "",
        "password",
        "password",
        "",
        true,
        "Password is required"
      )
    ];
    this.loginForm = new Form(controls, false);
  }

  private mounted() {
    this.$store.commit("alerts/setOnboardingFlag", false);
  }
  private data() {
    return {
      conststr: require("./../../common/const-string.json")
    };
  }

  private gotToNextPage() {
    const queryParams: UserLoginQueryParam = this.loginForm.getModel();
    this.$store
      .dispatch("userLogin/loginAction", queryParams)
      .then((res: any) => {
        if (res.authorization) {
          localStorage.setItem(
            this.$data.conststr.access_token,
            res.authorization
          );
          this.$router.push("/dashboard");
        }
      })
      .catch(() => {
        // tslint:disable-next-line: no-console
        console.error("Login Action Failed");
      });
  }
}
</script>

<style lang="scss" scoped>
.input-text {
  border-style: solid;
  border-width: 1px;
  border-color: #e3e3e3;
  width: 20em;
  height: 2.5em;
}
.pointer {
  cursor: pointer;
}
.btn-primary-dark {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid #ffffff;
  box-sizing: border-box;
  border-radius: 4px;
  height: 40px;
  min-width: 64px;
  padding-left: 16px;
  padding-right: 16px;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: #ffffff;
}
.btn-primary-dark:hover {
  background: rgba(255, 255, 255, 0.2);
}
.btn-primary-dark:active {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.2);
}
.btn-primary-dark:focus {
  outline: 0;
}
.btn-primary-dark:disabled {
  opacity: 0.5;
  border: 1px solid #9e9e9e;
  color: #9e9e9e;
}
</style>
