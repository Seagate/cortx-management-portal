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
    <SgtDataTable
      ref="lrIAMUserDataTable"
      :headers="iAMUserConfig.s3IAMUserTable.headers"
      :records="userList"
      :isMultiSelect="iAMUserConfig.s3IAMUserTable.isMultiSelect"
      :itemKey="iAMUserConfig.s3IAMUserTable.itemKey"
      :headerButton="iAMUserConfig.s3IAMUserTable.headerButton"
      :searchConfig="iAMUserConfig.searchConfig"
      :tableDataConfig="iAMUserConfig.tableConfig"
      :chips="chips"
      @create="createUser"
      @edit="editUser($event)"
      @delete="deleteUser($event)"
      @update-record="updateRecord($event)"
    >
    </SgtDataTable>
    <LrS3UserForm
      :showDialog.sync="showUserDialog"
      :formType="formType"
      @formData="userForm($event)"
    />
    <LrS3Access class="access-section" />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SgtDataTable from "@/lib/components/SgtDataTable/SgtDataTable.vue";
import { IAMUserConst } from "./LrS3.constant";
import { Api } from "@/services/Api";
import LrS3Access from "./LrS3Access.vue";
import LrS3UserForm from "./LrS3UserForm.vue";
import { SgtDataTableFilterSortPag } from "@/lib/components/SgtDataTable/SgtDataTableFilterSortPag.model";
import { SgtFilterObject } from "@/lib/components/SgtChips/SgtFilterObject.model";
import SgtDialog from "@/lib/components/SgtDialog/SgtDialog.vue";
import { SgtDialogModel } from "@/lib/components/SgtDialog/SgtDialog.model";
import { create } from "vue-modal-dialogs";

@Component({
  name: "LrIAMUser",
  components: { SgtDataTable, LrS3Access, LrS3UserForm },
})
export default class LrIAMUser extends Vue {
  iAMUserConfig: any = JSON.parse(JSON.stringify(IAMUserConst));

  userList = [];
  showUserDialog = false;
  formType = "create";
  chips: SgtFilterObject[] = [];
  deleteModal = create<SgtDialogModel>(SgtDialog);

  mounted() {
    this.getAccessKeys();
  }

  updateRecord(tableDataConfig: SgtDataTableFilterSortPag) {
    // code for API call
    this.chips = tableDataConfig.filterList;
  }
  getAccessKeys() {
    Api.getData("s3/iAMUser", { isDummy: true }).then((resp: any) => {
      this.userList = resp["user"];
    });
  }

  createUser() {
    this.formType = "create";
    this.showUserDialog = true;
  }

  editUser(row: any) {
    this.formType = "edit";
    this.showUserDialog = true;
  }

  async deleteUser(row: any) {
    const result = await this.deleteModal({
      modalTitle: "Confirmation",
      modalContent: `Are you sure you want to delete <b>${row.user_name}</b> ?`,
      modalType: "prompt",
      modalContentType: "html",
    }).then((resp) => {
      //code to delete
      console.log(resp);
    });
  }

  userForm(data: any) {
    if (this.formType === "create") {
      // code to create user
    } else {
      // code to update password
    }
    this.showUserDialog = false;
  }
}
</script>
<style lang="scss" scoped>
.access-section {
  margin-top: 2rem;
}
</style>