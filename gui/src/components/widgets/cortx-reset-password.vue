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
</template>
<script lang="ts">

import { Component, Vue, Prop } from "vue-property-decorator";
import { Validations } from "vuelidate-property-decorators";
import { required, sameAs } from "vuelidate/lib/validators";
import {
  passwordRegex,
  passwordTooltipMessage
} from "./../../common/regex-helpers";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import i18n from "../preboarding/preboarding.json";

@Component({
  name: "cortx-reset-password",
  i18n: {
    messages: i18n
  }
})
export default class CortxResetPasswrod extends Vue {    
  public resetAccountForm: any = {
    password: "",
    confirmPassword: ""
  };  
  private passwordTooltipMessage: any = passwordTooltipMessage;

  @Prop({ default: false})
  public showResetPasswordDialog: boolean

  @Validations()
  public validations: any = {
    resetAccountForm: {
      password: { required, passwordRegex },
      confirmPassword: {
        sameAsPassword: sameAs("password")
      }
    }
  };

  private async resetPassword() {
    const username: any = localStorage.getItem("username");
    const updatePassword: any = {
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
      updatePassword,
      username
    );
    this.closeResetPasswordForm();
    this.$store.dispatch("systemConfig/hideLoader");
  }

  public closeResetPasswordForm() {
    this.showResetPasswordDialog = false;
    this.resetAccountForm = {
      password: "",
      confirmPassword: ""
    };
    if (this.$v.resetAccountForm) {
      this.$v.resetAccountForm.$reset();
    }
    this.$emit("complete");
  }

}
</script>