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
    <div class="cortx-header-container">
      <div class="cortx-header py-3">
        <div class="cortx-brand-logo"></div>
        <div class="cortx-header-right-aligned-items">
          <cortx-has-access
            :to="$cortxUserPermissions.alerts + $cortxUserPermissions.list"
          >
            <div
              class="cortx-logout-icon-container pr-9"
              @click="
                $router.push({
                  name: 'alerts-large',
                  query: { tm: new Date().getTime() }
                })
              "
              v-if="!isRouterPathOnboarding"
            >
              <div v-if="alertNotifications.alertCount > 0">
                <img
                  :src="require('@/assets/navigation/alerts-dot-white.svg')"
                  id="alert-dotwhite"
                />
              </div>
              <div v-else>
                <img
                  :src="require('@/assets/navigation/alerts-white.svg')"
                  id="alert-whiteicon"
                />
              </div>
            </div>
          </cortx-has-access>
          <div @click="isMenuOpen = !isMenuOpen">
            <label class="cortx-username-label" id="header-username">{{
              username
            }}</label>
          </div>
          <div
            @click="isMenuOpen = !isMenuOpen"
            id="logouticon"
            class="cortx-logout-icon-container"
            v-if="!isRouterPathOnboarding"
          >
            <img
              :src="require('@/assets/logout.svg/')"
              id="logout-icon"
            />
          </div>
          <div>
            <div
              class="cortx-dropdown-container"
              @click="isMenuOpen = !isMenuOpen"
            >
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
              <div
                class="cortx-dropdown-menu-item"
                @click="openChangePassword()"
              >
                <span class="cortx-text-md cortx-dropdown-menu-item-text"
                  >Change Password</span
                >
              </div>
              <div class="cortx-dropdown-menu-item" @click="logout()">
                <span class="cortx-text-md cortx-dropdown-menu-item-text"
                  >Logout</span
                >
              </div>
            </div>
          </div>
        </div>
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
          <div
            class="cortx-form-group">
            <label
              class="cortx-form-group-label"
              for="password"
              id="current-password"
            >{{ $t("common.current-password-label") }}</label>
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
          <div class="cortx-form-group"
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
          <div class="cortx-form-group"
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
        <v-col class="col-6 ml-7 pb-6 pt-0">
          <button
            type="button"
            id="change-password-button"
            class="cortx-btn-primary"
            @click="changePassword()"
            :disabled="$v.changePasswordForm.$invalid"
          >{{ $t("common.change-password") }}</button>
          <button
            type="button"
            id="cancel-button"
            class="cortx-btn-tertiary"
            @click="closeChangePasswordForm()"
          >{{ $t("common.cancel") }}</button>
        </v-col>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Validations } from "vuelidate-property-decorators";
import { required, helpers, sameAs } from "vuelidate/lib/validators";
import store from "../../store/store";
import VueNativeSock from "vue-native-websocket";
import i18n from "../../i18n";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import { userPermissions } from "../../common/user-permissions-map";
import { passwordRegex } from "../../common/regex-helpers"

@Component({
  name: "HeaderBar"
})
export default class HeaderBar extends Vue {
  public username: string = "";
  public isMenuOpen: Boolean = false;
  public showChangePasswordDialog: Boolean = false;
  public changePasswordForm = {
    currentPassword: "",
    password: "",
    confirmPassword: ""
  };

  @Validations()
  public validations = {
    changePasswordForm: {
      currentPassword: { required },
      password: { required, passwordRegex },
      confirmPassword: {
        sameAsPassword: sameAs("password")
      }
    }
  }
  public data() {
    return {
      constStr: require("./../../common/const-string.json")
    };
  }
  public mounted() {
    const wsUrl = `wss://${window.location.hostname}:${process.env.VUE_APP_WS_PORT}/ws`;
    Vue.use(VueNativeSock, wsUrl, {
      store,
      format: "json",
      reconnection: true, // (Boolean) whether to reconnect automatically (false)
      reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
      reconnectionDelay: 3000 // (Number) how long to initially wait before attempting a new (1000) })
    });
    const vueInstance: any = this;
    if (
      vueInstance.$hasAccessToCsm(userPermissions.alerts + userPermissions.list)
    ) {
      this.$store.dispatch("alertDataAction");
    }
    const usernameStr = localStorage.getItem(this.$data.constStr.username);
    if (usernameStr) {
      this.username = usernameStr;
    }
  }

  get isRouterPathOnboarding() {
    return this.$route.name === "onboarding";
  }

  get alertNotifications() {
    return this.$store.state.alertNotification.socket;
  }
  private logout() {
    // Invalidate session from Server, remove localStorage token and re-route to login page
    this.$store.dispatch("userLogin/logoutAction").finally(() => {
      localStorage.removeItem(this.$data.constStr.access_token);
    });
    this.$store.commit("userLogin/setUserPermissions", {});
    localStorage.removeItem(this.$data.constStr.username);
    this.$router.push("/login");
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
}
</script>

<style lang="scss" scoped>
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
.cortx-header-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 5;
}
.cortx-logo-separator {
  margin: 1em 1.206em 1em 1.206em;
  border: 1px solid #454545;
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
.cortx-header-right-aligned-items {
  margin-left: auto;
  display: flex;
  flex-wrap: nowrap;
}
.cortx-logout-icon-container {
  padding: 0 0 1.125em 0.625em;
  cursor: pointer;
}
</style>
