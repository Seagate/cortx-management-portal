<template>
  <v-container class="mt-6 body-2">
    <div>
      <div class="title mt-6 ml-3">
        S3 Configuration - Create S3 Account
        <v-icon class="green--text" size="20">mdi-help-circle-outline</v-icon>
      </div>
    </div>
    <div class="mt-5 ml-3">
      <span class="font-weight-regular">Use this screen to create s3 account .</span>
    </div>
    <v-card class="col-10 pb-5 mt-10 elevation-0" outlined tile>
      <div v-if="isUserCreate">
        <v-row>
          <v-col class="pl-5">
            <div class="font-weight-medium pt-3">LDAP User Name</div>
            <input class="input-text" type="text" name="hostname" v-model="hostname" />
            <div class="font-weight-medium pt-3">LDAP Password</div>
            <input class="input-text" type="password" name="password" v-model="password" />
          </v-col>
          <v-col>
            <div class="font-weight-medium pt-3">S3 Account Name</div>
            <input class="input-text" type="text" name="hostname" v-model="hostname" />
            <div class="font-weight-medium pt-3">EmailID</div>
            <input class="input-text" type="password" name="password" v-model="password" />
          </v-col>
        </v-row>
      </div>

      <v-btn v-if="!isUserCreate" color="green" class="my-5 elevation-0">
        <span class="white--text" @click="createUser()">Add New User</span>
      </v-btn>
      <v-dialog v-model="dialog" persistent max-width="790">
        <template v-slot:activator="{ on }">
          <v-btn v-if="isUserCreate" v-on="on" color="green" class="my-5 elevation-0">
            <span class="white--text">Create User</span>
          </v-btn>
        </template>
        <v-card>
          <v-system-bar color="greay lighten-3">
            <v-spacer></v-spacer>
            <v-icon>mdi-close</v-icon>
          </v-system-bar>
          <v-card-title class="title mt-6 ml-3">
            <img class="mr-2" src="./../../assets/status/healthy-icon.png" />
            <span>Account Created: Access Key and Secret</span>
          </v-card-title>
          <v-divider />
          <v-row class="mx-4">
            <v-col cols="8">
              <span>Save this information, you will not see it again.</span>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="2" class="green--text">
              <span>export csv</span>
            </v-col>
          </v-row>

          <table class=" ml-7 mb-7">
            <tr style>
              <th style="width:15rem;height:6rem;text-align: left">Account name</th>
              <th style="width:24.2rem;text-align: left">Access key</th>
              <th style="width:5rem;text-align: left">Secret</th>
            </tr>
            <tr>
              <td style="width:15rem;height:2rem;text-align: left">AccountName1</td>
              <td>3f33rfdfer3443r34f3435f3333tg</td>
              <td>*************</td>
            </tr>
          </table>

          <v-card-actions>
              <v-btn color="green" @click="dialog = false" class="ma-5 elevation-0">
                <span class="white--text">OK</span>
              </v-btn>
           
          </v-card-actions>
        </v-card>
      </v-dialog>
      <span v-if="isUserCreate" class="green--text ml-5" @click="createUser()">Cancel</span>
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
                  src="./../../assets/table-caret-green-down.png"
                />
                <img
                  v-if="header.sortable && header.sortDir === alertStatus.asc"
                  src="./../../assets/table-caret-green-up.png"
                />
              </span>
            </th>
            <th class="tableheader" />
          </tr>
        </template>

        <template v-slot:item="props">
          <tr class="font-weight-small">
            <td @click="onExpand(props)">
              <img v-if="props.isExpanded" src="./../../assets/caret-green-down.png" />
              <img v-if="!props.isExpanded" src="./../../assets/caret-green-right.png" />
            </td>
            <td>{{props.item.accountName}}</td>
            <td>{{props.item.canonicalId}}</td>
            <td>{{props.item.email}}</td>
            <td>
              <img @click="onExpand(props)" src="./../../assets/edit-off.png" />
              <v-divider class="mx-4" light vertical inset></v-divider>
              <img @click="onDelete(props)" src="./../../assets/delete-off.png" />
            </td>
          </tr>
        </template>

        <template v-slot:expanded-item="props">
          <tr class="grey lighten-5">
            <td colspan="5">
              <div>
                <v-row>
                  <v-col class="pl-5">
                    <div class="font-weight-medium pt-3">Account name</div>
                    <input class="input-text" type="text" name="hostname" v-model="hostname" />
                    <div class="font-weight-medium pt-3">EmailID</div>
                    <input class="input-text" type="password" name="password" v-model="password" />
                  </v-col>
                  <v-col>
                    <div class="font-weight-medium pt-3">Password</div>
                    <input class="input-text" type="password" name="hostname" v-model="hostname" />
                    <div class="font-weight-medium pt-3">Confirm Password</div>
                    <input class="input-text" type="password" name="password" v-model="password" />
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
    <div class="mt-8 ml-3">
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
  name: "eos-account-management"
})
export default class EosAccountManagement extends Vue {
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
      dialog: false,
      source: "manual",
      isUserCreate: false,
      page: 1, // Page counter, in sync with data table
      singleExpand: false, // Expande single row property
      itemsPerPage: 5, // Total rows per page, in sync with data table
      isSortActive: false, // Set table column sorting flag to default inactive
      sortColumnName: "", // Set sorting column name to none
      alertStatus: require("./../../common/const-string.json"),
      alertHeader: [
        {
          text: "AccountName",
          value: "username",
          sortable: false
        },
        {
          text: "CanonicalId",
          value: "CanonicalId",
          sortable: false
        },
        {
          text: "Email",
          value: "Email",
          sortable: false
        }
      ],
      alertData: [
        {
          accountName: "S3User1",
          canonicalId: "CPi-221",
          email: "abcd@seagate.com"
        },
        {
          accountName: "S3User2",
          canonicalId: "CPi-222",
          email: "abcd@seagate.com"
        },
        {
          accountName: "S3User3",
          canonicalId: "Cpi-223",
          email: "abcd@seagate.com"
        },
        {
          accountName: "S3User4",
          canonicalId: "cpi-224",
          email: "abcd@seagate.com"
        }
      ]
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
tr {
  border-style: solid !important;
  border-width: 1px !important;
  border-color: #e3e3e3 !important;
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
