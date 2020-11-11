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
  <div>
    <div class="cortx-form-group">
      <label class="cortx-form-group-label" :message="accountNameTooltipMessage">Account*</label>
      <cortx-dropdown
        id="account-list-dropdown"
        :options="accountsList"
        :selectedOption.sync="loginForm.account.account_name"
        title="-- Select --"
      ></cortx-dropdown>
      <label
        class="cortx-form-group-label cortx-cursor-pointer"
        style="color: #6ebe49; text-decoration: underline;"
        @click="triggerCreateAccount()"
      >Create new account</label>
    </div>
    <div
      class="cortx-form-group"
      :class="{
        'cortx-form-group--error': $v.loginForm.account.password.$error
      }"
    >
      <label class="cortx-form-group-label" for="accountPassword" id="s3-lblpassword">
        <cortx-info-tooltip
          id="aacount-password"
          label="Password*"
          :message="passwordTooltipMessage"
        />
      </label>
      <input
        class="cortx-form__input_text"
        type="password"
        id="accountPassword"
        name="accountPassword"
        autocomplete="off"
        v-model.trim="loginForm.account.password"
        @input="$v.loginForm.account.password.$touch"
      />
      <div class="cortx-form-group-label cortx-form-group-error-msg">
        <label
          id="s3-password-required"
          v-if="
            $v.loginForm.account.password.$dirty &&
            !$v.loginForm.account.password.required
          "
        >Password is required.</label>
        <label
              id="s3-password-invalid"
              v-else-if="
                $v.loginForm.account.password.$dirty &&
                  !$v.loginForm.account.password.passwordRegex
              "
              >Invalid password.</label
        >        
      </div>
    </div>
    <button
      id="login-btn"
      type="button"
      class="cortx-btn-primary"
      @click="login()"
      :disabled="$v.loginForm.$invalid"
    >Login and continue</button>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Validations } from "vuelidate-property-decorators";
import { required } from "vuelidate/lib/validators";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import {
  accountNameRegex,
  passwordRegex,
  passwordTooltipMessage,
  accountNameTooltipMessage
} from "./../../common/regex-helpers";

@Component({
  name: "login-existing-s3account"
})
export default class LoginExistingS3Account extends Vue {
  public passwordTooltipMessage: string = passwordTooltipMessage;
  public accountsList: any[] = [];
  public s3Url: any[] = [];
  public s3UrlNone: boolean = false;
  public s3UrlInfo: any;

  public loginForm = {
    account: {
      account_name: "",
      password: ""
    }
  };

  @Validations()
  public validations = {
    loginForm: {
      account: {
        account_name: { required },
        password: { required, passwordRegex }
      }
    }
  };

  public async mounted() {
    await this.getAllAccounts();
  }

  public async getAllAccounts() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      "Fetching all S3 accounts..."
    );
    const res: any = await Api.getAll(apiRegister.s3_account);

    if (res && res.data) {
      this.accountsList = res.data.s3_accounts.map((e: any) => {
        return { label: e.account_name, value: e.account_name, email: e.account_email };
      });
      this.s3Url = res.data && res.data.s3_urls ? res.data.s3_urls : [];
      if (this.s3Url[0] === "http://None") {
        this.s3UrlNone = true;
      }
      this.s3UrlInfo = { s3Url: this.s3Url, s3UrlNone: this.s3UrlNone };
      this.$emit("setS3URL", this.s3UrlInfo);
    }

    this.$store.dispatch("systemConfig/hideLoader");
  }

  public triggerCreateAccount() {
    this.$emit("createAccount", true);
  }

  public async login() {
    this.$store.dispatch("systemConfig/showLoader", "Logging in...");
    const selectedAccount: any = this.loginForm.account.account_name;
    const loginCredentials: any = {
      username: selectedAccount.value,
      password: this.loginForm.account.password
    };
    const res = await Api.post(apiRegister.login, loginCredentials);
    this.$store.dispatch("systemConfig/hideLoader");
    if (res && res.headers) {
      this.$emit("setAuthToken", res.headers.authorization,
      this.loginForm.account.account_name, this.loginForm.account.password);
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
