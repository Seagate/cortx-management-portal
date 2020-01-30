<template>
  <v-container class="white pa-0 ma-0" fluid>
    <div height="70em" class="pl-0 py-0 col-12 black">
      <img src="../../assets/logo.png" />
    </div>
    <div class="body-2 ma-10">
      <div
        class="ml-4 mt-4 mb-1 black--text font-weight-bold"
        style="font-size: 18px"
      >Admin User Configuration</div>
      <div class="ml-4 mb-7">Configure the username and password for the admin user of this system.</div>
      <div class="ma-4">
        <form autocomplete="off" @submit.prevent="submitForm">
          <div class="mt-4">
            <div
              class="eos-form-group"
              :class="{ 'eos-form-group--error': $v.createAccount.username.$error }"
            >
              <label
                class="eos-form-group-label"
                for="Username"
                id="lblAdminUsername"
              >Admin username*</label>
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
                  v-if="$v.createAccount.username.$dirty && !$v.createAccount.username.required"
                >Username Name is required</label>
              </div>
            </div>
          </div>
          <div class="mt-4">
            <div
              class="eos-form-group"
              :class="{ 'eos-form-group--error': $v.createAccount.password.$error }"
            >
              <label class="eos-form-group-label" for="password" id="lblAdminPassword">Password*</label>
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
                  v-if="$v.createAccount.password.$dirty && !$v.createAccount.password.required"
                >Password is required</label>
              </div>
            </div>
          </div>
          <div class="mt-4">
            <div
              class="eos-form-group"
              :class="{ 'eos-form-group--error': $v.createAccount.confirmPassword.$error }"
            >
              <label
                class="eos-form-group-label"
                for="confirmPassword"
                id="lblAdminPassword"
              >Confirm password*</label>
              <div></div>
              <input
                class="eos-form__input_text"
                type="password"
                name="confirmPassword"
                id="adminPassword"
                v-model.trim="createAccount.confirmPassword"
                @input="$v.createAccount.confirmPassword.$touch"
              />
              <div class="eos-form-group-label eos-form-group-error-msg">
                <label
                  v-if="$v.createAccount.confirmPassword.$dirty && !$v.createAccount.confirmPassword.sameAsPassword"
                >Passwords do not match</label>
              </div>
            </div>
          </div>
          <v-btn
            elevation="0"
            color="csmprimary"
            @click="gotToNextPage()"
            :disabled="$v.createAccount.$invalid"
          >
            <span class="white--text">Apply and continue</span>
          </v-btn>
        </form>
        <div v-if="!isValidResponse" class="red--text mt-2">Create admin user failed</div>
      </div>
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { UserLoginQueryParam } from "./../../models/user-login";
import { Validations } from "vuelidate-property-decorators";
import { required, helpers, sameAs } from "vuelidate/lib/validators";

@Component({
  name: "eos-admin-user"
})
export default class EosAdminUser extends Vue {
  @Validations()
  public validations = {
    createAccount: {
      username: { required },
      password: { required },
      confirmPassword: {
        sameAsPassword: sameAs("password")
      }
    }
  };
  private mounted() {
    this.$store.commit("alerts/setOnboardingFlag", false);
  }
  private data() {
    return {
      createAccount: {
        username: "",
        password: "",
        confirmPassword: ""
      },
      isValidResponse: true
    };
  }
  private gotToNextPage() {
    const queryParams: UserLoginQueryParam = {
      username: this.$data.createAccount.username,
      password: this.$data.createAccount.password
    };
    this.$data.isValidResponse = true;

    this.$store
      .dispatch("userLogin/createUserAction", queryParams)
      .then((res: any) => {
        if (res.status === 200) {
          this.$router.push("preboarding-login");
        } else {
          this.$data.isValidResponse = false;
        }
      })
      .catch(() => {
        // tslint:disable-next-line: no-console
        console.error("Create User Action Failed");
        this.$data.isValidResponse = false;
      });
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
