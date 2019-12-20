<template>
  <v-container class="white" fluid>
    <div height="70em" class="pl-0 py-0 col-12 black">
      <img src="../../assets/logo.png" />
    </div>
    <div class="body-2 ma-10">
      <div class="ml-4 mt-4 mb-1 title black--text">Admin User Configuration</div>
      <div class="ml-4 mb-7">Configure the username and password for the admin user of this system.</div>
      <div class="ma-4">
        <form autocomplete="off" @submit.prevent="submitForm">
          <div class="mt-4">
            <span class="font-weight-medium">Admin Username</span>
            <div>
              <input class="input-text" type="text" name="username" v-model.trim="username" />
              <p v-if="!isUserNameValid" class="red--text error-message">Username is not valid</p>
            </div>
          </div>

          <div class="mt-4">
            <span class="font-weight-medium">Password</span>
            <div>
              <input class="input-text" type="password" name="password" v-model.trim="password" />
              <p v-if="!isPasswordValid" class="red--text error-message">Password is not valid</p>
            </div>
          </div>

          <div class="mt-4 mb-6">
            <span class="font-weight-medium">Confirm password</span>
            <div>
              <input
                class="input-text"
                type="password"
                name="confirmpassword"
                v-model.trim="confirmPassword"
              />
              <p
                v-if="!isConfirmPasswordValid"
                class="red--text error-message"
              >Confirm password is not valid</p>
            </div>
          </div>
          <v-btn elevation="0" color="csmprimary" @click="gotToNextPage()" :disabled="!isValidForm">
            <span class="white--text">Apply and Continue</span>
          </v-btn>
        </form>
      </div>
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { UserLoginQueryParam } from "./../../models/user-login";

@Component({
  name: "eos-admin-user"
})
export default class EosAdminUser extends Vue {
  private mounted() {
    this.$store.commit("alerts/setOnboardingFlag", false);
  }
  private data() {
    return {
      username: "",
      password: "",
      confirmPassword: ""
    };
  }
  private gotToNextPage() {
    if (this.isValidForm) {
      const queryParams: UserLoginQueryParam = {
        username: this.$data.username,
        password: this.$data.password
      };
      this.$store
        .dispatch("userLogin/createUserAction", queryParams)
        .then((res: any) => {
          if (res.status === 200) {
            this.$router.push("login");
          }
        })
        .catch(() => {
          // tslint:disable-next-line: no-console
          console.error("Create User Action Failed");
        });
    }
  }
  get isValidForm() {
    if (
      this.isUserNameValid &&
      this.isPasswordValid &&
      this.isConfirmPasswordValid
    ) {
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
  get isConfirmPasswordValid() {
    if (
      this.$data.confirmPassword === "" ||
      this.$data.password !== this.$data.confirmPassword
    ) {
      return false;
    }
    return true;
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
</style>
