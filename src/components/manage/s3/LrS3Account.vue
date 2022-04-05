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
    <div>Account Name</div>
    <v-card max-width="40%" style="margin: 2rem 0">
      <v-row>
        <v-col cols="2" class="user-avatar">
          <v-avatar class="profile" size="96" v-if="s3AccountDetails">
            <v-img :src="require(`@/assets/images/storage-buckets.svg`)" />
          </v-avatar>
        </v-col>
        <v-col class="user-info">
          <div>Account: {{ s3AccountDetails.account_name }}</div>
          <div>Email: {{ s3AccountDetails.account_email }}</div>
        </v-col>
        <v-col cols="1" style="margin-right: 1rem">
          <SgtSvgIcon icon="edit-green.svg" @click="showUserDialog = true" tooltip="Reset Password" />
        </v-col>
      </v-row>
    </v-card>

    <LrS3UserForm
      :showDialog.sync="showUserDialog"
      formType="edit"
      @formData="userForm($event)"
    />
    <LrS3Access />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Api } from "@/services/Api";
import SgtSvgIcon from "@/lib/components/SgtSvgIcon/SgtSvgIcon.vue";
import LrS3Access from "./LrS3Access.vue";
import LrS3UserForm from "./LrS3UserForm.vue";

@Component({
  name: "LrS3Account",
  components: { SgtSvgIcon, LrS3Access, LrS3UserForm },
})
export default class LrS3Account extends Vue {
  s3AccountDetails = {};
  showUserDialog = false;

  mounted() {
    Api.getData("s3/s3_accounts", { isDummy: true }).then((resp: any) => {
      this.s3AccountDetails = resp["s3_accounts"][0];
    });
  }

  userForm(data: any) {
    //code to save changes
    this.showUserDialog = false;
  }
}
</script>
<style lang="scss" scoped>
.user-avatar {
  margin-left: 1rem;
}
.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 1rem;
}
</style>