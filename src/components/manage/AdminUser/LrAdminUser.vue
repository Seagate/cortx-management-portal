<!--
* CORTX-CSM: CORTX Management web.
* Copyright (c) 2022 Seagate Technology LLC and/or its Affiliates
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
* please email opensource@seagate.com.
-->
<template>
  <div>
    <div class="title-container">
      <span class="title-label">User Settings</span>
      <SgtIButton>
        <div class="i-content">
          <div>
            <p class="section-title">User Settings: Local</p>
            <p class="description">
              Manage users. Depending on the user role, you can create, modify,
              and delete users. You can also change the password for the admin
              user. A role is a collection of permissions granted to a user.
            </p>
          </div>
          <div>
            <p class="section-title">Note:</p>
            <p class="description">
              Only admin user can create and delete users and change the
              password of the admin user.
            </p>
          </div>
        </div>
      </SgtIButton>
    </div>
    <LrDataTable
      ref="adminUserDetailsTable"
      :headers="adminUserTableConfig.adminUsersTable.headers"
      :records="adminUsersData"
      :searchConfig="adminUserTableConfig.searchConfig"
      :headerButton="{ name: 'addNewUser', label: 'Add new user' }"
      @edit="editUser"
      @delete="deleteUser"
      @addNewUser="isUserCreate = true"
    />
    <AddNewUser v-model="isUserCreate" @close-popup="isUserCreate = false" />
    <EditExistingUser
      v-model="isUserEdit"
      @close-popup="isUserEdit = false"
      :userData="dataToEdit"
    />
    <SgtPromptDialog
      v-model="isShowPromptDialog"
      title="Confirmation"
      message="Are you sure you want to delete?"
      @close="promptDialogClosed($event)"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SgtIButton from "../../shared/SgtIButton.vue";
import { adminUserTableConst, IUserDetail } from "./AdminUserDetails.constant";
import { Api } from "../../../services/Api";
import LrDataTable from "../../shared/LrDataTable/LrDataTable.vue";
import AddNewUser from "./AddNewUser.vue";
import EditExistingUser from "./EditExistingUser.vue";
import SgtPromptDialog from "../../shared/SgtPromptDialog.vue";

@Component({
  name: "LrAdminUser",
  components: {
    SgtIButton,
    LrDataTable,
    AddNewUser,
    EditExistingUser,
    SgtPromptDialog,
  },
})
export default class LrAdminUser extends Vue {
  public adminUserTableConfig = adminUserTableConst;
  public adminUsersData = [];
  public isUserCreate = false;
  public isUserEdit = false;
  public dataToEdit = {};
  public isShowPromptDialog = false;
  public dataToDelete = {};

  public async mounted() {
    const res: any = await Api.getData("manage/admin-users", {
      isDummy: true,
    });
    this.adminUsersData = res.data;
  }

  public editUser(userInfo: IUserDetail) {
    this.dataToEdit = userInfo;
    this.isUserEdit = true;
  }

  private promptDialogClosed(confirmation: string) {
    debugger;
    this.isShowPromptDialog = false;
    if (confirmation === "yes") {
      // API call to delete the record
    }
    this.dataToDelete = {};
  }

  public deleteUser(userInfo: IUserDetail) {
    //Make an API call to delete the user from the table
    this.dataToDelete = userInfo;
    this.isShowPromptDialog = true;
  }
}
</script>

<style lang="scss" scoped>
.title-container {
  margin: 1em 0;
  display: flex;
  align-items: center;
  gap: 5px;

  .title-label {
    font-weight: bold;
  }
}

.i-content {
  display: flex;
  flex-direction: column;
  gap: 15px;

  p {
    margin: 0;
  }
  .section-title {
    font-weight: bold;
  }
}
</style>
