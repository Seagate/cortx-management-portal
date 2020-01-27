<template>
  <v-container>
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblLocalSetting">User settings: Local</div>
      <div class="mt-5">
        <span class="font-weight-regular" id="lblLocalMsgConfig">
          Use this table to create CSM users that have access CSM
          functionality. You can add as many as you like.
        </span>
      </div>
      <v-card class="col-10 pb-5 mt-10 elevation-0" outlined tile>
        <div v-if="isUserCreate">
          <v-row>
            <v-col class="pl-5">
              <div
                class="eos-form-group"
                :class="{ 'eos-form-group--error': $v.createAccount.username.$error }"
              >
                <label class="eos-form-group-label" for="Username">Username*</label>
                <input
                  class="eos-form__input_text"
                  type="text"
                  name="username"
                  v-model.trim="createAccount.username"
                  id="txtLocalHostname"
                  @input="$v.createAccount.username.$touch"
                />
                <div class="eos-form-group-label eos-form-group-error-msg">
                  <label
                    v-if="$v.createAccount.username.$dirty && !$v.createAccount.username.required"
                  >Account Name is required</label>
                </div>
              </div>
              <div
                class="eos-form-group"
                :class="{ 'eos-form-group--error': $v.createAccount.password.$error }"
              >
                <label class="eos-form-group-label" for="password">Password*</label>
                <input
                  class="eos-form__input_text"
                  type="password"
                  name="password"
                  v-model.trim="createAccount.password"
                  @input="$v.createAccount.password.$touch"
                  id="txtLocalPass"
                />
                <div class="eos-form-group-label eos-form-group-error-msg">
                  <label
                    v-if="$v.createAccount.password.$dirty && !$v.createAccount.password.required"
                  >Password is required</label>
                  <label
                    v-else-if="$v.createAccount.password.$dirty && !$v.createAccount.password.passwordRegex"
                  >Invalid Password</label>
                </div>
              </div>
              <div
                class="eos-form-group"
                :class="{ 'eos-form-group--error': $v.createAccount.confirmPassword.$error }"
              >
                <label class="eos-form-group-label" for="password">Confirm password*</label>
                <input
                  class="eos-form__input_text"
                  type="password"
                  name="confirmPassword"
                  v-model="createAccount.confirmPassword"
                  id="txtLocalPass"
                  @input="$v.createAccount.confirmPassword.$touch"
                />
                <div class="eos-form-group-label eos-form-group-error-msg">
                  <label
                    v-if="$v.createAccount.confirmPassword.$dirty && !$v.createAccount.confirmPassword.sameAsPassword"
                  >Passwords do not match</label>
                </div>
              </div>
            </v-col>
            <v-col>
              <div class="font-weight-medium pt-3 pb-2">Roles</div>
              <input
                type="radio"
                v-model="checkedRoles"
                name="manage"
                value="manage"
                id="chkLocalManage"
              />
              <span class="ml-3 font-weight-medium">Manage</span>
              <br />
              <input
                type="radio"
                v-model="checkedRoles"
                name="monitor"
                value="monitor"
                id="chkLocalMonitor"
              />
              <span class="ml-3 font-weight-medium">Monitor</span>
            </v-col>
          </v-row>
        </div>
        <v-btn
          v-if="!isUserCreate"
          color="csmprimary"
          class="ma-5 elevation-0 white--text"
          @click="addUser()"
          id="btnLocalAddNewUser"
        >Add new user</v-btn>
        <v-btn
          v-if="isUserCreate"
          color="csmprimary"
          class="ma-5 elevation-0 white--text"
          @click="createUser()"
          id="btnLocalCreateUser"
          :disabled="$v.createAccount.$invalid"
        >Create</v-btn>

        <v-btn
          text
          small
          color="csmprimary"
          v-if="isUserCreate"
          @click="addUser()"
          id="lblLocalCancel"
        >Cancel</v-btn>
        <v-data-table
          calculate-widths
          :items="alertData"
          :single-expand="singleExpand"
          :expanded.sync="expanded"
          item-key="id"
          show-expand
          class="eos-table"
          hide-default-header
        >
          <template v-slot:header="{ props }">
            <tr>
              <th class="tableheader" />
              <th v-for="header in alertHeader" :key="header.text" class="tableheader">
                <span
                  class="headerText"
                  :class="
                    header.value === sortColumnName && isSortActive
                      ? 'active'
                      : ''
                  "
                >{{ header.text }}</span>
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
              <td @click="onExpand(props)">
                <img v-if="props.isExpanded" src="./../../../../assets/caret-green-down.png" />
                <img v-if="!props.isExpanded" src="./../../../../assets/caret-green-right.png" />
              </td>
              <td>{{ props.item.username }}</td>
              <td>
                <span
                  v-for="(role, i) in props.item.roles"
                  :key="role"
                >{{ i == 0 ? "" : ", " }}{{ role | capitalize }}</span>
              </td>
              <td>
                <img class="mb-2" @click="onExpand(props)" src="./../../../../assets/edit-off.png" />
                <v-divider class="mx-4" light vertical inset></v-divider>
                <img
                  class="mb-2"
                  @click="onDelete(props.item.id)"
                  src="./../../../../assets/delete-off.png"
                />
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
                        :class="{ 'eos-form-group--error': $v.selectedItem.username.$error }"
                      >
                        <label class="eos-form-group-label" for="Username">Username*</label>
                        <input
                          class="eos-form__input_text"
                          type="text"
                          name="username"
                          v-model="selectedItem.username"
                          id="txtLocalHostnameinetrface"
                          @input="$v.selectedItem.username.$touch"
                        />
                        <div class="eos-form-group-label eos-form-group-error-msg">
                          <label
                            v-if="$v.selectedItem.username.$dirty && !$v.selectedItem.username.required"
                          >Account Name is required</label>
                        </div>
                      </div>
                    </v-col>
                    <v-col>
                      <div class="font-weight-medium pt-3 pb-2">Roles</div>
                      <input
                        type="radio"
                        v-model="selectedItem.roles[0]"
                        name="manage"
                        value="manage"
                        id="chkLocalManageInterface"
                        checked
                      />
                      <span class="eos-rdb-container">Manage</span>
                      <br />
                      <input
                        type="radio"
                        v-model="selectedItem.roles[0]"
                        name="monitor"
                        value="monitor"
                        id="chkLocalMoniterInterface"
                      />
                      <span class="eos-rdb-container">Monitor</span>
                    </v-col>
                  </v-row>
                </div>
                <v-btn
                  color="csmprimary"
                  class="ma-5 elevation-0 white--text"
                  @click="editUser(selectedItem)"
                  id="lblLocalApplyInterface"
                  :disabled="$v.selectedItem.$invalid"
                >Apply</v-btn>
                <v-btn
                  text
                  small
                  color="csmprimary"
                  @click="closeEditUser(props)"
                  id="lblLocalCanacelInterface"
                >Cancel</v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </div>
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
const passwordRegex = helpers.regex(
  "passwordRegex",
  /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\(\)\_\+\-\=\[\]\{\}\|\'])[A-Za-z\d!@#\$%\^&\*\(\)\_\+\-\=\[\]\{\}\|\']{8,}/
);
import { EVENT_BUS } from "./../../../../main";

@Component({
  name: "eos-user-setting-local"
})
export default class EosUserSettingLocal extends Vue {
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
    this.$data.isUserCreate = !this.$data.isUserCreate;
    return this.$data.isUserCreate;
  }
  @Validations()
  public validations = {
    createAccount: {
      username: { required },
      password: { required, passwordRegex },
      confirmPassword: {
        sameAsPassword: sameAs("password")
      }
    },
    selectedItem: {
      username: { required }
    }
  };
  /**
   * This method create csm user
   */
  private createUser() {
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
      .catch(() => {
        // tslint:disable-next-line: no-console
        console.error("Create User Fails");
      });
    return this.$data.isUserCreate;
  }
  /**
   * Edit Csm User
   */
  private editUser(selectedItem: any) {
    this.$store
      .dispatch("createUser/updateUserDetails", selectedItem)
      .then((res: any) => {
        this.getUserData();
      })
      .catch(() => {
        // tslint:disable-next-line: no-console
        console.error("Create User Fails");
      });
    this.$data.expanded = [];
  }

  private closeEditUser() {
    // props.expand(false);
    this.$data.expanded = [];
  }
  private onExpand(props: any) {
    if (props.isExpanded === false) {
      props.expand(props.item);
      this.$data.selectedItem = props.item;
    } else {
      props.expand(false);
    }
  }
  private onDelete(id: string) {
    // TODO: Need to remove this check once api is properly implemented
    if (!this.isFirstElement(id)) {
      this.$store
        .dispatch("createUser/deleteUserAction", id)
        .then(data => {
          this.getUserData();
        })
        .catch(e => {
          // tslint:disable-next-line: no-console
          console.log("err logger: ", e);
        });
    }
  }
  // TODO: Need to remove this logic once api is properly implemented
  private isFirstElement(id: string): boolean {
    let isFirstElem: boolean = false;
    if (this.$data.alertData.length > 0 && this.$data.alertData[0].id === id) {
      isFirstElem = true;
    }
    return isFirstElem;
  }
  private getUserData() {
    this.$store
      .dispatch("createUser/getDataAction")
      .then(data => {
        this.$data.alertData = data;
      })
      .catch(e => {
        // tslint:disable-next-line: no-console
        console.log("err logger: ", e);
      });
  }
  private data() {
    return {
      source: "manual",
      isUserCreate: false,
      isUserEdit: false,
      page: 1, // Page counter, in sync with data table
      singleExpand: true, // Expande single row property
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
      selectedItem: {},
      expanded: [],
      alertHeader: [
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
      alertData: []
    };
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
