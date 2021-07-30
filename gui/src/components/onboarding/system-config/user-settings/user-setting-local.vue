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
    <v-row class="pa-0 ma-0">
      <v-col cols="12" class="pa-0 ma-0">
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
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <cortx-has-access
          :to="$cortxUserPermissions.users + $cortxUserPermissions.list"
        >
          <CortxDataTable
            :headers="headersList"
            :records="userData.users"
            :onSort="onCsmUserSort"
            :sortParams="csmUsersQueryParam"
            :onFilter="onCsmLogFilter" 
            :rowsPerPage="[5, 10, 20, 30, 50, 100, 150, 200]"
            :actionsCallback="{
            deleteUserAction : deleteUserActionCB,
            editUserAction : editUserActionCB
            }"
            @update:items-per-page="getUserData()"
            @update:page="getUserData()"
          />
        </cortx-has-access>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <!-- Create new user dialog box -->
        <v-dialog
          v-model="isUserCreate"
          v-if="isUserCreate"
          persistent
          max-width="590"
          id="add-new-user-dialog"
        >
          <v-card>
            <v-card-title>
              <span>Add New User</span>
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6">
                    <div
                      class="cortx-form-group-custom"
                      :class="{
                    'cortx-form-group--error': $v.createAccount.username.$error
                  }"
                    >
                      <label class="cortx-form-group-label" for="Username" id="lblusername">
                        <cortx-info-tooltip label="Username*" :message="usernameTooltipMessage" />
                      </label>
                      <input
                        class="cortx-form__input_text"
                        type="text"
                        name="txtCreateUsername"
                        v-model.trim="createAccount.username"
                        id="txtUsername"
                        @input="$v.createAccount.username.$touch"
                      />
                      <div class="cortx-form-group-label cortx-form-group-error-msg">
                        <label
                          id="localusername-required"
                          v-if="
                      $v.createAccount.username.$dirty &&
                        !$v.createAccount.username.required
                    "
                        >{{ $t("csmuser.username-required") }}</label>
                        <label
                          id="localuser-invalid"
                          v-else-if="
                      $v.createAccount.username.$dirty &&
                        !$v.createAccount.username.accountNameRegex
                    "
                        >{{ $t("csmuser.username-invalid") }}</label>
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="6">
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
                      >{{ $t("csmuser.email") }}</label>
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
                        >{{ $t("csmuser.email-required") }}</label>
                        <label
                          id="localuser-email-invalid"
                          v-else-if="
                      $v.createAccount.email.$dirty &&
                        !$v.createAccount.email.email
                    "
                        >{{ $t("csmuser.email-invalid") }}</label>
                      </div>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6">
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
                        >{{ $t("csmuser.password-required") }}</label>
                        <label
                          id="localuser-password-invalid"
                          v-else-if="
                      $v.createAccount.password.$dirty &&
                        !$v.createAccount.password.passwordRegex
                    "
                        >{{ $t("csmuser.password-invalid") }}</label>
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="6">
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
                      >{{ $t("csmuser.confirm-password") }}*</label>
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
                        >{{ $t("csmuser.confirm-password-invalid") }}</label>
                      </div>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <label class="mr-3">{{ $t("csmuser.roles") }}</label>

                    <label class="cortx-rdb-container ml-4" id="localuser-adminlbl" v-if="loggedInUserDetails.role === ROLES.ADMIN">
                      {{ $t("csmuser.admin") }}
                      <input
                        type="radio"
                        v-model="checkedRoles"
                        name="rbtCreateAdmin"
                        value="admin"
                        id="chkLocalAdmin"
                      />
                      <span class="cortx-rdb-tick" id="lblLocalAdmin"></span>
                    </label>

                    <label class="cortx-rdb-container ml-4" id="localuser-managelbl">
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

                    <label class="cortx-rdb-container ml-4" id="localuser-monitorlbl">
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
              </v-container>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-container>
              <v-row>
                <v-col cols="12">
                  <button
                    v-if="isUserCreate"
                    type="button"
                    class="cortx-btn-primary"
                    @click="createUser()"
                    id="btnLocalCreateUser"
                    :disabled="$v.createAccount.$invalid || !checkedRoles"
                  >{{ $t("csmuser.create-user") }}</button>
                  <button
                    v-if="isUserCreate"
                    type="button"
                    class="cortx-btn-tertiary"
                    @click="onAddNewUser()"
                    id="lblLocalCancel"
                  >{{ $t("csmuser.cancel-user") }}</button>
                </v-col>
              </v-row>
              </v-container>
            </v-card-actions>
          </v-card>
        </v-dialog> 
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <!-- Edit user dialog box -->
        <v-dialog
          v-model="isUserEdit"
          v-if="isUserEdit"
          persistent
          max-width="590"
          id="user-edit-dialog"
        >
          <v-card>
            <v-card-title>
              <span>Edit user account</span>
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6">
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
                  <v-col cols="12" sm="6">
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
                  <v-col cols="12">
                    <v-expansion-panels id="open-expansionbox">
                    <v-expansion-panel @click="isPasswordPanelCollapse">
                      <v-expansion-panel-header class="pl-3" id="change-password-text"
                        >{{ $t("onBoarding.changePassword") }}</v-expansion-panel-header
                      >
                      <v-expansion-panel-content>
                        <v-row v-if="selectedItem.username === loggedInUserDetails.username">
                          <v-col cols="12">
                            <div
                              class="cortx-form-group-custom"
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
                                  class="cuttenr-password-tooltip"
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
                                @keyup="enableEditButton"
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
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <div v-if="loggedInUserDetails.role === ROLES.ADMIN || loggedInUserDetails.role === ROLES.MANAGE">
                      <label class="mr-3">{{ $t("csmuser.roles") }}</label>
                      <label class="cortx-rdb-container ml-4" v-if="loggedInUserDetails.role === ROLES.ADMIN">
                        {{ $t("csmuser.admin") }}
                        <input
                          type="radio"
                          v-model="selectedItem.role"
                          name="rbtEditAdminInterface"
                          value="admin"
                          id="chkLocalAdminInterface"
                          :disabled="(loggedInUserDetails.id === selectedItem.id && loggedInUserDetails.role === ROLES.ADMIN )"
                          />
                        <span class="cortx-rdb-tick" id="lblLocalAdminInterface"></span>
                      </label>

                      <label class="cortx-rdb-container ml-4">
                        {{ $t("csmuser.manage") }}
                        <input
                          type="radio"
                          v-model="selectedItem.role"
                          name="rbtEditManageInterface"
                          value="manage"
                          id="chkLocalManageInterface"
                          :disabled="(loggedInUserDetails.id === selectedItem.id && loggedInUserDetails.role === ROLES.ADMIN ) "
                          />
                        <span class="cortx-rdb-tick" id="lblLocalManageInterface"></span>
                      </label>

                      <label class="cortx-rdb-container ml-4">
                        {{ $t("csmuser.monitor") }}
                        <input
                          type="radio"
                          v-model="selectedItem.role"
                          name="rbtEditMonitorInterface"
                          value="monitor"
                          id="chkLocalMonitorInterface"
                          :disabled="(loggedInUserDetails.id === selectedItem.id && loggedInUserDetails.role === ROLES.ADMIN )"
                        />
                        <span class="cortx-rdb-tick" id="lblLocalMonitorInterface"></span>
                      </label>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <button
                        type="button"
                        class="cortx-btn-primary"
                        @click="editUser(selectedItem)"
                        id="lblLocalApplyInterface"
                        :disabled="!isEditFormValid  || isPasswordFieldOpen"
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
              </v-container>
            </v-card-actions>
          </v-card>    
        </v-dialog>
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
import i18n from "../../onboarding.json";
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
import  CortxDataTable from "../../../widgets/cortx-data-table.vue";
import { userPermissions } from "../../../../common/user-permissions-map";
import { CsmUserQueryParam } from '@/models/download';
import { ROLES } from "@/common/consts";
@Component({
  name: "cortx-user-setting-local",
  i18n: {
    messages: i18n
  },
  components: {CortxDataTable}
})
export default class CortxUserSettingLocal extends Vue {
  public ROLES: any = ROLES;
  public loggedInUserDetails: any = {};

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
      isPasswordFieldOpen: false,
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
      admin: "",
      temperature: "",
      language: "",
      timeout: "",
      checkedRoles: "",
      checkedInterfaces: [],
      usernameTooltipMessage: this.$t("csmuser.usernameTooltipMessage"),
      passwordTooltipMessage: this.$t("csmuser.passwordTooltipMessage"),
      currentPasswordTooltip: this.$t("csmuser.currentPasswordTooltipMsg"),
      selectedRows: [],
      headersList: [
        {
          "field_id": "alert_notification",
          "label": "alert_notification",
          "sortable": false,
          "filterable": false,
          "value": { "type": "text" },
          "display": false,
        },
        {
          "field_id": "created_time",
          "label": "created_time",
          "sortable": false,
          "filterable": false,
          "value": { "type": "text" },
          "display": false,
        },
        {
          "field_id": "email",
          "label": "Email",
          "sortable": true,
          "filterable": false,
          "value": { "type": "text" },
          "display": true,
        },
        {
          "field_id": "id",
          "label": "id",
          "sortable": false,
          "filterable": false,
          "value": { "type": "text" },
          "display": false,
        },
        {
          "field_id": "role",
          "label": "Role",
          "sortable": true,
          "filterable": true,
          "value": { "type": "text" },
          "display": true,
        },
        {
          "field_id": "updated_time",
          "label": "updated_time",
          "sortable": false,
          "filterable": false,
          "value": { "type": "text" },
          "display": false,
        },
        {
          "field_id": "user_type",
          "label": "user_type",
          "sortable": false,
          "filterable": false,
          "value": { "type": "text" },
          "display": false,
        },
        {
          "field_id": "username",
          "label": "Username",
          "sortable": true,
          "filterable": true,
          "value": { "type": "text" },
          "display": true,
        },
        {
          "field_id": "action_buttons",
          "label": "Actions",
          "display_id": 1001,
          "sortable": false,
          "filterable": false,
          "actionDetails": [
            {
              "id": "deleteUserAction",
              "iconClass": "cortx-delete-icon",
              "tooltip": "Delete user details",
              "condition": this.deleteActionCondition
            },
            {
              "id": "editUserAction",
              "iconClass": "cortx-edit-icon",
              "tooltip": "Edit user details",
              "condition": this.editActionCondition
            }
          ],
          "display": true,
          "value": { "type": "buttons" }
        }
      ],
      userData: {
        users: [],
        users_count_by_role: {}
      },
      selectedItemToDelete: "",
      showConfirmationDialog: false,
      confirmationDialogMessage: this.$t("csmuser.user-delete-confirm-msg"),
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
  public csmUsersQueryParam: CsmUserQueryParam = {} as CsmUserQueryParam;
  public async mounted() {
    await this.getUserData();
    this.loggedInUserDetails = this.getLoggedInUserDetails();
  }

  public isPasswordPanelCollapse() {
    this.$data.isPasswordFieldOpen = true;
  }
  public enableEditButton() {
    this.$data.isPasswordFieldOpen = false;
  }
  public deleteUserActionCB(event:any, data:any){
    this.onDeleteConfirmation(data.id);
  }
  public deleteActionCondition(record: any) {
    const vueInstance: any = this;
    let allowDeleteOption: boolean = false;
    if (vueInstance.$hasAccessToCsm(userPermissions.users + userPermissions.delete)) {
      switch (this.loggedInUserDetails.role) {
        case this.ROLES.ADMIN:
          if(record.role === this.ROLES.ADMIN) {
            allowDeleteOption = this.$data.userData.users_count_by_role.admin === 1
                                  ? false
                                  : true;
          } else {
            allowDeleteOption = true;
          }
          break;

        case this.ROLES.MANAGE:
        case this.ROLES.MONITOR:
          if(this.loggedInUserDetails.username === record.username) {
            allowDeleteOption = true;
          }
          break;
      }
    }

    return allowDeleteOption;
  }

  public editUserActionCB(event:any, data:any){
    this.onEditBtnClick(data);
  }
  public editActionCondition(record: any) {
    const vueInstance: any = this;
    let allowEditOption: boolean = false;
    if (vueInstance.$hasAccessToCsm(userPermissions.users + userPermissions.update)) {
      switch (this.loggedInUserDetails.role) {
        case this.ROLES.ADMIN:
          allowEditOption = true;
          break;

        case this.ROLES.MANAGE:
          if((record.role === this.ROLES.MANAGE)
            || (record.role === this.ROLES.MONITOR)) {
            allowEditOption = true;
          }
          break;

        case this.ROLES.MONITOR:
          if(this.loggedInUserDetails.username === record.username) {
            allowEditOption = true;
          }
          break;
      }
    }

    return allowEditOption;
  }

  /**
   * User Sorting
   */
  public async onCsmUserSort(header: any) {
    if (header.sortable) {
      if (this.csmUsersQueryParam.sortby && this.csmUsersQueryParam.sortby === header.value) {
        this.csmUsersQueryParam.dir = this.csmUsersQueryParam.dir === "asc" ? "desc" : "asc";
      } else {
        this.csmUsersQueryParam.sortby = header.value;
        this.csmUsersQueryParam.dir = "asc";
      }
      await this.getUserData();
    }
  }


  public getFilterableHeaderFields(): string[] {
    return this.$data.headersList
      .filter((header: any) => header.filterable)
      .map((header: any) => header.field_id);
  }

  public async clearFilters() {
    for (const field of this.getFilterableHeaderFields()) {
      delete this.csmUsersQueryParam[field];
    }
  }

  /**
   * User filter data
   */
  public async onCsmLogFilter(headerFields: string[], value: string) {
    this.clearFilters();

    if (value) {
      if (headerFields.length > 0) {
        for (const field of headerFields) {
          this.csmUsersQueryParam[field] = value; //Adding only selected columns as filters
        }
      } else if (this.getFilterableHeaderFields().length > 0) {
        for (const field of this.getFilterableHeaderFields()) {
          this.csmUsersQueryParam[field] = value; //Adding all filterable column headers as filters
          }
        }
      }

       await this.getUserData();
    }

  /**
   * To get user list
   */
  private async getUserData() {
    this.$store.dispatch("systemConfig/showLoader", "Fetching users...");
    const res = await Api.getAll(apiRegister.csm_user, this.csmUsersQueryParam);
    if (res && res.data && res.data.users) {
      this.$data.userData.users = res.data.users;
      this.$data.userData.users_count_by_role = this.getUserCountByRole();
    }
    this.$store.dispatch("systemConfig/hideLoader");
  }

  private getUserCountByRole() {
    const userCount: any = {
      admin: 0,
      manage: 0,
      monitor: 0
    };

    for (const user of this.$data.userData.users) {
      switch (user.role) {
        case this.ROLES.ADMIN:
          userCount.admin++;
          break;

        case this.ROLES.MANAGE:
          userCount.manage++;
          break;

        case this.ROLES.MONITOR:
          userCount.monitor++;
          break;
      }
    }

    return userCount;
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
      role: this.$data.checkedRoles,
      temperature: this.$data.temperature,
      language: this.$data.language,
      timeout: 1,
      email: this.$data.createAccount.email
    };
    this.$data.isUserCreate = !this.$data.isUserCreate;
    this.$store.dispatch("systemConfig/showLoader", "Creating user...");
    await Api.post(apiRegister.csm_user, queryParams);
    this.clearCreateAccountForm();
    this.$data.showUserSuccessDialog = true;
    this.$data.successDialogText = `${queryParams.username}
    ${this.$t("csmuser.user-success-message")}`;
    this.$store.dispatch("systemConfig/hideLoader");
    await this.getUserData();
  }
  /**
   * Edit Csm User
   */
  private onEditBtnClick(props: any) {
    this.$data.isUserCreate = false;
    this.$data.selectedItem = {
      ...props
    };
    this.$data.isUserEdit =
      this.$data.selectedRows.indexOf(props.id) > -1 ? false : true;
  }

  private async editUser(selectedItem: any) {
    if (this.loggedInUserDetails.username === selectedItem.username) {
      delete selectedItem.role;
      delete selectedItem.confirmPassword;
    }
    const { username, ...editData } = selectedItem;
    this.$store.dispatch("systemConfig/showLoader", "Updating user details...");
    const res = await Api.patch(
      apiRegister.csm_user,
      editData,
      selectedItem.id
    );
    this.closeEditUserForm();
    this.$data.showUserSuccessDialog = true;
    this.$data.successDialogText = `${selectedItem.id}${this.$t(
      "csmuser.user-update-success-message"
    )}`;
    this.$store.dispatch("systemConfig/hideLoader");
    await this.getUserData();
  }

  private closeEditUserForm() {
    this.$data.selectedRows = [];
    this.$data.isUserEdit = false;
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
    this.$data.checkedRoles = "";
    this.$v.createAccount.$reset();
  }

  private async onDelete(id: string) {
    this.$store.dispatch("systemConfig/showLoader", "Deleting user...");
    await Api.delete(apiRegister.csm_user, id);
    this.$data.showUserSuccessDialog = true;
    this.$data.successDialogText = `${id}${this.$t(
      "csmuser.user-delete-success-message"
    )}`;
    this.$data.isUserEdit = false;
    this.$store.dispatch("systemConfig/hideLoader");
    await this.getUserData();
  }

  private isAdminUser(item: any) {
    return item.role.includes("admin");
  }

  private getLoggedInUserDetails() {
    const loggedInUser = this.$data.userData.users.find((element: any) => {
      if (
        this.strEqualityCaseInsensitive(
          element.username,
          this.$data.loggedInUserName
        )
      ) {
        return true;
      }
    });

    return loggedInUser;
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
