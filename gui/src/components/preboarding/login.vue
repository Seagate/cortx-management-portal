<template>
  <v-container class="pa-0 ma-0 col-12 black">
    <div height="70em" class="pl-10 py-5">
      <img src="../../assets/logo.png" />
    </div>
    <v-divider class="mx-0 grey darken-3"></v-divider>
    <v-container class="black px-10 pt-5" fluid>
      <div class="ml-4 white--text headline my-10">EXOS Edge Login</div>
      <div class="ma-4">
        <form autocomplete="off" @submit.prevent="submitForm">
          <div class="mt-4">
            <span class="white--text font-weight-medium">Username</span>
            <div>
              <input class="input-text white" type="text" name="username" v-model.trim="username" />
              <p v-if="!isUserNameValid" class="red--text error-message">Username is not valid</p>
            </div>
          </div>

          <div class="mt-4">
            <span class="font-weight-medium white--text">Password</span>
            <div>
              <input
                class="input-text white"
                type="password"
                name="password"
                v-model.trim="password"
              />
              <p v-if="!isPasswordValid" class="red--text error-message">Password is not valid</p>
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
          <v-btn class="mt-10" elevation="0" color="green">
            <span class="white--text" @click="gotToNextPage()">Get Started</span>
          </v-btn>
        </form>
      </div>
    </v-container>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { UserLoginQueryParam } from "./../../models/user-login";

@Component({
  name: "eos-login"
})
export default class EosLogin extends Vue {
  private mounted() {
    this.$store.commit("alerts/setOnboardingFlag", false);
  }
  private data() {
    return {
      username: "",
      password: ""
    };
  }
  private gotToNextPage() {
    if (this.isValidForm) {
      const queryParams: UserLoginQueryParam = {
        username: this.$data.username,
        password: this.$data.password
      };

      this.$store
        .dispatch("userLogin/loginAction", queryParams)
        .then((res: any) => {
          if (res.token) {
            this.$router.push("/");
          }
        })
        .catch(() => {
          // tslint:disable-next-line: no-console
          console.error("Login Action Failed");
        });
    }
  }
  get isValidForm() {
    if (this.isUserNameValid && this.isPasswordValid) {
      return true;
    }
    return false;
  }
  get isUserNameValid() {
    return !!this.$data.username;
  }
  get isPasswordValid() {
    return !!this.$data.password;
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
button.v-btn[disabled] {
  background-color: green;
  opacity: 0;
}
</style>
