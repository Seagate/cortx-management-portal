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
  <div class="eos-p-2 body-2">
    <div class="title mt-2 font-weight-bold" id="lblLocalSetting">
      User settings: Local
    </div>
    <div class="mt-1" id="lblLocalMsgConfig">
      Manage users. Depending on the user role, you can create, modify, and
      delete users. You can also change the password for the admin user.
    </div>
    <div class="mt-1">
      A role is a collection of permissions granted to a user.
    </div>
    <div class="mt-1">
      Note: Only admin user can create and delete users and change the password
      of the admin user.
    </div>
    <v-divider class="mt-2" />
    <v-card class="col-10 pb-5 mt-10 elevation-0" outlined tile>
      <div v-if="isUserCreate">
        <v-row>
          <v-col class="pl-5">
            <div
              class="eos-form-group"
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
                  >Account name is required.</label
                >
                <label
                  v-else-if="
                    $v.createAccount.username.$dirty &&
                      !$v.createAccount.username.accountNameRegex
                  "
                  >Invalid username.</label
                >
              </div>
            </div>
            <div
              class="eos-form-group"
              :class="{
                'eos-form-group--error': $v.createAccount.password.$error
              }"
            >
              <label class="eos-form-group-label" for="password">
                <eos-info-tooltip
                  label="Password*"
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
                  >Password is required.</label
                >
                <label
                  v-else-if="
                    $v.createAccount.password.$dirty &&
                      !$v.createAccount.password.passwordRegex
                  "
                  >Invalid password.</label
                >
              </div>
            </div>
            <div
              class="eos-form-group"
              :class="{
                'eos-form-group--error': $v.createAccount.confirmPassword.$error
              }"
            >
              <label class="eos-form-group-label" for="password"
                >Confirm password*</label
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
                  >Passwords do not match.</label
                >
              </div>
            </div>
          </v-col>
          <v-col>
            <div class="mb-3">Roles</div>
            <label class="eos-rdb-container">
              Manage
              <input
                type="radio"
                v-model="checkedRoles"
                name="rbtCreateManage"
                value="manage"
                id="chkLocalManage"
              />
              <span class="eos-rdb-tick" id="lblLocalManage"></span>
            </label>
            <br />
            <label class="eos-rdb-container mt-2">
              Monitor
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
      </div>
      <eos-has-access
        :to="$eosUserPermissions.users + $eosUserPermissions.create"
      >
        <button
          v-if="!isUserCreate"
          type="button"
          class="ma-5 eos-btn-primary"
          @click="addUser()"
          id="btnLocalAddNewUser"
        >
          Add new user
        </button>
        <button
          v-if="isUserCreate"
          type="button"
          class="ma-5 eos-btn-primary"
          @click="createUser()"
          id="btnLocalCreateUser"
          :disabled="$v.createAccount.$invalid || !checkedRoles"
        >
          Create
        </button>
        <button
          v-if="isUserCreate"
          type="button"
          class="eos-btn-tertiary"
          @click="addUser()"
          id="lblLocalCancel"
        >
          Cancel
        </button>
      </eos-has-access>

      <eos-has-access
        :to="$eosUserPermissions.users + $eosUserPermissions.list"
      >
        <v-data-table
          calculate-widths
          :items="userData"
          :single-expand="singleExpand"
          :expanded.sync="expanded"
          item-key="id"
          show-expand
          class="eos-table"
          hide-default-header
        >
          <template v-slot:header="{}">
            <tr>
              <th class="tableheader" width="10%" />
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
                    v-if="header.sortable && header.sortDir === alertStatus.asc"
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
            <tr class="font-weight-small">
              <td>
                <span>
                  <eos-has-access
                    :to="$eosUserPermissions.users + $eosUserPermissions.update"
                  >
                    <div
                      @click="onExpand(props)"
                      v-if="
                        isLoggedInUserAdmin() ||
                          strEqualityCaseInsensitive(
                            props.item.username,
                            loggedInUserName
                          )
                      "
                    >
                      <img
                        v-if="props.isExpanded"
                        title="Minimize"
                        :src="require('@/assets/caret-down.svg')"
                      />
                      <img
                        v-if="!props.isExpanded"
                        title="Expand"
                        :src="require('@/assets/caret-right.svg')"
                      />
                    </div>
                  </eos-has-access>
                </span>
              </td>
              <td>{{ props.item.username }}</td>
              <td>
                <span v-for="(role, i) in props.item.roles" :key="role"
                  >{{ i == 0 ? "" : ", " }}{{ role | capitalize }}</span
                >
              </td>
              <td>
                <span>
                  <eos-has-access
                    :to="$eosUserPermissions.users + $eosUserPermissions.update"
                  >
                    <img
                      v-if="
                        isLoggedInUserAdmin() ||
                          strEqualityCaseInsensitive(
                            props.item.username,
                            loggedInUserName
                          )
                      "
                      class="mx-2 eos-cursor-pointer"
                      @click="onExpand(props)"
                      title="Edit"
                      src="./../../../../assets/actions/edit-green.svg"
                    />
                  </eos-has-access>
                  <eos-has-access
                    :to="$eosUserPermissions.users + $eosUserPermissions.delete"
                  >
                    <img
                      v-if="
                        isLoggedInUserAdmin() &&
                          !strEqualityCaseInsensitive(
                            props.item.username,
                            loggedInUserName
                          )
                      "
                      class="mx-2 eos-cursor-pointer"
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
          <template v-slot:expanded-item="props">
            <tr class="grey lighten-5" v-if="!isUserEdit">
              <td colspan="5">
                <div>
                  <v-row>
                    <v-col class="pl-5">
                      <div
                        class="eos-form-group"
                        v-if="
                          isAdminUser(props.item) ||
                            strEqualityCaseInsensitive(
                              props.item.username,
                              loggedInUserName
                            )
                        "
                        :class="{
                          'eos-form-group--error':
                            $v.selectedItem.old_password.$error
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
                        <div
                          class="eos-form-group-label eos-form-group-error-msg"
                        >
                          <label
                            v-if="
                              $v.selectedItem.old_password.$dirty &&
                                !$v.selectedItem.old_password.required
                            "
                            >Old password is required.</label
                          >
                          <label
                            v-else-if="
                              $v.selectedItem.old_password.$dirty &&
                                !$v.selectedItem.old_password.passwordRegex
                            "
                            >Invalid old password.</label
                          >
                        </div>
                      </div>
                      <div
                        class="eos-form-group"
                        :class="{
                          'eos-form-group--error':
                            $v.selectedItem.password.$error
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
                        <div
                          class="eos-form-group-label eos-form-group-error-msg"
                        >
                          <label
                            v-if="
                              $v.selectedItem.password.$dirty &&
                                !$v.selectedItem.password.required
                            "
                            >Password is required.</label
                          >
                          <label
                            v-else-if="
                              $v.selectedItem.password.$dirty &&
                                !$v.selectedItem.password.passwordRegex
                            "
                            >Invalid password.</label
                          >
                        </div>
                      </div>
                      <div
                        class="eos-form-group"
                        :class="{
                          'eos-form-group--error':
                            $v.selectedItem.confirmPassword.$error
                        }"
                      >
                        <label class="eos-form-group-label" for="password"
                          >Confirm password*</label
                        >
                        <input
                          class="eos-form__input_text"
                          type="password"
                          name="txtEditConfirmPassword"
                          v-model="selectedItem.confirmPassword"
                          id="txtLocalConfirmNewPass"
                          @input="$v.selectedItem.confirmPassword.$touch"
                        />
                        <div
                          class="eos-form-group-label eos-form-group-error-msg"
                        >
                          <label
                            v-if="
                              $v.selectedItem.confirmPassword.$dirty &&
                                !$v.selectedItem.confirmPassword.sameAsPassword
                            "
                            >Passwords do not match.</label
                          >
                        </div>
                      </div>
                    </v-col>
                    <v-col>
                      <div class="mb-3">Roles</div>
                      <label class="eos-rdb-container">
                        Manage
                        <input
                          type="radio"
                          v-model="selectedItem.role"
                          name="rbtEditManageInterface"
                          value="manage"
                          id="chkLocalManageInterface"
                          :disabled="
                            isAdminUser(props.item) ||
                              strEqualityCaseInsensitive(
                                selectedItem.username,
                                loggedInUserName
                              )
                          "
                        />
                        <span
                          class="eos-rdb-tick"
                          id="lblLocalManageInterface"
                        ></span>
                      </label>
                      <br />
                      <label class="eos-rdb-container mt-2">
                        Monitor
                        <input
                          type="radio"
                          v-model="selectedItem.role"
                          name="rbtEditMonitorInterface"
                          value="monitor"
                          id="chkLocalMonitorInterface"
                          :disabled="
                            isAdminUser(props.item) ||
                              strEqualityCaseInsensitive(
                                selectedItem.username,
                                loggedInUserName
                              )
                          "
                        />
                        <span
                          class="eos-rdb-tick"
                          id="lblLocalMonitorInterface"
                        ></span>
                      </label>
                    </v-col>
                  </v-row>
                </div>
                <button
                  type="button"
                  class="ma-5 eos-btn-primary"
                  @click="editUser(selectedItem)"
                  id="lblLocalApplyInterface"
                  :disabled="!isEditFormValid"
                >
                  Apply
                </button>
                <button
                  type="button"
                  class="eos-btn-tertiary"
                  @click="closeEditUser(props)"
                  id="lblLocalCanacelInterface"
                >
                  Cancel
                </button>
              </td>
            </tr>
          </template>
        </v-data-table>
      </eos-has-access>
    </v-card>
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
import {
  required,
  helpers,
  sameAs,
  requiredIf
} from "vuelidate/lib/validators";
import {
  accountNameRegex,
  passwordRegex,
  passwordTooltipMessage,
  usernameTooltipMessage
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
      }
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
      }
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
      createAccount: { username: "", password: "", confirmPassword: "" },
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
      userHeader: [
        {
          text: "Username",
          value: "username",
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
      passwordTooltipMessage,
      usernameTooltipMessage,
      loggedInUserName: localStorage.getItem("username"),
      selectedItem: { password: "", old_password: "", confirmPassword: "" }
    };
  }

  public async mounted() {
    await this.getUserData();
  }

  private addUser() {
    if (this.$data.isUserCreate) {
      this.clearCreateAccountForm();
    }
    this.$data.isUserCreate = !this.$data.isUserCreate;
    return this.$data.isUserCreate;
  }

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
  /**
   * This method create csm user
   */
  private async createUser() {
    const queryParams: UserDetails = {
      username: this.$data.createAccount.username,
      password: this.$data.createAccount.password,
      interfaces: this.$data.checkedInterfaces,
      roles: [this.$data.checkedRoles],
      temperature: this.$data.temperature,
      language: this.$data.language,
      timeout: 1
    };

    this.$store.dispatch("systemConfig/showLoader", "Creating user...");
    await Api.post(apiRegister.csm_user, queryParams);
    this.$data.isUserCreate = !this.$data.isUserCreate;
    this.clearCreateAccountForm();
    this.$store.dispatch("systemConfig/hideLoader");
    await this.getUserData();
  }

  private clearCreateAccountForm() {
    this.$data.createAccount = {};
    this.$data.checkedRoles = "manage";
    this.$v.createAccount.$reset();
  }
  /**
   * Edit Csm User
   */
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
    this.closeEditUser();
    this.$store.dispatch("systemConfig/hideLoader");
    await this.getUserData();
  }

  private closeEditUser() {
    // props.expand(false);
    this.$data.expanded = [];
    this.$v.selectedItem.$reset();
  }
  private onExpand(props: any) {
    if (props.isExpanded === false) {
      props.expand(props.item);
      this.$data.selectedItem = {
        ...props.item,
        role: this.isAdminUser(props.item) ? props.item.roles[1] : props.item.roles[0]
      };
    } else {
      props.expand(false);
    }
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
  private async getUserData() {
    this.$store.dispatch("systemConfig/showLoader", "Fetching users...");
    const res = await Api.getAll(apiRegister.csm_user);
    if (res && res.data && res.data.users) {
      this.$data.userData = res.data.users;
    }
    this.$store.dispatch("systemConfig/hideLoader");
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
</style>
