<template>
  <v-container class="mt-6 body-2">
    <!--<v-img
      id="alert-img"
      :src="require('./../../../../assets/onboarding-wizard.png')"
      width="780px"
      height="70px"
    ></v-img>
    <v-divider />-->
    <div>
      <div class="title mt-6" id="lblLocalSetting">
        User Settings: Local
        <v-icon class="green--text" size="20">mdi-help-circle-outline</v-icon>
      </div>
    </div>
    <div class="mt-5">
      <span
        class="font-weight-regular"
        id="lblLocalMsgConfig"
      >Use this table to create CSM users that have access CSM functionality. You can add as many as you like.</span>
    </div>
    <v-card class="col-10 pb-5 mt-10 elevation-0" outlined tile>
      <div v-if="isUserCreate">
        <v-row>
          <v-col class="pl-5">
            <div class="font-weight-medium pt-3" id="lblLocalUsrName">User Name</div>
            <input
              class="input-text"
              type="text"
              name="username"
              v-model="username"
              id="txtLocalHostname"
            />
            <div class="font-weight-medium pt-3">Password</div>
            <input
              class="input-text"
              type="password"
              name="password"
              v-model="password"
              id="txtLocalPass"
            />
            <div class="font-weight-medium pt-3" id="lblLocalConfirmPass">Confirm Password</div>
            <input
              class="input-text"
              type="password"
              name="confirmPassword"
              v-model="confirmPassword"
              id="txtLocalPass"
            />
          </v-col>
          <v-col>
            <div class="font-weight-medium pt-3 pb-2">Interfaces</div>
            <input
              type="checkbox"
              @change="web"
              v-model="checkedInterfaces"
              name="web"
              value="web"
              id="chkLocalWeb"
            />
            <span class="ml-3 font-weight-medium">Web</span>
            <br />
            <input
              type="checkbox"
              @change="cli"
              v-model="checkedInterfaces"
              name="cli"
              value="cli"
              id="chkLocalCli"
            />
            <span class="ml-3 font-weight-medium">CLI</span>
            <br />
            <input
              type="checkbox"
              @change="api"
              v-model="checkedInterfaces"
              name="api"
              value="api"
              id="chkLocalAPi"
            />
            <span class="ml-3 font-weight-medium">API</span>
          </v-col>
          <v-col>
            <div class="font-weight-medium pt-3 pb-2">Roles</div>
            <input
              type="checkbox"
              @change="manage"
              v-model="checkedRoles"
              name="manage"
              value="manage"
              id="chkLocalManage"
            />
            <span class="ml-3 font-weight-medium">Manage</span>
            <br />
            <input
              type="checkbox"
              @change="monitor"
              v-model="checkedRoles"
              name="monitor"
              value="monitor"
              id="chkLocalMonitor"
            />
            <span class="ml-3 font-weight-medium">Monitor</span>
          </v-col>
          <v-col>
            <div class="font-weight-medium pt-3" id="lblLocalTempPref">Temperature preference</div>
            <select
              name="temperature"
              id="cmdTemperature"
              class="input-text pl-1"
              style="width: 10em;"
              v-model="temperature"
            >
              <option value="celsius">Celsius</option>
            </select>
            <div class="font-weight-medium pt-3" id="lblLocalLang">Language</div>
            <select
              name="language"
              v-model="language"
              id="cmdLanguage"
              class="input-text pl-1"
              style="width: 10em;"
            >
              <option value="English">English</option>
            </select>
          </v-col>
        </v-row>
      </div>
      <v-btn color="green" class="ma-5 elevation-0" id="btnLocalAddNewUser">
        <span
          v-if="!isUserCreate"
          class="white--text"
          @click="addUser()"
          id="lblLocalAddUser"
        >Add New User</span>
        <span
          v-if="isUserCreate"
          class="white--text"
          @click="createUser()"
          id="lblLocalCreateUser"
        >Create User</span>
      </v-btn>
      <span v-if="isUserCreate" class="green--text" @click="addUser()" id="lblLocalCancel">Cancel</span>
      <v-data-table
        calculate-widths
        :items="alertData"
        :single-expand="singleExpand"
        item-key="id"
        show-expand
        class="eos-table"
        hide-default-header
      >
        <template v-slot:header="{props}">
          <tr>
            <th class="tableheader" />
            <th
              v-for="header in alertHeader"
              :key="header.text"
              class="tableheader text-capitalize font-weight-medium text--black"
              @click="onSortPaginate(header.value, header, props.options.page, props.options.itemsPerPage)"
            >
              <span
                class="headerText"
                :class="(header.value === sortColumnName && isSortActive) ? 'active' : ''"
              >{{ header.text }}</span>
              <span
                :class="(header.value === sortColumnName && isSortActive) ? 'active' : 'notActive'"
              >
                <img
                  v-if="header.sortable && header.sortDir === alertStatus.desc"
                  src="./../../../../assets/table-caret-green-down.png"
                />
                <img
                  v-if="header.sortable && header.sortDir === alertStatus.asc"
                  src="./../../../../assets/table-caret-green-up.png"
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
            <td>{{props.item.username}}</td>
            <td>
              <span
                v-for="(interfacevalue,k) in props.item.interfaces"
                :key="interfacevalue"
              >{{k==0?"":","}}{{interfacevalue}}</span>
            </td>
            <td>
              <span v-for="(role, i) in props.item.roles" :key="role">{{i==0?"":","}}{{role}}</span>
            </td>
            <td>
              <img @click="onExpand(props)" src="./../../../../assets/edit-off.png" />
              <v-divider class="mx-4" light vertical inset></v-divider>
              <img @click="onDelete(props.item.id)" src="./../../../../assets/delete-off.png" />
            </td>
          </tr>
        </template>
        <template v-slot:expanded-item="props">
          <tr class="grey lighten-5" v-if="!isUserEdit">
            <td colspan="5">
              <div>
                <v-row>
                  <v-col class="pl-5">
                    <div class="font-weight-medium pt-3" id="lblLocalUserName">User Name</div>
                    <input
                      class="input-text"
                      type="text"
                      name="username"
                      v-model="selectedItem.username"
                      id="txtLocalHostnameinetrface"
                    />
                  </v-col>
                  <v-col>
                    <div class="font-weight-medium pt-3 pb-2">Interfaces</div>
                    <input
                      type="checkbox"
                      v-model="selectedItem.interfaces"
                      name="web"
                      value="web"
                      d="chkLocalWebinterface"
                    />
                    <span class="ml-3 font-weight-medium">Web</span>
                    <br />
                    <input
                      type="checkbox"
                      v-model="selectedItem.interfaces"
                      name="cli"
                      value="api"
                      id="chkLocalCliinterface"
                    />
                    <span class="ml-3 font-weight-medium">CLI</span>
                    <br />
                    <input
                      type="checkbox"
                      v-model="selectedItem.interfaces"
                      name="api"
                      value="cli"
                      id="chkLocalApiInterface"
                    />
                    <span class="ml-3 font-weight-medium">API</span>
                  </v-col>
                  <v-col>
                    <div class="font-weight-medium pt-3 pb-2">Roles</div>
                    <input
                      type="checkbox"
                      v-model="selectedItem.roles"
                      name="manage"
                      value="manage"
                      id="chkLocalManageInterface"
                    />
                    <span class="ml-3 font-weight-medium">Manage</span>
                    <br />
                    <input
                      type="checkbox"
                      v-model="selectedItem.roles"
                      name="monitor"
                      value="monitor"
                      id="chkLocalMoniterInterface"
                    />
                    <span class="ml-3 font-weight-medium">Monitor</span>
                  </v-col>
                  <v-col>
                    <div class="font-weight-medium pt-3">Temperature preference</div>
                    <select
                      name="temperature"
                      id="cmdTemperature"
                      class="input-text pl-1"
                      style="width: 10em;"
                      v-model="selectedItem.temperature"
                    >
                      <option value="celsius">Celsius</option>
                    </select>
                    <div class="font-weight-medium pt-3">Language</div>
                    <select
                      name="language"
                      id="cmdLanguage"
                      class="input-text pl-1"
                      style="width: 10em;"
                      v-model="selectedItem.language"
                    >
                      <option value="English">English</option>
                    </select>
                  </v-col>
                </v-row>
              </div>
              <v-btn color="green" class="ma-5 elevation-0">
                <span
                  class="white--text"
                  @click="editUser(selectedItem)"
                  id="lblLocalApplyInterface"
                >Apply</span>
              </v-btn>
              <span
                class="green--text"
                @click="closeEditUser()"
                id="lblLocalCanacelInterface"
              >Cancel</span>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <!--<div class="mt-8">
      <v-btn elevation="0" color="green" id="btnLocalAppyInterface">
        <span class="white--text" @click="gotToNextPage()">Apply and Continue</span>
      </v-btn>
      <span
        class="green--text ml-8 pointer"
        @click="gotToPrevPage()"
        id="lblLocalBackInterface"
      >Back to previous step</span>
    </div>-->
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { UserDetails } from "./../../../../models/user-Details";

@Component({
  name: "eos-user-setting-local"
})
export default class EosUserSettingLocal extends Vue {
  public gotToNextPage() {
    this.$router.push("usersettingldap");
  }
  public gotToPrevPage() {
    this.$router.push("usersetting");
  }
  private addIpAddressNode0(address: string) {
    if (
      this.$data.ipaddressNode0.length < 4 &&
      address !== "" &&
      address !== undefined
    ) {
      this.$data.ipaddressNode0.push(address);
      this.$data.newAddressNode0 = "";
    }
  }
  private addUser() {
    this.$data.isUserCreate = !this.$data.isUserCreate;
    return this.$data.isUserCreate;
  }
  private createUser() {
    this.$data.isUserCreate = !this.$data.isUserCreate;
    const queryParams: UserDetails = {
      username: this.$data.username,
      password: this.$data.password,
      interfaces: this.$data.checkedInterfaces,
      roles: this.$data.checkedRoles,
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
  private mounted() {
    this.getUserData();
  }
  private data() {
    return {
      source: "manual",
      isUserCreate: false,
      isUserEdit: false,
      page: 1, // Page counter, in sync with data table
      singleExpand: false, // Expande single row property
      itemsPerPage: 5, // Total rows per page, in sync with data table
      isSortActive: false, // Set table column sorting flag to default inactive
      sortColumnName: "", // Set sorting column name to none
      alertStatus: require("./../../../../common/const-string.json"),
      username: "",
      password: "",
      confirmPassword: "",
      web: "",
      cli: "",
      api: "",
      manage: "",
      monitor: "",
      temperature: "",
      language: "",
      timeout: "",
      checkedRoles: [],
      checkedInterfaces: [],
      selectedItem: {},
      alertHeader: [
        {
          text: "Username",
          value: "username",
          sortable: false
        },
        {
          text: "Interfaces",
          value: "interfaces",
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
  color: green;
  float: right;
}
#title {
  color: black;
}
.tableheader {
  height: 2.5em;
  background-color: #e3e3e3;
  border-top: 1px solid whitesmoke;
  padding-top: 0.5em;
}
.active {
  display: inline-block;
  color: green !important;
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
tbody tr {
  background-color: #ebf1e9 !important ;
}
tbody tr:hover {
  border-top: 2px solid darkgray !important;
  border-bottom: 2px solid darkgray !important;
}
tbody tr:active {
  border-top: 2px solid darkgray !important;
  border-bottom: 2px solid darkgray !important;
}
</style>
