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
    <div class="title-container mt-3">
      <span class="title-label">User Settings</span>
      <SgtTooltipIcon>
        <template #default>
          <div class="i-content">
            <div>
              <p class="section-title">User Settings: Local</p>
              <p class="description">
                Manage users. Depending on the user role, you can create,
                modify, and delete users. You can also change the password for
                the admin user. A role is a collection of permissions granted to
                a user.
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
      ref="adminUserDetailsTable"
      :headers="adminUserTableConfig.adminUsersTable.headers"
      :records="adminUsersData"
      :searchConfig="adminUserTableConfig.searchConfig"
      :headerButton="{ name: 'addNewUser', label: 'Add new user' }"
      @edit="editUser"
      @delete="deleteUser"
      @addNewUser="isUserCreate = true"
    />

    <LrAddOrEditUser
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
import { adminUserTableConst } from "./LrAdminUser.constant";
import { IUserDetail } from "./LrAdminUser.model";
import { Api } from "../../../services/Api";
import SgtDataTable from "../../../lib/components/SgtDataTable/SgtDataTable.vue";
import LrAddOrEditUser from "./LrAddOrEditUser.vue";
import SgtDialog from "@/lib/components/SgtDialog/SgtDialog.vue";
import { SgtDialogModel } from "@/lib/components/SgtDialog/SgtDialog.model";
import { create } from "vue-modal-dialogs";

@Component({
  name: "LrAdminUser",
  components: {
    SgtTooltipIcon,
    SgtDataTable,
    LrAddOrEditUser,
  },
})
export default class LrAdminUser extends Vue {
  public adminUserTableConfig = adminUserTableConst;
  public adminUsersData = [];
  public isUserCreate = false;
  public isUserEdit = false;
  public dataToEdit = {};
  public deleteModal = create<SgtDialogModel>(SgtDialog);

  public async mounted() {
    const res: any = await Api.getData("manage/admin-users", {
      isDummy: true,
    });
    this.adminUsersData = res.data;
  }

  get modelValue() {
    return this.isUserEdit ? this.isUserEdit : this.isUserCreate;
  }

  get userData() {
    return this.isUserEdit ? this.dataToEdit : false;
  }

  public editUser(userInfo: IUserDetail) {
    this.dataToEdit = userInfo;
    this.isUserEdit = true;
  }

  async deleteUser(userInfo: IUserDetail) {
    const result = await this.deleteModal({
      modalTitle: "Confirmation",
      modalContent: `Are you sure you want to delete the user <b>${userInfo.username}</b> ?`,
      modalType: "prompt",
      modalContentType: "html",
    }).then((resp) => {
      //code to delete
      console.log(resp);
    });
  }
}
</script>

<style lang="scss" scoped>
.title-container {
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
