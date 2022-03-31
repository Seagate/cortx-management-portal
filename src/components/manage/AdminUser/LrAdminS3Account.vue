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
      <span class="title-label">S3 configuration</span>
      <SgtTooltipIcon>
        <template #default>
          <div class="i-content">
            <div>
              <p class="section-title">S3 configuration:</p>
              <p class="description">
                Create an S3 account. You must log in to the system using S3
                account credentials to manage S3 account, IAM users, and
                buckets.
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
        </template>
      </SgtTooltipIcon>
    </div>

    <SgtDataTable
      ref="adminS3UserDetailsTable"
      :headers="adminS3UserTableConfig.adminS3UsersTable.headers"
      :records="adminS3UsersData"
      :searchConfig="adminS3UserTableConfig.searchConfig"
      :headerButton="{ name: 'addNewUser', label: 'Add new user' }"
      @edit="editUser"
      @delete="deleteUser"
      @addNewUser="isUserCreate = true"
    />

    <LrAddOrEditS3User
      v-if="isUserEdit || isUserCreate"
      v-model="modelValue"
      @close-popup="isUserEdit ? (isUserEdit = false) : (isUserCreate = false)"
      :userData="userData"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SgtTooltipIcon from "../../../lib/components/SgtTooltipIcon/SgtTooltipIcon.vue";
import { adminS3UserTableConst } from "./LrAdminS3User.constant";
import { IAdminS3UserDetail } from "./LrAdminS3User.model";
import { Api } from "../../../services/Api";
import SgtDataTable from "../../../lib/components/SgtDataTable/SgtDataTable.vue";
import LrAddOrEditS3User from "./LrAddOrEditS3User.vue";

@Component({
  name: "LrAdminS3Account",
  components: {
    SgtTooltipIcon,
    SgtDataTable,
    LrAddOrEditS3User,
  },
})
export default class LrAdminS3Account extends Vue {
  public adminS3UserTableConfig = adminS3UserTableConst;
  public adminS3UsersData = [];
  public isUserCreate = false;
  public isUserEdit = false;
  public dataToEdit = {};
  public isShowPromptDialog = false;
  public dataToDelete = {};

  public async mounted() {
    const res: any = await Api.getData("manage/admin-s3-users", {
      isDummy: true,
    });
    this.adminS3UsersData = res.data;
  }

  get modelValue() {
    return this.isUserEdit ? this.isUserEdit : this.isUserCreate;
  }

  get userData() {
    return this.isUserEdit ? this.dataToEdit : false;
  }

  public editUser(userInfo: IAdminS3UserDetail) {
    this.dataToEdit = userInfo;
    this.isUserEdit = true;
  }

  private promptDialogClosed(confirmation: string) {
    this.isShowPromptDialog = false;
    if (confirmation === "yes") {
      // API call to delete the record
    }
    this.dataToDelete = {};
  }

  public deleteUser(userInfo: IAdminS3UserDetail) {
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
