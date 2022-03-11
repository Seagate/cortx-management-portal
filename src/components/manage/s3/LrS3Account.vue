<!--
* CORTX-CSM: CORTX Management web.
* Copyright (c) 2020 Seagate Technology LLC and/or its Affiliates
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
      <v-card max-width="40%"  style="margin:2rem 0">
        <v-row>
          <v-col cols="2" class="user-avatar">
            <v-avatar class="profile" size="96" v-if="s3AccountDetails">
              <v-img :src="require(`@/assets/images/storage-buckets.svg`)" />
            </v-avatar>
          </v-col>
          <v-col class="user-info">
            <div>Account: {{s3AccountDetails.account_name}}</div>
            <div>Email: {{s3AccountDetails.account_email}}</div>
          </v-col>
        </v-row>
      </v-card>
    <LrDataTable
      ref="alertDataTable"
      :headers="s3AccountConst.s3AccountTable.headers"
      :records="accessList"
      :searchConfig="s3AccountConst.searchConfig"
      :isMultiSelect="s3AccountConst.s3AccountTable.isMultiSelect"
      :chips="chips"
      :itemKey="s3AccountConst.s3AccountTable.itemKey"
      @filter-click="filterData($event)"
    ></LrDataTable>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import LrDataTable from "../../shared/LrDataTable/LrDataTable.vue";
import { lrS3AccountConst } from "./LrS3.constant";
import { Api } from "@/services/Api";

@Component({
	name: "LrS3Account",
	components: { LrDataTable },
})
export default class LrS3Account extends Vue {
	s3AccountConst: any = JSON.parse(JSON.stringify(lrS3AccountConst));
	s3AccountDetails = {};
	accessList = [];
	chips = [];
	selectedRecord: any = null;
	mounted() {
		Api.getData("s3/s3_accounts", { isDummy: true }).then((resp: any) => {
			this.s3AccountDetails = resp["s3_accounts"][0];
		});
		Api.getData("s3/access_keys", { isDummy: true }).then((resp: any) => {
			this.accessList = resp["access_keys"].map((ele: any) => {
				return { ...ele, secretKey: "XXXX" };
			});
		});
	}

	filterData(filterList: any) {
		this.chips = filterList;
	}
}
</script>
<style lang="scss" scoped>
.user-avatar {
    margin-left: 1rem;
}
.user-info{
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 1rem;
}
</style>