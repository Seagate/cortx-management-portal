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
  <div class="cortx-header-dropdown">
    <div @click="isMenuOpen = !isMenuOpen">
      <label
        class="cortx-username-label  cortx-dropdown-container"
        id="header-username"
        >{{ username }}</label
      >
    </div>
    <div
      @click="isMenuOpen = !isMenuOpen"
      id="logouticon"
      class="cortx-logout-icon-container cortx-dropdown-container"
      v-if="!isRouterPathOnboarding"
    >
      <img :src="require('@/assets/logout.svg/')" id="logout-icon" />
    </div>
    <div class="cortx-dropdown-container" @click="isMenuOpen = !isMenuOpen">
      <img
        v-if="isMenuOpen"
        class="cortx-float-r mr-6"
        :src="require('@/assets/caret-up.svg')"
        id="opendropdown"
      />
      <img
        v-else
        class="cortx-float-r mr-6"
        :src="require('@/assets/caret-down.svg')"
        id="closedropdown"
      />
    </div>
    <div class="cortx-dropdown-menu" v-show="isMenuOpen">
      <div class="cortx-dropdown-menu-item" :disabled="isS3Account">
        <button
          :disabled="isS3Account"
          class="cortx-text-md cortx-dropdown-menu-item-text"
          @click="openChangePassword()"
        >
          {{ $t("common.change-password") }}
        </button>
      </div>
      <div class="cortx-dropdown-menu-item" @click="logout()" id="logout-link">
        <span class="cortx-text-md cortx-dropdown-menu-item-text">{{
          $t("common.logout")
        }}</span>
      </div>
    </div>
    <v-dialog
      v-model="showChangePasswordDialog"
      persistent
      max-width="500"
      id="change-password-form"
    >
      <v-card>
        <v-card-title class="title mt-6 ml-3">
          <span>{{ $t("common.change-password") }}</span>
          <img
            id="close-reset-password-dialog"
            class="cortx-modal-close"
            :src="require('@/assets/close-green.svg')"
            @click="closeChangePasswordForm()"
          />
        </v-card-title>
        <v-divider />
        <v-col class="col-6 ml-7 pb-0">
          <div class="cortx-form-group">
            <label
              class="cortx-form-group-label"
              for="password"
              id="current-password"
              >{{ $t("common.current-password-label") }}</label
            >
            <input
              class="cortx-form__input_text"
              type="password"
              name="current-password"
              v-model.trim="changePasswordForm.currentPassword"
              @input="$v.changePasswordForm.currentPassword.$touch"
            />
            <div class="cortx-form-group-label cortx-form-group-error-msg">
              <label
                id="change-password-required-error"
                v-if="
                  $v.changePasswordForm.currentPassword.$dirty &&
                    !$v.changePasswordForm.currentPassword.required
                "
                >{{ $t("common.password-required") }}</label
              >
            </div>
          </div>
        </v-col>
        <v-col class="col-6 ml-7 pb-0 pt-0">
          <div
            class="cortx-form-group"
            :class="{
              'cortx-form-group--error': $v.changePasswordForm.password.$error
            }"
          >
            <label
              class="cortx-form-group-label"
              for="user-password"
              id="password-label"
            >
              {{ $t("common.new-password-label") }}</label
            >
            <input
              class="cortx-form__input_text"
              type="password"
              id="user-password"
              name="user-password"
              v-model.trim="changePasswordForm.password"
              @input="$v.changePasswordForm.password.$touch"
            />
            <div class="cortx-form-group-label cortx-form-group-error-msg">
              <label
                id="change-password-required-error"
                v-if="
                  $v.changePasswordForm.password.$dirty &&
                    !$v.changePasswordForm.password.required
                "
                >{{ $t("common.password-required") }}</label
              >
              <label
                id="change-password-invalid-error"
                v-else-if="
                  $v.changePasswordForm.password.$dirty &&
                    !$v.changePasswordForm.password.passwordRegex
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
                $v.changePasswordForm.confirmPassword.$error
            }"
          >
            <label
              class="cortx-form-group-label"
              for="confirm-password"
              id="change-confirmpass-label"
              >{{ $t("common.confirm-password-label") }}</label
            >
            <input
              class="cortx-form__input_text"
              type="password"
              id="confirm-password"
              name="confirm-password"
              v-model.trim="changePasswordForm.confirmPassword"
              @input="$v.changePasswordForm.confirmPassword.$touch"
            />
            <span
              id="change-confirmpass-notmatch-error"
              class="cortx-form-group-label cortx-form-group-error-msg"
              v-if="
                $v.changePasswordForm.confirmPassword.$dirty &&
                  !$v.changePasswordForm.confirmPassword.sameAsPassword
              "
              >{{ $t("common.password-not-match") }}</span
            >
          </div>
        </v-col>
        <v-col class="col-8 ml-7 pb-6 pt-0">
          <button
            type="button"
            id="change-password-button"
            class="cortx-btn-primary"
            @click="changePassword()"
            :disabled="$v.changePasswordForm.$invalid"
          >
            {{ $t("common.update-btn") }}
          </button>
          <button
            type="button"
            id="cancel-button"
            class="cortx-btn-tertiary"
            @click="closeChangePasswordForm()"
          >
            {{ $t("common.cancel") }}
          </button>
        </v-col>
      </v-card>
    </v-dialog>
    <cortx-confirmation-dialog
      id="iam-success-dialog"
      :show="showSuccessDialog"
      title="Success"
      :message="successMessage"
      @closeDialog="closeSuccessDialog"
      confirmButtonText="Ok"
      cancelButtonText=""
    ></cortx-confirmation-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { Validations } from "vuelidate-property-decorators";
import { required, helpers, sameAs } from "vuelidate/lib/validators";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import { passwordRegex } from "../../common/regex-helpers";
import { userPermissions } from "../../common/user-permissions-map";
import { USERNAME } from "./../../common/consts";
import LogoutMixin from "./../../mixins/logout";

@Component({
  name: "cortx-header-dropdown"
})
export default class cortxHeaderDropdown extends Mixins(LogoutMixin) {
  public username: string = "";
  public isMenuOpen: boolean = false;
  public showChangePasswordDialog: boolean = false;
  public isS3Account: boolean = false;
  public showSuccessDialog: boolean = false;
  public successMessage: string = "";
  public changePasswordForm = {
    currentPassword: "",
    password: "",
    confirmPassword: ""
  };
  public menuList: any[] = [
    {
      label: "Change Password",
      value: "change_password"
    },
    {
      label: "Logout",
      value: "logout"
    }
  ];

  @Validations()
  public validations = {
    changePasswordForm: {
      currentPassword: { required },
      password: { required, passwordRegex },
      confirmPassword: {
        sameAsPassword: sameAs("password")
      }
    }
  };
  public mounted() {
    const vueInstance: any = this;
    if (
      vueInstance.$hasAccessToCsm(userPermissions.alerts + userPermissions.list)
    ) {
      this.$store.dispatch("alertDataAction");
    }
    if (
      !vueInstance.$hasAccessToCsm(
        vueInstance.$cortxUserPermissions.stats +
          vueInstance.$cortxUserPermissions.list
      ) &&
      vueInstance.$hasAccessToCsm(
        vueInstance.$cortxUserPermissions.s3accounts +
          vueInstance.$cortxUserPermissions.delete
      )
    ) {
      this.isS3Account = true;
    }
    const usernameStr = localStorage.getItem(USERNAME);
    if (usernameStr) {
      this.username = usernameStr;
    }
  }

  private handleComponentDropdownSelect(selected: any) {
    if (selected.value == "logout") {
      this.logout();
    } else {
      this.openChangePassword();
    }
  }
  get isRouterPathOnboarding() {
    return this.$route.name === "onboarding";
  }

  private openChangePassword() {
    this.showChangePasswordDialog = true;
    this.isMenuOpen = false;
  }

  public async changePassword() {
    const updateDetails = {
      current_password: this.changePasswordForm.currentPassword,
      password: this.changePasswordForm.password
    };
    this.$store.dispatch("systemConfig/showLoader", "Updating user details...");
    const res = await Api.patch(
      apiRegister.csm_user,
      updateDetails,
      this.username
    );
    this.closeChangePasswordForm();
    this.$store.dispatch("systemConfig/hideLoader");
    this.successMessage = `${this.$t("common.password-update-message")}`;
    this.showSuccessDialog = true;
  }

  public closeChangePasswordForm() {
    this.isMenuOpen = false;
    this.changePasswordForm = {
      currentPassword: "",
      password: "",
      confirmPassword: ""
    };
    this.showChangePasswordDialog = false;
    this.$v.changePasswordForm.$reset();
  }

  public async closeSuccessDialog() {
    this.showSuccessDialog = false;
  }
}
</script>

<style lang="scss" scoped>
.cortx-header-dropdown {
  display: flex;
}
.cortx-dropdown-container {
  cursor: pointer;
}
.cortx-dropdown-menu {
  position: absolute;
  background: #ffffff;
  width: 10em;
  max-height: 188px;
  box-shadow: 8px 6px 8px rgba(0, 0, 0, 0.12);
  z-index: 4;
  border: 1px solid #6ebe49;
  box-sizing: border-box;
  border-radius: 4px;
  overflow: auto;
  top: 60px;
  right: 24px;
}
.cortx-dropdown-menu-item {
  width: 100%;
  min-height: 36px;
  padding-top: 4px;
  padding-left: 1.187em;
  padding-right: 0.75em;
  cursor: pointer;
}
.cortx-dropdown-menu-item:hover,
.cortx-dropdown-menu-item.selected {
  background: #f5f5f5;
}
.cortx-username-label {
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: #ffffff;
  white-space: nowrap;
}
.cortx-logout-icon-container {
  padding: 0 0 1.125em 0.625em;
  cursor: pointer;
}
.cortx-dropdown-menu-item button[disabled],
.cortx-dropdown-menu-item[disabled] {
  cursor: not-allowed;
}
</style>
