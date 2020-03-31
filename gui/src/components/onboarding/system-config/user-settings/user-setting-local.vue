<template>
  <v-container>
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblLocalSetting">
        User settings: Local
      </div>
      <div class="mt-5">
        <span class="font-weight-regular" id="lblLocalMsgConfig">
          Use this table to create CSM users that have access to CSM
          functionality. You can add as many as you like.
        </span>
      </div>
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
                    :message="accountNameTooltipMessage"
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
                    >Account Name is required</label
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
                /></label>
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
              <div
                class="eos-form-group"
                :class="{
                  'eos-form-group--error':
                    $v.createAccount.confirmPassword.$error
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
                    >Passwords do not match</label
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
              <tr class="font-weight-small">
                <td>
                  <span>
                    <eos-has-access
                      :to="
                        $eosUserPermissions.users + $eosUserPermissions.update
                      "
                    >
                      <div
                        @click="onExpand(props)"
                        v-if="
                          isLoggedInUserAdmin() ||
                            props.item.username === loggedInUserName
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
                      :to="
                        $eosUserPermissions.users + $eosUserPermissions.update
                      "
                    >
                      <img
                        v-if="
                          isLoggedInUserAdmin() ||
                            props.item.username === loggedInUserName
                        "
                        class="mx-2 eos-cursor-pointer"
                        @click="onExpand(props)"
                        title="Edit"
                        src="./../../../../assets/actions/edit-green.svg"
                      />
                    </eos-has-access>
                    <eos-has-access
                      :to="
                        $eosUserPermissions.users + $eosUserPermissions.delete
                      "
                    >
                      <img
                        v-if="
                          isLoggedInUserAdmin() &&
                            props.item.username !== loggedInUserName
                        "
                        class="mx-2 eos-cursor-pointer"
                        @click="onDeleteConfirmation(props.item.id)"
                        title="Delete"
                        src="./../../../../assets/actions/delete-green.svg"
                      />
                      <img
                        v-if="
                          props.item.username === loggedInUserName &&
                            !isAdminUser(props.item)
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
                              props.item.username === loggedInUserName
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
                          /></label>
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
                              >Old password is required</label
                            >
                            <label
                              v-else-if="
                                $v.selectedItem.old_password.$dirty &&
                                  !$v.selectedItem.old_password.passwordRegex
                              "
                              >Invalid old password</label
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
                          /></label>
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
                              >Password is required</label
                            >
                            <label
                              v-else-if="
                                $v.selectedItem.password.$dirty &&
                                  !$v.selectedItem.password.passwordRegex
                              "
                              >Invalid password</label
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
                                  !$v.selectedItem.confirmPassword
                                    .sameAsPassword
                              "
                              >Passwords do not match</label
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
                            v-model="
                              isAdminUser(props.item)
                                ? selectedItem.roles[1]
                                : selectedItem.roles[0]
                            "
                            name="rbtEditManageInterface"
                            value="manage"
                            id="chkLocalManageInterface"
                            :disabled="
                              isAdminUser(props.item) ||
                                selectedItem.username === loggedInUserName
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
                            v-model="
                              isAdminUser(props.item)
                                ? selectedItem.roles[1]
                                : selectedItem.roles[0]
                            "
                            name="rbtEditMonitorInterface"
                            value="monitor"
                            id="chkLocalMonitorInterface"
                            :disabled="
                              isAdminUser(props.item) ||
                                selectedItem.username === loggedInUserName
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
                    :disabled="
                      $v.selectedItem.$invalid &&
                        !$v.selectedItem.confirmPassword.$dirty
                    "
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
    </div>
    <eos-confirmation-dialog
      :show="showConfirmationDialog"
      title="Confirmation"
      :message="confirmationDialogMessage"
      severity="warning"
      @closeDialog="closeConfirmationDialog"
      cancelButtonText="No"
    ></eos-confirmation-dialog>
    <span class="d-none">{{ isValidForm }}</span>
  </v-container>
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
  accountNameTooltipMessage
} from "./../../../../common/regex-helpers";

import { EVENT_BUS } from "./../../../../main";

@Component({
  name: "eos-user-setting-local"
})
export default class EosUserSettingLocal extends Vue {
  @Validations()
  private validations = {
    createAccount: {
      username: { required, accountNameRegex },
      password: { required, passwordRegex },
      confirmPassword: {
        sameAsPassword: sameAs("password")
      }
    },
    selectedItem: {
      password: { required, passwordRegex },
      old_password: { required, passwordRegex },
      confirmPassword: {
        sameAsPassword: sameAs("password")
      }
    }
  };

  private data() {
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
      accountNameTooltipMessage,
      loggedInUserName: localStorage.getItem("username"),
      selectedItem: { password: "", old_password: "", confirmPassword: "" }
    };
  }

  private mounted() {
    // WizardHook: Open a listener for onNext event
    // So when wizard footer clicks on the Next Button this component can perform its own workflow
    this.getUserData();

    EVENT_BUS.$on("emitOnNext", (res: any) => {
      res(true);
    });
  }
  private destroyed() {
    // WizardHook: shut off on exit event listener
    EVENT_BUS.$off("emitOnNext");
  }
  get isValidForm() {
    const validate = true;
    // WizardHook: Emit event to sibling wizard footer component
    // to send information about data validation to enable/disable wizard footer
    EVENT_BUS.$emit("validForm", validate);
    return validate;
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
  private closeConfirmationDialog(confirmation: boolean) {
    this.$data.showConfirmationDialog = false;
    if (confirmation && this.$data.selectedItemToDelete) {
      this.onDelete(this.$data.selectedItemToDelete);
    }
  }
  /**
   * This method create csm user
   */
  private createUser() {
    this.$store.dispatch("systemConfig/showLoader", "Creating user...");

    this.$data.isUserCreate = !this.$data.isUserCreate;
    const queryParams: UserDetails = {
      username: this.$data.createAccount.username,
      password: this.$data.createAccount.password,
      interfaces: this.$data.checkedInterfaces,
      roles: [this.$data.checkedRoles],
      temperature: this.$data.temperature,
      language: this.$data.language,
      timeout: 1
    };
    this.$store
      .dispatch("createUser/createCSMUserAction", queryParams)
      .then((res: any) => {
        this.getUserData();
      })
      .finally(() => {
        this.clearCreateAccountForm();
        this.$store.dispatch("systemConfig/hideLoader");
      });
    return this.$data.isUserCreate;
  }

  private clearCreateAccountForm() {
    this.$data.createAccount = {};
    this.$data.checkedRoles = "manage";
    this.$v.createAccount.$reset();
  }
  /**
   * Edit Csm User
   */
  private editUser(selectedItem: any) {
    if (
      this.isAdminUser(selectedItem) ||
      selectedItem.username === this.$data.loggedInUserName
    ) {
      delete selectedItem.roles;
      delete selectedItem.confirmPassword;
    }
    this.$store.dispatch("systemConfig/showLoader", "Updating user details...");
    this.$store
      .dispatch("createUser/updateUserDetails", selectedItem)
      .then((res: any) => {
        this.getUserData();
      })
      .catch(() => {
        // tslint:disable-next-line: no-console
        console.error("Create User Fails");
      })
      .finally(() => {
        this.closeEditUser();
        this.$store.dispatch("systemConfig/hideLoader");
      });
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
        roles: [...props.item.roles]
      };
    } else {
      props.expand(false);
    }
  }

  private onDelete(id: string) {
    this.$store.dispatch("systemConfig/showLoader", "Deleting user...");

    this.$store
      .dispatch("createUser/deleteUserAction", id)
      .then(data => {
        this.getUserData();
      })
      .catch(e => {
        // tslint:disable-next-line: no-console
        console.log("err logger: ", e);
      })
      .finally(() => {
        this.$store.dispatch("systemConfig/hideLoader");
      });
  }
  private isAdminUser(item: any) {
    return item.roles.includes("root");
  }
  private getUserData() {
    this.$store.dispatch("systemConfig/showLoader", "Fetching users...");

    this.$store
      .dispatch("createUser/getDataAction")
      .then(data => {
        this.$data.userData = data;
      })
      .catch(e => {
        // tslint:disable-next-line: no-console
        console.log("err logger: ", e);
      })
      .finally(() => {
        this.$store.dispatch("systemConfig/hideLoader");
      });
  }

  private isLoggedInUserAdmin() {
    let isAdmin;
    const data = this.$data.userData.find((element: any) => {
      if (element.username === this.$data.loggedInUserName) {
        return true;
      }
    });

    if (data.username === this.$data.loggedInUserName) {
      isAdmin = this.isAdminUser(data);
    }
    return isAdmin;
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
