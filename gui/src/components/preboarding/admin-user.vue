<template>
  <v-container class="white pa-0 ma-0" fluid>
    <div height="70em" class="pl-0 py-0 col-12 black">
      <img src="../../assets/logo.png" />
    </div>
    <div class="body-2 ma-10">
      <div
        class="ml-4 mt-4 mb-1 black--text font-weight-bold"
        style="font-size: 18px"
      >
        Admin user configuration
      </div>
      <div class="ml-4 mb-7">
        Configure the username and password for the admin user of this system.
      </div>
      <div class="ma-4">
        <form autocomplete="off" @submit.prevent="submitForm">
          <div class="mt-4">
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
                  label="Admin username*"
                  message="minimum 8 characters. Only alphanumeric, underscore and hyphen are allowed"
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
                  >Username Name is required</label
                >
                <label
                  v-else-if="
                    $v.createAccount.username.$dirty &&
                      !$v.createAccount.username.accountNameRegex
                  "
                  >Invalid username</label
                >
              </div>
            </div>
          </div>
          <div class="mt-4">
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
                  message="minimum 8 characters, must contain at least 1 capital, 1 small, 1 special, 1 numeric character"
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
                  >Password is required</label
                >
                <label
                  v-else-if="
                    $v.createAccount.password.$dirty &&
                      !$v.createAccount.password.passwordRegex
                  "
                  >Invalid password</label
                >
              </div>
            </div>
          </div>
          <div class="mt-4">
            <div
              class="eos-form-group"
              :class="{
                'eos-form-group--error': $v.createAccount.confirmPassword.$error
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
              />
              <div class="eos-form-group-label eos-form-group-error-msg">
                <label
                  v-if="
                    $v.createAccount.confirmPassword.$dirty &&
                      !$v.createAccount.confirmPassword.sameAsPassword
                  "
                  >Passwords do not match</label
                >
              </div>
            </div>
          </div>
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
import { required, sameAs } from "vuelidate/lib/validators";
import { accountNameRegex, passwordRegex } from "./../../common/regex-helpers";
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
      }
    }
  };
  private data() {
    return {
      createAccount: {
        username: "",
        password: "",
        confirmPassword: ""
      },
      isValidResponse: true,
      invalidMessage: "",
      createUserInProgress: false
    };
  }
  private gotToNextPage() {
    const queryParams: UserLoginQueryParam = {
      username: this.$data.createAccount.username,
      password: this.$data.createAccount.password
    };
    this.$data.isValidResponse = true;
    this.$data.createUserInProgress = true;
    this.$data.invalidMessage = "";

    this.$store.dispatch("systemConfig/showLoader", "Creating admin user...");

    this.$store
      .dispatch("userLogin/createUserAction", queryParams)
      .then((res: any) => {
        if (res) {
          this.$store.dispatch("systemConfig/hideLoader");
          this.$data.createUserInProgress = false;
          this.$router.push({ name: "preboarding-login" });
        } else {
          throw new Error("Create admin user failed");
        }
      })
      .catch((e: any) => {
        this.$data.isValidResponse = false;
        this.$data.createUserInProgress = false;
        this.$data.invalidMessage = e.message;
        this.$store.dispatch("systemConfig/hideLoader");
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
