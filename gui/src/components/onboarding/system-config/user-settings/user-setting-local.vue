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
      <div class="title mt-6">
        User Settings: Local
        <v-icon class="green--text" size="20">mdi-help-circle-outline</v-icon>
      </div>
    </div>
    <div class="mt-5">
      <span
        class="font-weight-regular"
      >Use the steps below to configure your system. Not all of this information is required, but it is strongly recommended. After setup, you can adjust these settings using the lazy dog button.</span>
    </div>
    <v-card class="col-10 pb-5 mt-10 elevation-0" outlined tile>
      <div v-if="isUserCreate">
        <v-row>
          <v-col class="pl-5">
            <div class="font-weight-medium pt-3">User Name</div>
            <input class="input-text" type="text" name="hostname" v-model="hostname" />
            <div class="font-weight-medium pt-3">Password</div>
            <input class="input-text" type="password" name="password" v-model="password" />
            <div class="font-weight-medium pt-3">Confirm Password</div>
            <input
              class="input-text"
              type="password"
              name="confirmPassword"
              v-model="confirmPassword"
            />
          </v-col>
          <v-col>
            <div class="font-weight-medium pt-3 pb-2">Interfaces</div>
            <input type="checkbox" @change="web" v-model="web" name="web" />
            <span class="ml-3 font-weight-medium">Web</span>
            <br />
            <input type="checkbox" @change="cli" v-model="cli" name="cli" />
            <span class="ml-3 font-weight-medium">CLI</span>
            <br />
            <input type="checkbox" @change="api" v-model="api" name="api" />
            <span class="ml-3 font-weight-medium">API</span>
          </v-col>
          <v-col>
            <div class="font-weight-medium pt-3 pb-2">Roles</div>
            <input type="checkbox" @change="manage" v-model="manage" name="manage" />
            <span class="ml-3 font-weight-medium">Manage</span>
            <br />
            <input type="checkbox" @change="monitor" v-model="monitor" name="monitor" />
            <span class="ml-3 font-weight-medium">Monitor</span>
          </v-col>
          <v-col>
            <div class="font-weight-medium pt-3">Teperature preference</div>
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
            <input type="number" v-model="timeout" name="timeout" class="input-text col-2" />
            <span class="ml-3 font-weight-medium">Minutes</span>
            <div class="font-weight-medium pt-3">Language</div>
            <select name="language" id="cmdLanguage" class="input-text pl-1" style="width: 10em;">
              <option value="English">English</option>
              <option value="English1">English</option>
            </select>
          </v-col>
        </v-row>
      </div>
      <v-btn color="green" class="ma-5 elevation-0">
        <span v-if="!isUserCreate" class="white--text" @click="createUser()">Add New User</span>
        <span v-if="isUserCreate" class="white--text" @click="createUser()">Create User</span>
      </v-btn>
      <span v-if="isUserCreate" class="green--text" @click="createUser()">Cancel</span>
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
                  <v-col class="pl-5">
                    <div class="font-weight-medium pt-3">User Name</div>
                    <input class="input-text" type="text" name="hostname" v-model="hostname" />
                    <div class="font-weight-medium pt-3">Password</div>
                    <input class="input-text" type="password" name="password" v-model="password" />
                    <div class="font-weight-medium pt-3">Confirm Password</div>
                    <input
                      class="input-text"
                      type="password"
                      name="confirmPassword"
                      v-model="confirmPassword"
                    />
                  </v-col>
                  <v-col>
                    <div class="font-weight-medium pt-3 pb-2">Interfaces</div>
                    <input type="checkbox" @change="web" v-model="web" name="web" />
                    <span class="ml-3 font-weight-medium">Web</span>
                    <br />
                    <input type="checkbox" @change="cli" v-model="cli" name="cli" />
                    <span class="ml-3 font-weight-medium">CLI</span>
                    <br />
                    <input type="checkbox" @change="api" v-model="api" name="api" />
                    <span class="ml-3 font-weight-medium">API</span>
                  </v-col>
                  <v-col>
                    <div class="font-weight-medium pt-3 pb-2">Roles</div>
                    <input type="checkbox" @change="manage" v-model="manage" name="manage" />
                    <span class="ml-3 font-weight-medium">Manage</span>
                    <br />
                    <input type="checkbox" @change="monitor" v-model="monitor" name="monitor" />
                    <span class="ml-3 font-weight-medium">Monitor</span>
                  </v-col>
                  <v-col>
                    <div class="font-weight-medium pt-3">Teperature preference</div>
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
                    <input type="number" v-model="timeout" name="timeout" class="input-text col-2" />
                    <span class="ml-3 font-weight-medium">Minutes</span>
                    <div class="font-weight-medium pt-3">Language</div>
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
              <v-btn color="green" class="ma-5 elevation-0">
                <span class="white--text" @click="editUser()">Apply</span>
              </v-btn>
              <span class="green--text" @click="editUser()">Cancel</span>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <div class="mt-8">
      <v-btn elevation="0" color="green">
        <span class="white--text" @click="gotToNextPage()">Apply and Continue</span>
      </v-btn>
      <span class="green--text ml-8 pointer" @click="gotToPrevPage()">Back to previous step</span>
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

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
  private createUser() {
    this.$data.isUserCreate = !this.$data.isUserCreate;
    return this.$data.isUserCreate;
  }
  private editUser() {
    this.$data.isUserEdit = !this.$data.isUserEdit;
    return this.$data.isUserEdit;
  }
  private onExpand(props: any) {
    if (props.isExpanded === false) {
      props.expand(props.item);
    } else {
      props.expand(false);
    }
  }
  private onDelete(props: any) {
    alert("Deleting");
    if (props.isExpanded === false) {
      props.expand(props.item);
    } else {
      props.expand(false);
    }
  }
  private data() {
    return {
      source: "manual",
      isUserCreate: false,
      page: 1, // Page counter, in sync with data table
      singleExpand: false, // Expande single row property
      itemsPerPage: 5, // Total rows per page, in sync with data table
      isSortActive: false, // Set table column sorting flag to default inactive
      sortColumnName: "", // Set sorting column name to none
      alertStatus: require("./../../../../common/const-string.json"),
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
      alertData: [
        {
          name: "User 1",
          interfaces: "Web, CLI, API",
          roles: "Manage, Monitor"
        },
        {
          name: "User 2",
          interfaces: "Web, CLI, API",
          roles: "Manage"
        },
        {
          name: "User 3",
          interfaces: "Web, CLI",
          roles: "Monitor"
        },
        {
          name: "User 4",
          interfaces: "CLI, API",
          roles: "Manage, Monitor"
        }
      ]
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
