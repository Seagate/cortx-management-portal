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
  <div class="body-2">
    <div class="title mt-2 font-weight-bold" id="lblLocalSetting">
      {{ $t("csmuser.user-setting-label") }}
    </div>
    <div class="mt-1" id="lblLocalMsgConfig">
      {{ $t("csmuser.manage-user-text") }}
    </div>
    <div class="mt-1">
      {{ $t("csmuser.role-text") }}
    </div>
    <div class="mt-1">
      {{ $t("csmuser.note-label") }}
    </div>
    <v-divider class="mt-2" />
    <v-row>
      <v-col class="py-0 col-xs-6 col-sm-7">
        <cortx-has-access
          :to="$cortxUserPermissions.users + $cortxUserPermissions.list"
        >
          <v-data-table
            id="localuser-tabledata"
            :items="userData"
            item-key="id"
            class="cortx-table"
            hide-default-header
          >
            <template v-slot:header="{}">
              <tr>
                <th
                  v-for="header in userHeader"
                  :key="header.text"
                  class="tableheader"
                >
                  <span
                    id="localuser-tableheading"
                    class="headerText"
                    :class="
                      header.value === sortColumnName && isSortActive
                        ? 'active'
                        : ''
                    "
                    >{{ header.text }}</span
                  >
                  <span
                    :class="
                      header.value === sortColumnName && isSortActive
                        ? 'active'
                        : 'notActive'
                    "
                  >
                    <img
                      id="localuser-table-desc"
                      v-if="
                        header.sortable && header.sortDir === alertStatus.desc
                      "
                      :src="require('@/assets/widget/table-sort-desc.svg/')"
                      class="d-inline-block"
                      style="vertical-align: bottom; margin-left: -0.3em;"
                      height="20"
                      width="20"
                    />
                    <img
                      id="localuser-table-asc"
                      v-if="
                        header.sortable && header.sortDir === alertStatus.asc
                      "
                      :src="require('@/assets/widget/table-sort-asc.svg/')"
                      class="d-inline-block"
                      style="vertical-align: bottom; margin-left: -0.3em;"
                      height="20"
                      width="20"
                    />
                  </span>
                </th>
                <th class="tableheader" />
              </tr>
            </template>
            <template v-slot:item="props">
              <tr
                :class="
                  selectedRows.indexOf(props.item.id) > -1
                    ? 'selected-row font-weight-small'
                    : 'font-weight-small'
                "
                @click="toggleSelection(props.item.id)"
              >
                <td id="localuser-name">
                  {{ props.item.username }}
                </td>
                <td id="localuser-email">
                  {{ props.item.email }}
                </td>
                <td>
                  <span v-for="(role, i) in props.item.roles" :key="role"
                    >{{ i == 0 ? "" : ", " }}{{ role | capitalize }}</span
                  >
                </td>
                <td class="action-col-width">
                  <span>
                    <img
                      v-if="
                        isLoggedInUserAdmin() ||
                          strEqualityCaseInsensitive(
                            props.item.username,
                            loggedInUserName
                          )
                      "
                      class="ml-2 cortx-cursor-pointer"
                       id="localuser-editicon"
                      @click="onEditBtnClick(props)"
                      title="Edit"
                      src="./../../../../assets/actions/edit-green.svg"
                    />
                    <cortx-has-access
                      :to="
                        $cortxUserPermissions.users + $cortxUserPermissions.delete
                      "
                    >
                      <img
                        v-if="
                          isLoggedInUserAdmin() &&
                            !strEqualityCaseInsensitive(
                              props.item.username,
                              loggedInUserName
                            )
                        "
                        class="ml-2 cortx-cursor-pointer"
                        id="localuser-deleteicon"
                        @click="onDeleteConfirmation(props.item.id)"
                        title="Delete"
                        src="./../../../../assets/actions/delete-green.svg"
                      />
                      <img
                        id="localuser-deleteadmin"
                        v-if="
                          strEqualityCaseInsensitive(
                            props.item.username,
                            loggedInUserName
                          ) && !isAdminUser(props.item)
                        "
                        class="mx-2 cortx-cursor-pointer"
                        @click="onDeleteConfirmation(props.item.id)"
                        title="Delete"
                        src="./../../../../assets/actions/delete-green.svg"
                      />
                    </cortx-has-access>
                  </span>
                </td>
              </tr>
            </template>
          </v-data-table>
        </cortx-has-access>
      </v-col>
      <v-col class="py-0 col-xs-6 pr-0 col-sm-5">
        <cortx-has-access
          :to="$cortxUserPermissions.users + $cortxUserPermissions.create"
        >
          <button
            v-if="!isUserCreate && !isUserEdit"
            type="button"
            class="mt-4 cortx-btn-primary"
            @click="onAddNewUser()"
            id="btnLocalAddNewUser"
          >
            {{ $t("csmuser.add-user-button") }}
          </button>
        </cortx-has-access>
        <div v-if="isUserCreate">
          <v-row>
            <v-col class="pl-5 pb-0 col-6">
              <div
                class="cortx-form-group-custom"
                :class="{
                  'cortx-form-group--error': $v.createAccount.username.$error
                }"
              >
                <label
                  class="cortx-form-group-label"
                  for="Username"
                  id="lblusername"
                >
                  <cortx-info-tooltip
                    label="Username*"
                    :message="usernameTooltipMessage"
                  />
                </label>
                <input
                  class="cortx-form__input_text"
                  type="text"
                  name="txtCreateUsername"
                  v-model.trim="createAccount.username"
                  id="txtLocalHostname"
                  @input="$v.createAccount.username.$touch"
                />
                <div class="cortx-form-group-label cortx-form-group-error-msg">
                  <label
                    id="localusername-required"
                    v-if="
                      $v.createAccount.username.$dirty &&
                        !$v.createAccount.username.required
                    "
                    >{{ $t("csmuser.username-required") }}</label
                  >
                  <label
                    id="localuser-invalid"
                    v-else-if="
                      $v.createAccount.username.$dirty &&
                        !$v.createAccount.username.accountNameRegex
                    "
                    >{{ $t("csmuser.username-invalid") }}</label
                  >
                </div>
              </div>
            </v-col>
            <v-col class="pl-5 pb-0 col-6">
              <div
                class="cortx-form-group-custom"
                :class="{
                  'cortx-form-group--error': $v.createAccount.email.$error
                }"
              >
                <label
                  class="cortx-form-group-label"
                  for="Email"
                  id="localuseremaillbl"
                  >{{ $t("csmuser.email") }}</label
                >
                <input
                  class="cortx-form__input_text"
                  type="email"
                  name="email"
                  v-model.trim="createAccount.email"
                  id="useremail"
                  @input="$v.createAccount.email.$touch"
                  placeholder="example@email.com"
                />
                <div class="cortx-form-group-label cortx-form-group-error-msg">
                  <label
                    id="localuser-email-required"
                    v-if="
                      $v.createAccount.email.$dirty &&
                        !$v.createAccount.email.required
                    "
                    >{{ $t("csmuser.email-required") }}</label
                  >
                  <label
                    id="localuser-email-invalid"
                    v-else-if="
                      $v.createAccount.email.$dirty &&
                        !$v.createAccount.email.email
                    "
                    >{{ $t("csmuser.email-invalid") }}</label
                  >
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pl-5 col-6">
              <div
                class="cortx-form-group-custom"
                :class="{
                  'cortx-form-group--error': $v.createAccount.password.$error
                }"
              >
                <label
                  class="cortx-form-group-label"
                  for="password"
                  id="localuser-passwordlbl"
                >
                  <cortx-info-tooltip
                    :label="$t('csmuser.password')"
                    :message="passwordTooltipMessage"
                  />
                </label>
                <input
                  class="cortx-form__input_text"
                  type="password"
                  name="txtCreatePassword"
                  v-model.trim="createAccount.password"
                  @input="$v.createAccount.password.$touch"
                  id="txtLocalPass"
                />
                <div class="cortx-form-group-label cortx-form-group-error-msg">
                  <label
                    id="localuser-password-required"
                    v-if="
                      $v.createAccount.password.$dirty &&
                        !$v.createAccount.password.required
                    "
                    >{{ $t("csmuser.password-required") }}</label
                  >
                  <label
                    id="localuser-password-invalid"
                    v-else-if="
                      $v.createAccount.password.$dirty &&
                        !$v.createAccount.password.passwordRegex
                    "
                    >{{ $t("csmuser.password-invalid") }}</label
                  >
                </div>
              </div>
            </v-col>
            <v-col class="pl-5 col-6">
              <div
                class="cortx-form-group-custom"
                :class="{
                  'cortx-form-group--error':
                    $v.createAccount.confirmPassword.$error
                }"
              >
                <label
                  class="cortx-form-group-label"
                  for="password"
                  id="localuser-confirmpasslbl"
                  >{{ $t("csmuser.confirm-password") }}*</label
                >
                <input
                  class="cortx-form__input_text"
                  type="password"
                  name="txtCreateConfirmPassword"
                  v-model="createAccount.confirmPassword"
                  id="txtLocalConfirmPass"
                  @input="$v.createAccount.confirmPassword.$touch"
                />
                <div class="cortx-form-group-label cortx-form-group-error-msg">
                  <label
                    id="localuser-confirmpassword-notmatch"
                    v-if="
                      $v.createAccount.confirmPassword.$dirty &&
                        !$v.createAccount.confirmPassword.sameAsPassword
                    "
                    >{{ $t("csmuser.confirm-password-invalid") }}</label
                  >
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row class="ml-3">
            <div>{{ $t("csmuser.roles") }}</div>
            <v-col class="pt-0 col-2">
              <label class="cortx-rdb-container" id="localuser-managelbl">
                {{ $t("csmuser.manage") }}
                <input
                  type="radio"
                  v-model="checkedRoles"
                  name="rbtCreateManage"
                  value="manage"
                  id="chkLocalManage"
                />
                <span class="cortx-rdb-tick" id="lblLocalManage"></span>
              </label>
            </v-col>
            <v-col class="pt-0 ml-3 col-3">
              <label class="cortx-rdb-container" id="localuser-monitorlbl">
                {{ $t("csmuser.monitor") }}
                <input
                  type="radio"
                  v-model="checkedRoles"
                  name="rbtCreateMonitor"
                  value="monitor"
                  id="chkLocalMonitor"
                />
                <span class="cortx-rdb-tick" id="lblLocalMonitor"></span>
              </label>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="ml-3">
              <button
                v-if="isUserCreate"
                type="button"
                class="cortx-btn-primary"
                @click="createUser()"
                id="btnLocalCreateUser"
                :disabled="$v.createAccount.$invalid || !checkedRoles"
              >
                {{ $t("csmuser.create-user") }}
              </button>
              <button
                v-if="isUserCreate"
                type="button"
                class="cortx-btn-tertiary"
                @click="onAddNewUser()"
                id="lblLocalCancel"
              >
                {{ $t("csmuser.cancel-user") }}
              </button>
            </v-col>
          </v-row>
        </div>

        <div v-if="isUserEdit">
          <v-row>
            <v-col class="pl-5 pb-0 col-6">
              <label
                class="cortx-form-group-label"
                for="Email"
                id="localuser-editusernamelbl"
              >
                {{ $t("csmuser.username") }}</label
              >
              <input
                class="cortx-form__input_text"
                type="text"
                name="text"
                v-model.trim="selectedItem.username"
                id="editUsername"
                disabled
              />
            </v-col>
            <v-col class="pl-5 pb-0 col-6">
              <div
                class="cortx-form-group-custom"
                :class="{
                  'cortx-form-group--error': $v.selectedItem.email.$error
                }"
              >
                <label
                  class="cortx-form-group-label"
                  for="Email"
                  id="localuser-editemaillbl"
                  >{{ $t("csmuser.email") }}</label
                >
                <input
                  class="cortx-form__input_text"
                  type="email"
                  name="email"
                  v-model.trim="selectedItem.email"
                  id="email"
                  @input="$v.selectedItem.email.$touch"
                  placeholder="example@email.com"
                />
                <div class="cortx-form-group-label cortx-form-group-error-msg">
                  <label
                    id="localuser-editmail-required"
                    v-if="
                      $v.selectedItem.email.$dirty &&
                        !$v.selectedItem.email.required
                    "
                    >{{ $t("csmuser.email-required") }}</label
                  >
                  <label
                    id="localuser-editemail-invalid"
                    v-else-if="
                      $v.selectedItem.email.$dirty &&
                        !$v.selectedItem.email.email
                    "
                    >{{ $t("csmuser.email-invalid") }}</label
                  >
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-expansion-panels class="ml-5 mr-4 mt-3" id="open-expansionbox">
              <v-expansion-panel >
                <v-expansion-panel-header class="pl-3" id="change-password-text"
                  >Change password</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <v-row>
                    <v-col class="pb-0 col-6">
                      <div
                        class="cortx-form-group-custom"
                        :class="{
                          'cortx-form-group--error':
                            $v.selectedItem.password.$error
                        }"
                      >
                        <label
                          class="cortx-form-group-label"
                          for="password"
                          id="localuser-editpasslbl"
                        >
                          <cortx-info-tooltip
                            label="New password"
                            :message="passwordTooltipMessage"
                          />
                        </label>
                        <input
                          class="cortx-form__input_text"
                          type="password"
                          name="txtEditNewPassword"
                          v-model.trim="selectedItem.password"
                          @input="$v.selectedItem.password.$touch"
                          id="txtLocalPass"
                        />
                        <div
                          class="cortx-form-group-label cortx-form-group-error-msg"
                        >
                          <label
                            id="localuser-editpass-required"
                            v-if="
                              $v.selectedItem.password.$dirty &&
                                !$v.selectedItem.password.passwordRegex
                            "
                            >{{ $t("csmuser.password-invalid") }}</label
                          >
                        </div>
                      </div>
                    </v-col>
                    <v-col class="pb-0 col-6">
                      <div
                        class="cortx-form-group-custom"
                        :class="{
                          'cortx-form-group--error':
                            $v.selectedItem.confirmPassword.$error
                        }"
                      >
                        <label
                          class="cortx-form-group-label"
                          for="password"
                          id="localuser-editconfirmpasslbl"
                          >{{ $t("csmuser.confirm-password") }}</label
                        >
                        <input
                          class="cortx-form__input_text"
                          type="password"
                          name="txtEditConfirmPassword"
                          v-model="selectedItem.confirmPassword"
                          id="txtLocalConfirmNewPass"
                          @input="$v.selectedItem.confirmPassword.$touch"
                        />
                        <div
                          class="cortx-form-group-label cortx-form-group-error-msg"
                        >
                          <label
                            id="localuser-editconfirmpass-notmatch"
                            v-if="
                              $v.selectedItem.confirmPassword.$dirty &&
                                !$v.selectedItem.confirmPassword.sameAsPassword
                            "
                            >{{ $t("csmuser.confirm-password-invalid") }}</label
                          >
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-row>
          <v-row>
            <v-col class="pl-5 pb-0 col-6 mt-2">
              <div
                class="cortx-form-group-custom"
                v-if="
                  isAdminUser(selectedItem) ||
                    strEqualityCaseInsensitive(
                      selectedItem.username,
                      loggedInUserName
                    )
                "
                :class="{
                  'cortx-form-group--error':
                    $v.selectedItem.current_password.$error
                }"
              >
                <label
                  class="cortx-form-group-label"
                  for="password"
                  id="localuser-oldpasswordlbl"
                >
                  <cortx-info-tooltip
                    label="Current password*"
                    :message="currentPasswordTooltip"
                  />
                </label>
                <input
                  class="cortx-form__input_text"
                  type="password"
                  name="txtEditOldPassword"
                  v-model.trim="selectedItem.current_password"
                  @input="$v.selectedItem.current_password.$touch"
                  id="txtLocalOldPass"
                />
                <div class="cortx-form-group-label cortx-form-group-error-msg">
                  <label
                    id="localuser-oldpass-required"
                    v-if="
                      $v.selectedItem.current_password.$dirty &&
                        !$v.selectedItem.current_password.required
                    "
                    >{{ $t("csmuser.current-pass-required") }}</label
                  >
                  <label
                    id="localuser-oldpass-invalid"
                    v-else-if="
                      $v.selectedItem.current_password.$dirty &&
                        !$v.selectedItem.current_password.passwordRegex
                    "
                    >{{ $t("csmuser.current-password-invalid") }}</label
                  >
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row
            class="ml-3 mt-1"
            v-if="
              !isAdminUser(selectedItem) ||
                !strEqualityCaseInsensitive(
                  selectedItem.username,
                  loggedInUserName
                )
            "
          >
            <div>{{ $t("csmuser.roles") }}</div>
            <v-col class="pt-0 col-2">
              <label class="cortx-rdb-container">
                {{ $t("csmuser.manage") }}
                <input
                  type="radio"
                  v-model="selectedItem.role"
                  name="rbtEditManageInterface"
                  value="manage"
                  id="chkLocalManageInterface"
                  :disabled="
                    isAdminUser(selectedItem) ||
                      strEqualityCaseInsensitive(
                        selectedItem.username,
                        loggedInUserName
                      )
                  "
                />
                <span class="cortx-rdb-tick" id="lblLocalManageInterface"></span>
              </label>
            </v-col>
            <v-col class="pt-0 ml-3 col-3">
              <label class="cortx-rdb-container">
                {{ $t("csmuser.monitor") }}
                <input
                  type="radio"
                  v-model="selectedItem.role"
                  name="rbtEditMonitorInterface"
                  value="monitor"
                  id="chkLocalMonitorInterface"
                  :disabled="
                    isAdminUser(selectedItem) ||
                      strEqualityCaseInsensitive(
                        selectedItem.username,
                        loggedInUserName
                      )
                  "
                />
                <span class="cortx-rdb-tick" id="lblLocalMonitorInterface"></span>
              </label>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="ml-3">
              <button
                type="button"
                class="cortx-btn-primary"
                @click="editUser(selectedItem)"
                id="lblLocalApplyInterface"
                :disabled="!isEditFormValid"
              >
                {{ $t("csmuser.update") }}
              </button>
              <button
                type="button"
                class="cortx-btn-tertiary"
                @click="closeEditUserForm()"
                id="lblLocalCanacelInterface"
              >
                {{ $t("csmuser.cancel-user") }}
              </button>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
    <cortx-confirmation-dialog
      id="localuser-dialog"
      :show="showConfirmationDialog"
      title="Confirmation"
      :message="confirmationDialogMessage"
      severity="warning"
      @closeDialog="closeConfirmationDialog"
      cancelButtonText="No"
    ></cortx-confirmation-dialog>
    <div class="cortx-modal-container" v-if="showUserSuccessDialog">
      <div class="cortx-modal cortx-modal-user">
        <div class="cortx-modal-header">
          <label>{{ $t("csmuser.user-success-label") }}</label>
          <img
            class="cortx-modal-close"
            :src="require('@/assets/close-green.svg')"
            id="user-closedialog-icon"
            @click="showUserSuccessDialog = false"
          />
        </div>
        <div class="cortx-modal-body">
          <div class="title title-container">
            <img
              class="mr-2 success-img"
              :src="require('@/assets/resolved-default.svg')"
            />
            <span>{{ successDialogText }}</span>
          </div>
        </div>
        <div class="cortx-modal-footer">
          <button
            type="button"
            class="cortx-btn-primary cortx-float-r mr-4"
            id="user-dialog-close-btn"
            @click="showUserSuccessDialog = false"
          >
            {{ $t("csmuser.user-success-dialog-btn") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { UserDetails } from "./../../../../models/user-Details";
import { Validations } from "vuelidate-property-decorators";
import i18n from "../../../../i18n";
import {
  required,
  helpers,
  sameAs,
  requiredIf,
  email
} from "vuelidate/lib/validators";
import {
  accountNameRegex,
  passwordRegex
} from "./../../../../common/regex-helpers";

import { Api } from "./../../../../services/api";
import apiRegister from "./../../../../services/api-register";

@Component({
  name: "cortx-user-setting-local"
})
export default class CortxUserSettingLocal extends Vue {
  @Validations()
  public validations = {
    createAccount: {
      username: { required, accountNameRegex },
      password: { required, passwordRegex },
      confirmPassword: {
        sameAsPassword: sameAs("password")
      },
      email: { required, email }
    },
    selectedItem: {
      password: { passwordRegex },
      current_password: {
        required: requiredIf(function(this: any, form) {
          return this.strEqualityCaseInsensitive(
            this.$data.selectedItem.username,
            this.$data.loggedInUserName
          );
        }),
        passwordRegex
      },
      confirmPassword: {
        sameAsPassword: sameAs("password")
      },
      email: { required, email }
    }
  };

  public data() {
    return {
      source: "manual",
      isUserCreate: false,
      isUserEdit: false,
      page: 1, // Page counter, in sync with data table
      itemsPerPage: 5, // Total rows per page, in sync with data table
      isSortActive: false, // Set table column sorting flag to default inactive
      sortColumnName: "", // Set sorting column name to none
      alertStatus: require("./../../../../common/const-string.json"),
      createAccount: {
        username: "",
        password: "",
        confirmPassword: "",
        email: ""
      },
      web: "",
      cli: "",
      api: "",
      manage: "",
      monitor: "",
      temperature: "",
      language: "",
      timeout: "",
      checkedRoles: "manage",
      checkedInterfaces: [],
      usernameTooltipMessage: i18n.t("csmuser.usernameTooltipMessage"),
      passwordTooltipMessage: i18n.t("csmuser.passwordTooltipMessage"),
      currentPasswordTooltip: i18n.t("csmuser.currentPasswordTooltipMsg"),
      selectedRows: [],
      userHeader: [
        {
          text: "Username",
          value: "username",
          sortable: false
        },
        {
          text: "Email",
          value: "email",
          sortable: false
        },
        {
          text: "Roles",
          value: "roles",
          sortable: false
        }
      ],
      userData: [],
      selectedItemToDelete: "",
      showConfirmationDialog: false,
      confirmationDialogMessage: i18n.t("csmuser.user-delete-confirm-msg"),
      loggedInUserName: localStorage.getItem("username"),
      selectedItem: {
        password: "",
        current_password: "",
        confirmPassword: "",
        email: ""
      },
      showUserSuccessDialog: false,
      successDialogText: ""
    };
  }

  public async mounted() {
    await this.getUserData();
  }

  /**
   * To get the user data list
   */
  private async getUserData() {
    this.$store.dispatch("systemConfig/showLoader", "Fetching users...");
    const res = await Api.getAll(apiRegister.csm_user);
    if (res && res.data && res.data.users) {
      this.$data.userData = res.data.users;
    }
    this.$store.dispatch("systemConfig/hideLoader");
  }
  /**
   * To create csm user
   */
  private onAddNewUser() {
    if (this.$data.isUserCreate) {
      this.clearCreateAccountForm();
    }
    this.$data.isUserCreate = !this.$data.isUserCreate;
    return this.$data.isUserCreate;
  }

  private async createUser() {
    const queryParams: UserDetails = {
      username: this.$data.createAccount.username,
      password: this.$data.createAccount.password,
      interfaces: this.$data.checkedInterfaces,
      roles: [this.$data.checkedRoles],
      temperature: this.$data.temperature,
      language: this.$data.language,
      timeout: 1,
      email: this.$data.createAccount.email
    };

    this.$store.dispatch("systemConfig/showLoader", "Creating user...");
    await Api.post(apiRegister.csm_user, queryParams);
    this.$data.isUserCreate = !this.$data.isUserCreate;
    this.clearCreateAccountForm();
    this.$data.showUserSuccessDialog = true;
    this.$data.successDialogText = `${queryParams.username}
    ${i18n.t("csmuser.user-success-message")}`;
    this.$store.dispatch("systemConfig/hideLoader");
    await this.getUserData();
  }
  /**
   * Edit Csm User
   */
  private onEditBtnClick(props: any) {
    this.$data.isUserCreate = false;
    this.$data.selectedItem = {
      ...props.item,
      role: this.isAdminUser(props.item)
        ? props.item.roles[1]
        : props.item.roles[0]
    };
    this.$data.isUserEdit =
      this.$data.selectedRows.indexOf(props.item.id) > -1 ? false : true;
  }

  private async editUser(selectedItem: any) {
    selectedItem.roles = [selectedItem.role];
    delete selectedItem.role;
    if (
      this.isAdminUser(selectedItem) ||
      this.strEqualityCaseInsensitive(
        selectedItem.id,
        this.$data.loggedInUserName
      )
    ) {
      delete selectedItem.roles;
      delete selectedItem.confirmPassword;
    }
    delete selectedItem.username;
    this.$store.dispatch("systemConfig/showLoader", "Updating user details...");
    const res = await Api.patch(
      apiRegister.csm_user,
      selectedItem,
      selectedItem.id
    );
    this.closeEditUserForm();
    this.$data.showUserSuccessDialog = true;
    this.$data.successDialogText = `${selectedItem.id}${i18n.t(
      "csmuser.user-update-success-message"
    )}`;
    this.$store.dispatch("systemConfig/hideLoader");
    await this.getUserData();
  }

  private closeEditUserForm() {
    this.$data.selectedRows = [];
    this.$data.isUserEdit = !this.$data.isUserEdit;
    this.$v.selectedItem.$reset();
  }

  /**
   * Delete Csm User
   */
  private onDeleteConfirmation(id: string) {
    this.$data.selectedItemToDelete = id;
    this.$data.showConfirmationDialog = true;
  }

  private async closeConfirmationDialog(confirmation: boolean) {
    this.$data.showConfirmationDialog = false;
    if (confirmation && this.$data.selectedItemToDelete) {
      await this.onDelete(this.$data.selectedItemToDelete);
    }
  }

  private clearCreateAccountForm() {
    this.$data.createAccount = {};
    this.$data.checkedRoles = "manage";
    this.$v.createAccount.$reset();
  }

  private async onDelete(id: string) {
    this.$store.dispatch("systemConfig/showLoader", "Deleting user...");
    await Api.delete(apiRegister.csm_user, id);
    this.$data.showUserSuccessDialog = true;
    this.$data.successDialogText = `${id}${i18n.t(
      "csmuser.user-delete-success-message"
    )}`;
    this.$data.isUserEdit = false;
    this.$store.dispatch("systemConfig/hideLoader");
    await this.getUserData();
  }

  private isAdminUser(item: any) {
    return item.roles.includes("admin");
  }

  private isLoggedInUserAdmin() {
    let isAdmin;
    const data = this.$data.userData.find((element: any) => {
      if (
        this.strEqualityCaseInsensitive(
          element.username,
          this.$data.loggedInUserName
        )
      ) {
        return true;
      }
    });

    if (data) {
      isAdmin = this.isAdminUser(data);
    }
    return isAdmin;
  }

  get isEditFormValid() {
    return !this.$v.selectedItem.$invalid;
  }

  private strEqualityCaseInsensitive(first: string, second: string) {
    return (
      first.localeCompare(second, undefined, { sensitivity: "base" }) === 0
    );
  }

  private toggleSelection(rowId: any) {
    if (this.$data.selectedRows.includes(rowId)) {
      this.$data.selectedRows.splice(this.$data.selectedRows.indexOf(rowId));
    } else {
      this.$data.selectedRows = [];
      this.$data.selectedRows.push(rowId);
    }
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

.actbtn {
  position: absolute;
  float: left;
}
#clear {
  font-size: 14px;
  color: var(--v-csmprimary-base);
  float: right;
}
#title {
  color: black;
}
.active {
  display: inline-block;
  color: var(--v-csmprimary-base) !important;
}
.notActive {
  opacity: 0;
}
.headerText {
  color: black;
}
.backoverview {
  position: relative;
  top: 1em;
  cursor: pointer;
}
.backoverviewimg {
  position: relative;
  display: inline-block;
}
.backoverviewtxt {
  position: relative;
  top: -0.3em;
}
.tableheader:hover {
  .notActive {
    opacity: 1;
  }
}
.largeAlert {
  border: 2px solid #e3e3e3;
}
tbody tr:active {
  border-top: 2px solid darkgray !important;
  border-bottom: 2px solid darkgray !important;
}
.selected-row {
  background: #f5f5f5 !important;
}
.action-col-width {
  min-width: 120px;
}
.title-container {
  overflow: auto;
  display: flex;
}
.cortx-modal-user {
  width: 550px;
  min-width: 400px;
  position: fixed;
  min-height: 214px;
}
</style>
