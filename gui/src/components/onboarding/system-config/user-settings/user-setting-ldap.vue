<template>
  <v-container class="mt-6 body-2">
    <v-img
      id="alert-img"
      :src="require('./../../../../assets/onboarding-wizard.png')"
      width="780px"
      height="70px"
    ></v-img>
    <v-divider />
    <div>
      <div class="title mt-6" id="lblLDAPSetting">User Settings: LDAP</div>
    </div>
    <v-card class="col-10 pb-5 mt-10 elevation-0 pa-0" outlined tile>
      <div class="title ma-3" id="lblLDAPConfig">LDAP Configuration</div>
      <v-divider class="pa-0" />
      <div class="mt-3">
        <!--<v-row class="col-12 py-0">
          <v-col>
            <input type="checkbox" @change="isLdap" v-model="isLdap" name="ldap" id="chkLDAPIsldap" />
            <span class="ml-3 font-weight-medium" id="lblLDAPEnable">Enable LDAP</span>
          </v-col>
        </v-row>-->
        <v-row class="col-12 py-0">
          <v-col class="py-0">
            <div class="font-weight-medium" id="lblLDAPUserSearch">User Search Base</div>
            <input
              class="input-text"
              type="text"
              name="usersearchbase"
              v-model="usersearchbase"
              id="txtLDAPUserBase"
            />
          </v-col>
        </v-row>
        <v-row class="col-7 pb-0">
          <v-col class="py-0">
            <div class="font-weight-medium">Server</div>
            <input class="input-text" type="text" name="server" v-model="server" id="txtLDAPServer" />
          </v-col>
          <v-col class="pa-0">
            <div class="font-weight-medium">Port</div>
            <input
              class="input-text"
              type="number"
              name="port"
              v-model="port"
              style="width:5em;"
              id="txtLDAPPort"
              min=0001
              max=65535
            />
          </v-col>
        </v-row>
        <v-row class="col-7 pb-0">
          <v-col class="py-0">
            <div class="font-weight-medium">Alt Server</div>
            <input
              class="input-text"
              type="text"
              name="altserver"
              v-model="altserver"
              id="txtLDAPaltServer"
            />
          </v-col>
          <v-col class="pa-0">
            <div class="font-weight-medium">Alt Port</div>
            <input
              class="input-text"
              type="number"
              name="altport"
              v-model="altport"
              style="width:5em;"
              id="txtLDAPaltPort"
              min=0001
              max=65535
            />
          </v-col>
        </v-row>
      </div>

      <!--<v-btn color="csmprimary" @click="setLDAP()" class="ma-5 elevation-0" id="btnLDAPSet">Set LDAP</v-btn>
      <v-btn
        text
        small
        color="csmprimary"
        @click="setLDAP()"
        id="lblLDAPCancel"
      >Cancel</v-btn>-->
    </v-card>

    <!--<v-card class="col-10 pb-5 mt-10 elevation-0" outlined tile>
      <div class="title ma-3" id="lblLDAPCurrentUser">Current user groups</div>
      <v-divider class="pa-0" />
      <div v-if="isUserCreate">
        <v-row>
          <v-col class="pl-5">
            <div class="font-weight-medium pt-3" id="lblLDAPUserName">Username</div>
            <input
              class="input-text"
              type="text"
              name="hostname"
              v-model="hostname"
              id="txtLDAPHostName"
            />
            <div class="font-weight-medium pt-3" id="lblLDAPPass">Password</div>
            <input
              class="input-text"
              type="password"
              name="password"
              v-model="password"
              id="txtLDAPPass"
            />
            <div class="font-weight-medium pt-3" id="lblLDAPConfirmPass">Confirm password</div>
            <input
              class="input-text"
              type="password"
              name="confirmPassword"
              v-model="confirmPassword"
              id="txtLDAPConfirmPass"
            />
          </v-col>
          <v-col>
            <div class="font-weight-medium pt-3 pb-2">Interfaces</div>
            <input type="checkbox" @change="web" v-model="web" name="web" id="chkLDAPWeb" />
            <span class="ml-3 font-weight-medium" id="lblLDAPWeb">Web</span>
            <br />
            <input type="checkbox" @change="cli" v-model="cli" name="cli" id="chkLDAPCli" />
            <span class="ml-3 font-weight-medium" id="lblLDAPCli">CLI</span>
            <br />
            <input type="checkbox" @change="api" v-model="api" name="api" id="ChkLDAPApi" />
            <span class="ml-3 font-weight-medium" id="lblLDAPAPi">API</span>
          </v-col>
          <v-col>
            <div class="font-weight-medium pt-3 pb-2" id="lblLDAPRole">Roles</div>
            <input
              type="checkbox"
              @change="manage"
              v-model="manage"
              name="manage"
              id="chkLDAPManage"
            />
            <span class="ml-3 font-weight-medium" id="lblLDAPManage">Manage</span>
            <br />
            <input
              type="checkbox"
              @change="monitor"
              v-model="monitor"
              name="monitor"
              id="chkLDAPMonitor"
            />
            <span class="ml-3 font-weight-medium" id="lblLDAPMonitor">Monitor</span>
          </v-col>
          <v-col>
            <div class="font-weight-medium pt-3" id="lblLDAPTempPref">Temperature Preference</div>
            <select
              name="temperature"
              id="cmdTemperature"
              class="input-text pl-1"
              style="width: 10em;"
            >
              <option value="celsius">Celsius</option>
              <option value="celsius1">Celsius</option>
            </select>
            <div class="font-weight-medium pt-3" id="lblLDAPTimeout">Timeout</div>
            <input
              type="number"
              v-model="timeout"
              name="timeout"
              class="input-text col-2"
              id="txtLDAPTimeout"
            />
            <span class="ml-3 font-weight-medium" id="lblLDAPMinute">Minutes</span>
            <div class="font-weight-medium pt-3" id="lblLDAPLang">Language</div>
            <select name="language" id="cmdLanguage" class="input-text pl-1" style="width: 10em;">
              <option value="English">English</option>
              <option value="English1">English</option>
            </select>
          </v-col>
        </v-row>
      </div>
      <v-btn
        color="csmprimary"
        class="ma-5 elevation-0 white--text"
        @click="createUser()"
        id="btnLDAPCreateUser"
      >Create new user group</v-btn>
      <v-btn
        v-if="isUserCreate"
        text
        small
        color="csmprimary"
        id="lblLDAPCancel"
        @click="createUser()"
      >Cancel</v-btn>
      <v-data-table
        calculate-widths
        :items="alertData"
        :single-expand="singleExpand"
        item-key="name"
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
              class="tableheader font-weight-medium text--black"
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
            <td>{{props.item.name}}</td>
            <td>{{props.item.interfaces}}</td>
            <td>{{props.item.roles}}</td>
            <td>
              <img @click="onExpand(props)" src="./../../../../assets/edit-off.png" />
              <v-divider class="mx-4" light vertical inset></v-divider>
              <img @click="onDelete(props)" src="./../../../../assets/delete-off.png" />
            </td>
          </tr>
        </template>

        <template v-slot:expanded-item="props">
          <tr class="grey lighten-5">
            <td colspan="5">
              <div>
                <v-row>
                  <v-col class="col-4 pl-5">
                    <div class="font-weight-medium pt-3" id="lblLDAPUserName">Username</div>
                    <input
                      class="input-text"
                      type="text"
                      name="hostname"
                      v-model="hostname"
                      id="txtLDAPHostName"
                    />
                    <div class="font-weight-medium pt-3" id="lblLDAPPass">Password</div>
                    <input
                      class="input-text"
                      type="password"
                      name="password"
                      v-model="password"
                      id="txtLDAPPass"
                    />
                    <div class="font-weight-medium pt-3" id="lblLDAPConfirmPass">Confirm password</div>
                    <input
                      class="input-text"
                      type="password"
                      name="confirmPassword"
                      v-model="confirmPassword"
                      id="txtLDAPConfirmPass"
                    />
                  </v-col>
                  <v-col class="col-2">
                    <div class="font-weight-medium pt-3 pb-2">Interfaces</div>
                    <input
                      type="checkbox"
                      @change="web"
                      v-model="web"
                      name="web"
                      id="chkLDAPWebInterface"
                    />
                    <span class="ml-3 font-weight-medium">Web</span>
                    <br />
                    <input
                      type="checkbox"
                      @change="cli"
                      v-model="cli"
                      name="cli"
                      id="chkLDAPCliInterface"
                    />
                    <span class="ml-3 font-weight-medium">CLI</span>
                    <br />
                    <input
                      type="checkbox"
                      @change="api"
                      v-model="api"
                      name="api"
                      id="chkLDAPAPiInterface"
                    />
                    <span class="ml-3 font-weight-medium">API</span>
                  </v-col>
                  <v-col class="col-2">
                    <div class="font-weight-medium pt-3 pb-2">Roles</div>
                    <input
                      type="checkbox"
                      @change="manage"
                      v-model="manage"
                      name="manage"
                      id="chkLDAPManageInterface"
                    />
                    <span class="ml-3 font-weight-medium">Manage</span>
                    <br />
                    <input
                      type="checkbox"
                      @change="monitor"
                      v-model="monitor"
                      name="monitor"
                      id="chkLDAPMonitorInterface"
                    />
                    <span class="ml-3 font-weight-medium">Monitor</span>
                  </v-col>
                  <v-col>
                    <div
                      class="font-weight-medium pt-3"
                      id="lblLDAPTempInetrface"
                    >Teperature preference</div>
                    <select
                      name="temperature"
                      id="cmdTemperature"
                      class="input-text pl-1"
                      style="width: 10em;"
                    >
                      <option value="celsius">Celsius</option>
                      <option value="celsius1">Celsius</option>
                    </select>
                    <div class="font-weight-medium pt-3">Timeout</div>
                    <input
                      type="number"
                      v-model="timeout"
                      name="timeout"
                      class="input-text col-2"
                      id="txtLDAPTimeoutInterface"
                    />
                    <span class="ml-3 font-weight-medium" id="lblLDAPMinuteIneterface">Minutes</span>
                    <div class="font-weight-medium pt-3" id="lblLDAPLangInetrface">Language</div>
                    <select
                      name="language"
                      id="cmdLanguage"
                      class="input-text pl-1"
                      style="width: 10em;"
                    >
                      <option value="English">English</option>
                      <option value="English1">English</option>
                    </select>
                  </v-col>
                </v-row>
              </div>
              <v-btn
                color="csmprimary"
                class="ma-5 elevation-0 white--text"
                @click="editUser()"
                id="btnLDAPApplyInterface"
              >Apply</v-btn>
              <v-btn
                text
                small
                color="csmprimary"
                @click="editUser()"
                id="lblLDAPCancelInterface"
              >Cancel</v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>-->

    <div class="mt-8">
      <p
        v-if="!isValid"
        class="red--text error-message"
      >Please enter valid values.</p>
      <v-btn
        elevation="0"
        color="csmprimary"
        @click="gotToNextPage()"
        id="btnLDAPApplyContinueInterface"
      >
        <span class="white--text">Apply and Continue</span>
      </v-btn>
      <span
        class="csmprimary--text ml-8 pointer"
        @click="gotToPrevPage()"
        id="lblLDAPBackInerface"
      >Back to previous step</span>
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Ldap } from "./../../../../models/system-configuration";

@Component({
  name: "eos-user-setting-ldap"
})
export default class EosUserSettingLdap extends Vue {
  public mounted() {
    const ldapConfiguration = this.$store.getters["systemConfig/userConfigData"];
    console.log("TCL: EosUserSettingLdap -> mounted -> ldapConfiguration", ldapConfiguration)
    if(ldapConfiguration && ldapConfiguration.ldap){
      this.$data.usersearchbase = ldapConfiguration.ldap.user_search_base;
      this.$data.server = ldapConfiguration.ldap.server;
      this.$data.port = ldapConfiguration.ldap.port;
      this.$data.altserver = ldapConfiguration.ldap.alt_server;
      this.$data.altport = ldapConfiguration.ldap.alt_port;
    }
  }
  public gotToNextPage() {
    this.setLDAP().then((res: any) => {
      if (res) {
          this.$router.push("notifications");
        } else {
          this.$data.isValid = false;
        } 
    })
    .catch(() => {
      // tslint:disable-next-line: no-console
      console.error("error");
    });
  }
  public gotToPrevPage() {
    if (this.$store.getters["systemConfig/isLocalUserStatus"] === true) {
      this.$router.push("usersettinglocal");
    } else {
      this.$router.push("usersetting");
    }
  }

  private setLDAP() {
    const queryParams: Ldap = {
      user_search_base: this.$data.usersearchbase,
      server: this.$data.server,
      port: this.$data.port,
      alt_server: this.$data.altserver,
      alt_port: this.$data.altport
    };
    return this.$store
      .dispatch("systemConfig/updateLdapUserConfig", queryParams);
  }

  private data() {
    return {
      usersearchbase: "",
      server: "",
      port: 80,
      altserver: "",
      altport: 80,
      isValid: true
    };
  }

  // private addIpAddressNode0(address: string) {
  //   if (
  //     this.$data.ipaddressNode0.length < 4 &&
  //     address !== "" &&
  //     address !== undefined
  //   ) {
  //     this.$data.ipaddressNode0.push(address);
  //     this.$data.newAddressNode0 = "";
  //   }
  // }
  // private createUser() {
  //   this.$data.isUserCreate = !this.$data.isUserCreate;
  //   return this.$data.isUserCreate;
  // }
  // private editUser() {
  //   this.$data.isUserEdit = !this.$data.isUserEdit;
  //   return this.$data.isUserEdit;
  // }
  // private onDelete(props: any) {
  //   alert("Deleting");
  //   if (props.isExpanded === false) {
  //     props.expand(props.item);
  //   } else {
  //     props.expand(false);
  //   }
  // }
  // private onExpand(props: any) {
  //   if (props.isExpanded === false) {
  //     props.expand(props.item);
  //   } else {
  //     props.expand(false);
  //   }
  // }
  // private data() {
  //   return {
  //     source: "manual",
  //     isUserCreate: false,
  //     page: 1, // Page counter, in sync with data table
  //     singleExpand: false, // Expande single row property
  //     itemsPerPage: 5, // Total rows per page, in sync with data table
  //     isSortActive: false, // Set table column sorting flag to default inactive
  //     sortColumnName: "", // Set sorting column name to none
  //     alertStatus: require("./../../../../common/const-string.json"),
  //     alertHeader: [
  //       {
  //         text: "Username",
  //         value: "username",
  //         sortable: false
  //       },
  //       {
  //         text: "Interfaces",
  //         value: "interfaces",
  //         sortable: false
  //       },
  //       {
  //         text: "Roles",
  //         value: "roles",
  //         sortable: false
  //       }
  //     ],
  //     alertData: [
  //       {
  //         name: "User 1",
  //         interfaces: "Web, CLI, API",
  //         roles: "Manage, Monitor"
  //       },
  //       {
  //         name: "User 2",
  //         interfaces: "Web, CLI, API",
  //         roles: "Manage"
  //       },
  //       {
  //         name: "User 3",
  //         interfaces: "Web, CLI",
  //         roles: "Monitor"
  //       },
  //       {
  //         name: "User 4",
  //         interfaces: "CLI, API",
  //         roles: "Manage, Monitor"
  //       }
  //     ]
  //   };
  // }
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
.tableheader {
  height: 2.5em;
  background-color: #e3e3e3;
  border-top: 1px solid whitesmoke;
  padding-top: 0.5em;
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
tbody tr {
  background-color: #ffffff !important ;
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
