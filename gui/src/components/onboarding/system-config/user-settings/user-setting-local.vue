/* * CORTX-CSM: CORTX Management web and CLI interface. * Copyright (c) 2020
Seagate Technology LLC and/or its Affiliates * This program is free software:
you can redistribute it and/or modify * it under the terms of the GNU Affero
General Public License as published * by the Free Software Foundation, either
version 3 of the License, or * (at your option) any later version. * This
program is distributed in the hope that it will be useful, * but WITHOUT ANY
WARRANTY; without even the implied warranty of * MERCHANTABILITY or FITNESS FOR
A PARTICULAR PURPOSE. See the * GNU Affero General Public License for more
details. * You should have received a copy of the GNU Affero General Public
License * along with this program. If not, see <https://www.gnu.org/licenses/>.
* For any questions about this software or licensing, * please email
opensource@seagate.com or cortx-questions@seagate.com. */
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
        <eos-has-access
          :to="$eosUserPermissions.users + $eosUserPermissions.list"
        >
          <v-data-table
            :items="userData"
            :single-expand="singleExpand"
            :expanded.sync="expanded"
            item-key="id"
            class="eos-table"
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
                <td>
                  {{ props.item.username }}
                  <v-tooltip right max-width="300">
                    <template v-slot:activator="{ on }">
                      <img
                        v-if="props.item.alert_notification"
                        v-on="on"
                        height="16"
                        width="16"
                        :src="require('@/assets/actions/email.svg/')"
                      />
                    </template>
                    <span>{{ $t("csmuser.email-notification") }}</span>
                  </v-tooltip>
                </td>
                <td>
                  {{ props.item.email }}
                </td>
                <td>
                  <span v-for="(role, i) in props.item.roles" :key="role"
                    >{{ i == 0 ? "" : ", " }}{{ role | capitalize }}</span
                  >
                </td>
                <td>
                  <span>
                    <img
                      v-if="
                        isLoggedInUserAdmin() ||
                          strEqualityCaseInsensitive(
                            props.item.username,
                            loggedInUserName
                          )
                      "
                      class="ml-2 eos-cursor-pointer"
                      @click="onEditBtnClick(props)"
                      title="Edit"
                      src="./../../../../assets/actions/edit-green.svg"
                    />
                    <eos-has-access
                      :to="
                        $eosUserPermissions.users + $eosUserPermissions.delete
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
                        class="ml-2 eos-cursor-pointer"
                        @click="onDeleteConfirmation(props.item.id)"
                        title="Delete"
                        src="./../../../../assets/actions/delete-green.svg"
                      />
                      <img
                        v-if="
                          strEqualityCaseInsensitive(
                            props.item.username,
                            loggedInUserName
                          ) && !isAdminUser(props.item)
                        "
                        class="mx-2 eos-cursor-pointer"
                        @click="onDeleteConfirmation(props.item.id)"
                        title="Delete"
                        src="./../../../../assets/actions/delete-green.svg"
                      />
                    </eos-has-access>
                  </span>
                </td>
              </tr>
            </template>
          </v-data-table>
        </eos-has-access>
      </v-col>
      <v-col class="py-0 col-xs-6 pr-0 col-sm-5">
        <eos-has-access
          :to="$eosUserPermissions.users + $eosUserPermissions.create"
        >
          <button
            v-if="!isUserCreate && !isUserEdit"
            type="button"
            class="mt-4 eos-btn-primary"
            @click="onAddNewUser()"
            id="btnLocalAddNewUser"
          >
            {{ $t("csmuser.add-user-button") }}
          </button>
        </eos-has-access>
        <div v-if="isUserCreate">
          <v-row>
            <v-col class="pl-5 pb-0 col-6">
              <div
                class="eos-form-group-custom"
                :class="{
                  'eos-form-group--error': $v.createAccount.username.$error
                }"
              >
                <label class="eos-form-group-label" for="Username">
                  <eos-info-tooltip
                    label="Username*"
                    :message="usernameTooltipMessage"
                  />
                </label>
                <input
                  class="eos-form__input_text"
                  type="text"
                  name="txtCreateUsername"
                  v-model.trim="createAccount.username"
                  id="txtLocalHostname"
                  @input="$v.createAccount.username.$touch"
                />
                <div class="eos-form-group-label eos-form-group-error-msg">
                  <label
                    v-if="
                      $v.createAccount.username.$dirty &&
                        !$v.createAccount.username.required
                    "
                    >{{ $t("csmuser.username-required") }}</label
                  >
                  <label
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
                class="eos-form-group-custom"
                :class="{
                  'eos-form-group--error': $v.createAccount.email.$error
                }"
              >
                <label class="eos-form-group-label" for="Email">{{ $t("csmuser.email") }}</label>
                <input
                  class="eos-form__input_text"
                  type="email"
                  name="email"
                  v-model.trim="createAccount.email"
                  id="useremail"
                  @input="$v.createAccount.email.$touch"
                  placeholder="example@email.com"
                />
                <div class="eos-form-group-label eos-form-group-error-msg">
                  <label
                    v-if="
                      $v.createAccount.email.$dirty &&
                        !$v.createAccount.email.required
                    "
                    >{{ $t("csmuser.email-required") }}</label
                  >
                  <label
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
                class="eos-form-group-custom"
                :class="{
                  'eos-form-group--error': $v.createAccount.password.$error
                }"
              >
                <label class="eos-form-group-label" for="password">
                  <eos-info-tooltip
                    :label="$t('csmuser.password')"
                    :message="passwordTooltipMessage"
                  />
                </label>
                <input
                  class="eos-form__input_text"
                  type="password"
                  name="txtCreatePassword"
                  v-model.trim="createAccount.password"
                  @input="$v.createAccount.password.$touch"
                  id="txtLocalPass"
                />
                <div class="eos-form-group-label eos-form-group-error-msg">
                  <label
                    v-if="
                      $v.createAccount.password.$dirty &&
                        !$v.createAccount.password.required
                    "
                    >{{ $t("csmuser.password-required") }}</label
                  >
                  <label
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
                class="eos-form-group-custom"
                :class="{
                  'eos-form-group--error':
                    $v.createAccount.confirmPassword.$error
                }"
              >
                <label class="eos-form-group-label" for="password"
                  >{{ $t("csmuser.confirm-password") }}*</label
                >
                <input
                  class="eos-form__input_text"
                  type="password"
                  name="txtCreateConfirmPassword"
                  v-model="createAccount.confirmPassword"
                  id="txtLocalConfirmPass"
                  @input="$v.createAccount.confirmPassword.$touch"
                />
                <div class="eos-form-group-label eos-form-group-error-msg">
                  <label
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
              <label class="eos-rdb-container">
                  {{ $t("csmuser.manage") }}
                <input
                  type="radio"
                  v-model="checkedRoles"
                  name="rbtCreateManage"
                  value="manage"
                  id="chkLocalManage"
                />
                <span class="eos-rdb-tick" id="lblLocalManage"></span>
              </label>
            </v-col>
            <v-col class="pt-0 ml-3 col-3">
              <label class="eos-rdb-container">
                {{ $t("csmuser.monitor") }}
                <input
                  type="radio"
                  v-model="checkedRoles"
                  name="rbtCreateMonitor"
                  value="monitor"
                  id="chkLocalMonitor"
                />
                <span class="eos-rdb-tick" id="lblLocalMonitor"></span>
              </label>
            </v-col>
          </v-row>
          <v-row class="ml-0">
            <v-col>
              <label class="eos-ckb-container" for="emailCheckID">
                {{ $t("csmuser.email-notification") }}
                <input
                  type="checkbox"
                  name="emailCheckID"
                  v-model="createAccount.alert_notification"
                  id="emailCheckID"
                />
                <span class="eos-ckb-tick"></span>
              </label>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="ml-3">
              <button
                v-if="isUserCreate"
                type="button"
                class="eos-btn-primary"
                @click="createUser()"
                id="btnLocalCreateUser"
                :disabled="$v.createAccount.$invalid || !checkedRoles"
              >
                 {{ $t("csmuser.create-user") }}
              </button>
              <button
                v-if="isUserCreate"
                type="button"
                class="eos-btn-tertiary"
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
              <label class="eos-form-group-label" for="Email"> {{ $t("csmuser.username") }}</label>
              <input
                class="eos-form__input_text"
                type="text"
                name="text"
                v-model.trim="selectedItem.username"
                id="editUsername"
                disabled
              />
            </v-col>
            <v-col class="pl-5 pb-0 col-6">
              <div
                class="eos-form-group-custom"
                :class="{
                  'eos-form-group--error': $v.selectedItem.email.$error
                }"
              >
                <label class="eos-form-group-label" for="Email">{{ $t("csmuser.email") }}</label>
                <input
                  class="eos-form__input_text"
                  type="email"
                  name="email"
                  v-model.trim="selectedItem.email"
                  id="email"
                  @input="$v.selectedItem.email.$touch"
                  placeholder="example@email.com"
                />
                <div class="eos-form-group-label eos-form-group-error-msg">
                  <label
                    v-if="
                      $v.selectedItem.email.$dirty &&
                        !$v.selectedItem.email.required
                    "
                    >{{ $t("csmuser.email-required") }}</label
                  >
                  <label
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
            <v-col class="pl-5 pb-0 col-6">
              <div
                class="eos-form-group-custom"
                :class="{
                  'eos-form-group--error': $v.selectedItem.password.$error
                }"
              >
                <label class="eos-form-group-label" for="password">
                  <eos-info-tooltip
                    label="New password*"
                    :message="passwordTooltipMessage"
                  />
                </label>
                <input
                  class="eos-form__input_text"
                  type="password"
                  name="txtEditNewPassword"
                  v-model.trim="selectedItem.password"
                  @input="$v.selectedItem.password.$touch"
                  id="txtLocalPass"
                />
                <div class="eos-form-group-label eos-form-group-error-msg">
                  <label
                    v-if="
                      $v.selectedItem.password.$dirty &&
                        !$v.selectedItem.password.required
                    "
                    >{{ $t("csmuser.password-required") }}</label
                  >
                  <label
                    v-else-if="
                      $v.selectedItem.password.$dirty &&
                        !$v.selectedItem.password.passwordRegex
                    "
                    >{{ $t("csmuser.password-invalid") }}</label
                  >
                </div>
              </div>
            </v-col>
            <v-col class="pl-5 pb-0 col-6">
              <div
                class="eos-form-group-custom"
                :class="{
                  'eos-form-group--error':
                    $v.selectedItem.confirmPassword.$error
                }"
              >
                <label class="eos-form-group-label" for="password"
                  >{{ $t("csmuser.confirm-password") }}</label
                >
                <input
                  class="eos-form__input_text"
                  type="password"
                  name="txtEditConfirmPassword"
                  v-model="selectedItem.confirmPassword"
                  id="txtLocalConfirmNewPass"
                  @input="$v.selectedItem.confirmPassword.$touch"
                />
                <div class="eos-form-group-label eos-form-group-error-msg">
                  <label
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
          <v-row>
            <v-col class="pl-5 pb-0 col-6">
              <div
                class="eos-form-group-custom"
                v-if="
                  isAdminUser(selectedItem) ||
                    strEqualityCaseInsensitive(
                      selectedItem.username,
                      loggedInUserName
                    )
                "
                :class="{
                  'eos-form-group--error': $v.selectedItem.old_password.$error
                }"
              >
                <label class="eos-form-group-label" for="password">
                  <eos-info-tooltip
                    label="Old password*"
                    :message="passwordTooltipMessage"
                  />
                </label>
                <input
                  class="eos-form__input_text"
                  type="password"
                  name="txtEditOldPassword"
                  v-model.trim="selectedItem.old_password"
                  @input="$v.selectedItem.old_password.$touch"
                  id="txtLocalOldPass"
                />
                <div class="eos-form-group-label eos-form-group-error-msg">
                  <label
                    v-if="
                      $v.selectedItem.old_password.$dirty &&
                        !$v.selectedItem.old_password.required
                    "
                    >{{ $t("csmuser.old-pass-required") }}</label
                  >
                  <label
                    v-else-if="
                      $v.selectedItem.old_password.$dirty &&
                        !$v.selectedItem.old_password.passwordRegex
                    "
                    >{{ $t("csmuser.old-password-invalid") }}</label
                  >
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row class="ml-3">
            <div>{{ $t("csmuser.roles") }}</div>
            <v-col class="pt-0 col-2">
              <label class="eos-rdb-container">
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
                <span class="eos-rdb-tick" id="lblLocalManageInterface"></span>
              </label>
            </v-col>
            <v-col class="pt-0 ml-3 col-3">
              <label class="eos-rdb-container">
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
                <span class="eos-rdb-tick" id="lblLocalMonitorInterface"></span>
              </label>
            </v-col>
          </v-row>
          <v-row class="ml-0">
            <v-col>
              <label class="eos-ckb-container" for="emailCheckID">
                 {{ $t("csmuser.email-notification") }}
                <input
                  type="checkbox"
                  name="emailCheckID"
                  v-model="selectedItem.alert_notification"
                  id="emailCheckID"
                />
                <span class="eos-ckb-tick"></span>
              </label>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="ml-3">
              <button
                type="button"
                class="eos-btn-primary"
                @click="editUser(selectedItem)"
                id="lblLocalApplyInterface"
                :disabled="!isEditFormValid"
              >
                {{ $t("csmuser.update") }}
              </button>
              <button
                type="button"
                class="eos-btn-tertiary"
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
    <eos-confirmation-dialog
      :show="showConfirmationDialog"
      title="Confirmation"
      :message="confirmationDialogMessage"
      severity="warning"
      @closeDialog="closeConfirmationDialog"
      cancelButtonText="No"
    ></eos-confirmation-dialog>
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
  passwordRegex,
} from "./../../../../common/regex-helpers";

import { Api } from "./../../../../services/api";
import apiRegister from "./../../../../services/api-register";

@Component({
  name: "eos-user-setting-local"
})
export default class EosUserSettingLocal extends Vue {
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
      password: { required, passwordRegex },
      old_password: {
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
      singleExpand: true, // Expanded single row property
      itemsPerPage: 5, // Total rows per page, in sync with data table
      isSortActive: false, // Set table column sorting flag to default inactive
      sortColumnName: "", // Set sorting column name to none
      alertStatus: require("./../../../../common/const-string.json"),
      createAccount: {
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        alert_notification: true
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
      expanded: [],
      usernameTooltipMessage: i18n.t("csmuser.usernameTooltipMessage"),
      passwordTooltipMessage: i18n.t("csmuser.passwordTooltipMessage"),
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
      confirmationDialogMessage: "Are you sure you want to delete this user?",
      loggedInUserName: localStorage.getItem("username"),
      selectedItem: {
        password: "",
        old_password: "",
        confirmPassword: "",
        email: "",
        alert_notification: ""
      }
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
      email: this.$data.createAccount.email,
      alert_notification: this.$data.createAccount.alert_notification
    };

    this.$store.dispatch("systemConfig/showLoader", "Creating user...");
    await Api.post(apiRegister.csm_user, queryParams);
    this.$data.isUserCreate = !this.$data.isUserCreate;
    this.clearCreateAccountForm();
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
        selectedItem.username,
        this.$data.loggedInUserName
      )
    ) {
      delete selectedItem.roles;
      delete selectedItem.confirmPassword;
    }
    this.$store.dispatch("systemConfig/showLoader", "Updating user details...");
    const res = await Api.patch(
      apiRegister.csm_user,
      selectedItem,
      selectedItem.id
    );
    this.closeEditUserForm();
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
    return this.$v.selectedItem.$anyDirty && this.$v.selectedItem.$invalid
      ? false
      : true;
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
</style>
