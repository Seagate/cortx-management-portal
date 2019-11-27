<template>
  <div>
    <Loader :show="showLoader" :message="loaderMessage" />

    <div style="width: 100%">
      <div v-if="showCreateUserForm">
        <v-row>
          <v-col class="pl-5">
            <div class="pt-3">
              <InputBox :form="createUserForm" :control="createUserForm.controls[0]" />
            </div>
            <div class="pt-3">
              <InputBox :form="createUserForm" :control="createUserForm.controls[1]" />
            </div>
          </v-col>
          <v-col>
            <div class="pt-3">
              <InputBox :form="createUserForm" :control="createUserForm.controls[2]" />
            </div>
            <div class="pt-3">
              <InputBox
                :form="createUserForm"
                :control="createUserForm.controls[3]"
                :compareWithControl="createUserForm.controls[2]"
              />
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn
              v-if="showCreateUserForm"
              color="green"
              class="mx-2"
              @click="createUser()"
              :disabled="!createUserForm.isValid"
            >
              <span class="white--text">Create User</span>
            </v-btn>
            <v-btn
              v-if="showCreateUserForm"
              outlined
              color="success"
              class="ml-5"
              @click="closeCreateUserForm()"
            >
              <span style="text-transform: none !important;">Cancel</span>
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <v-btn
        v-if="!showCreateUserForm"
        color="green"
        class="my-5 elevation-0"
        @click="openCreateUserForm()"
      >
        <span class="white--text">Create User</span>
      </v-btn>

      <v-dialog v-model="showUserDetailsDialog" persistent max-width="790">
        <v-card>
          <v-system-bar color="greay lighten-3">
            <v-spacer></v-spacer>
            <v-icon @click="closeUserDetailsDialog()" style="cursor: pointer;">mdi-close</v-icon>
          </v-system-bar>
          <v-card-title class="title mt-6 ml-3">
            <img class="mr-2" src="./../../assets/status/healthy-icon.png" />
            <span>User Created: Access Key and Secret</span>
          </v-card-title>
          <v-divider />
          <v-row class="mx-4">
            <v-col cols="8">
              <span>Save this information, you will not see it again.</span>
            </v-col>
            <v-spacer></v-spacer>
            <!--v-col cols="2" class="green--text">
              <span>export csv</span>
            </v-col-->
          </v-row>

          <table class="ml-7 mb-7">
            <tr style>
              <th style="width:15rem;height:6rem;text-align: left">Username</th>
              <th style="width:24.2rem;text-align: left">User Id</th>
              <th style="width:5rem;text-align: left">ARN</th>
            </tr>
            <tr>
              <td style="width:15rem;height:2rem;text-align: left">{{ user.user_name }}</td>
              <td>{{ user.user_id }}</td>
              <td>{{ user.arn }}</td>
            </tr>
          </table>

          <v-card-actions>
            <v-btn color="green" @click="closeUserDetailsDialog()" class="ma-5 elevation-0">
              <span class="white--text">OK</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="showConfirmDeleteDialog" persistent max-width="790">
        <v-card>
          <v-system-bar color="greay lighten-3">
            <v-spacer></v-spacer>
            <v-icon @click="closeConfirmDeleteDialog('no')" style="cursor: pointer;">mdi-close</v-icon>
          </v-system-bar>
          <v-card-title class="title ml-3">
            <img class="mr-2" src="./../../assets/status/warning.png" />
            <span>Confirmation</span>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <label
              class="ml-3 delete-user-confirmation-msg"
            >Are you sure you want to delete the user?</label>
          </v-card-text>

          <v-card-actions>
            <v-btn color="green" @click="closeConfirmDeleteDialog('yes')" class="ma-5 elevation-0">
              <span class="white--text">Yes</span>
            </v-btn>
            <v-btn
              color="green"
              outlined
              @click="closeConfirmDeleteDialog('no')"
              class="ma-5 elevation-0"
            >
              <span style="text-transform: none;">No</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-data-table
        calculate-widths
        :items="usersList"
        item-key="user_name"
        class="eos-table"
        :hide-default-header="true"
        :hide-default-footer="true"
      >
        <template v-slot:header="{props}">
          <tr>
            <th
              v-for="header in usersTableHeaderList"
              :key="header.text"
              class="tableheader text-capitalize font-weight-medium text--black"
            >
              <span class="headerText">{{ header.text }}</span>
            </th>
            <th class="tableheader" />
          </tr>
        </template>

        <template v-slot:item="props">
          <tr class="font-weight-small">
            <td>{{props.item.user_name}}</td>
            <td>{{props.item.user_id}}</td>
            <td>{{props.item.arn}}</td>
            <td>{{props.item.path}}</td>
            <td>
              <img
                @click="openConfirmDeleteDialog(props.item.user_name)"
                style="cursor: pointer;"
                src="./../../assets/delete-off.png"
              />
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { IAMUser } from "../../models/s3";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import Loader from "../widgets/loader.vue";
import InputBox from "../widgets/input-box.vue";
import { Form, FormControl, Validator } from "../widgets/form-widget";

@Component({
  name: "eos-iam-user-management",
  components: { Loader, InputBox }
})
export default class EosIAMUserManagement extends Vue {
  private showCreateUserForm: boolean;
  private showLoader: boolean;
  private loaderMessage: string;
  private showUserDetailsDialog: boolean;
  private showConfirmDeleteDialog: boolean;

  private usersTableHeaderList: any[];
  private usersList: IAMUser[] = [];
  private user: IAMUser;
  private userToDelete: string = "";

  private createUserForm: Form;

  constructor() {
    super();
    this.showCreateUserForm = false;
    this.showLoader = false;
    this.loaderMessage = "";
    this.showUserDetailsDialog = false;
    this.showConfirmDeleteDialog = false;
    this.usersTableHeaderList = [
      {
        text: "Username",
        value: "user_name",
        sortable: false
      },
      {
        text: "User Id",
        value: "user_id",
        sortable: false
      },
      {
        text: "ARN",
        value: "arn",
        sortable: false
      },
      {
        text: "Path",
        value: "path",
        sortable: false
      }
    ];

    this.user = new IAMUser();

    const controls: FormControl[] = [
      new FormControl(
        "Username",
        "user_name",
        "text",
        "",
        true,
        "Username is required",
        new Validator(/^[a-zA-Z0-9_-]{1,64}$/, "Invalid Username"),
        "Username can contain alphabets, numbers and can have _ or - but no spaces and should be less than 64 characters"
      ),
      new FormControl(
        "Path",
        "path",
        "text",
        "/",
        true,
        "Path is required",
        new Validator(
          new RegExp("^(/[^/ ]*)+/?$"),
          "Invalid Path"
        )
      ),
      new FormControl(
        "Password",
        "password",
        "password",
        "",
        true,
        "Password is required",
        new Validator(
          /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\(\)\_\+\-\=\[\]\{\}\|\'])[A-Za-z\d!@#\$%\^&\*\(\)\_\+\-\=\[\]\{\}\|\']{8,}/,
          "Invalid Password"
        ),
        "Password should be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
      ),
      new FormControl(
        "Confirm Password",
        "confirm_password",
        "password",
        "",
        true,
        "Confirm above Password"
      )
    ];
    this.createUserForm = new Form(controls, false);
  }

  public mounted() {
    this.getAllUsers();
  }

  public async getAllUsers() {
    this.showLoader = true;
    this.loaderMessage = "Fetching All IAM Users...";
    const res: any = await Api.getAll(apiRegister.s3_iam_user);
    this.usersList = res.data.iam_users;
    this.showLoader = false;
    this.loaderMessage = "";
  }

  public async createUser() {
    this.showLoader = true;
    this.loaderMessage = "Creating User...";
    const tempUser = this.createUserForm.getModel();
    tempUser.require_reset = true;
    delete tempUser.confirm_password;
    const res: any = await Api.post(apiRegister.s3_iam_user, tempUser);
    this.user = res.data;
    this.showLoader = false;
    this.loaderMessage = "";
    this.showUserDetailsDialog = true;
  }

  public closeUserDetailsDialog() {
    this.clearCreateUserForm();
    this.showUserDetailsDialog = false;
    this.showCreateUserForm = false;
    this.getAllUsers();
  }

  public openCreateUserForm() {
    this.showCreateUserForm = true;
  }

  public closeCreateUserForm() {
    this.clearCreateUserForm();
    this.showCreateUserForm = false;
  }

  public clearCreateUserForm() {
    this.user = new IAMUser();
    this.createUserForm.isValid = false;
    this.createUserForm.controls.forEach((control) => {
      control.value = "";
      control.isDirty = false;
      control.isValid = false;
    });
  }

  public async deleteUser() {
    this.showLoader = true;
    this.loaderMessage = "Deleting User " + this.userToDelete;
    this.userToDelete = encodeURI(this.userToDelete);
    await Api.delete(apiRegister.s3_iam_user, this.userToDelete);
    this.showLoader = false;
    this.loaderMessage = "";
    this.getAllUsers();
  }

  public openConfirmDeleteDialog(username: string) {
    this.userToDelete = username;
    this.showConfirmDeleteDialog = true;
  }

  public async closeConfirmDeleteDialog(confirmation: string) {
    this.showConfirmDeleteDialog = false;
    if (confirmation === "yes") {
      this.deleteUser();
    }
    this.userToDelete = "";
  }
}
</script>
<style lang="scss" scoped>
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
.delete-user-confirmation-msg {
  color: #000;
  font-size: 16px;
}
</style>
