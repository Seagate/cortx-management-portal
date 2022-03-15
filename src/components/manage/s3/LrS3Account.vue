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
    <v-card max-width="40%" style="margin:2rem 0">
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
        <v-col cols="1" style="margin-right:1rem">
          <LrSvgIcon icon="edit-green.svg" @click="editDetails" />
        </v-col>
      </v-row>
    </v-card>
    <LrDataTable
      ref="lrS3AccountDataTable"
      :headers="s3AccountConst.s3AccountTable.headers"
      :records="accessList"
      :isMultiSelect="s3AccountConst.s3AccountTable.isMultiSelect"
      :itemKey="s3AccountConst.s3AccountTable.itemKey"
      :isPagination="false"
      :headerButton="s3AccountConst.s3AccountTable.headerButton"
      @generate="generateNewKey"
    ></LrDataTable>
    <v-dialog v-model="passwordDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <div class="title-container">
            Reset Password
            <LrSvgIcon icon="close-green.svg" @click="passwordDialog = false" class="close-btn" />
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <div class="content-container">
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <label for="password">New Password *</label>
                  <v-text-field
                    name="password"
                    ref="password"
                    v-model="passwordForm.password"
                    outlined
                    :rules="passwordRules"
                    validate-on-blur
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <label for="confirmPassword">Confirm Password *</label>
                  <v-text-field
                    name="confirmPassword"
                    ref="confirmPassword"
                    v-model="passwordForm.confirmPassword"
                    :rules="confirmPasswordRules"
                    outlined
                    validate-on-blur
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="csmprimary" @click="passwordDialog = false" outlined>cancel</v-btn>
          <v-btn color="csmprimary" @click="resetPassword()" dark>Reset</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="generatedAccessKeyDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <div class="title-container">
            <LrSvgIcon icon="green-tick.svg" />Access key created
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <div class="content-container">
            <v-container>
              <v-row>
                <div>Save this information, you will not see it again. Download as CSV and close.</div>
                <div>Access Key : {{newAccessKey.access_key_id}}</div>
                <div>Secret Key : {{newAccessKey.secret_key}}</div>
                <div>Note : {{newAccessKey.note}}</div>
              </v-row>
            </v-container>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="csmprimary" @click="downloadKey()" dark>download & close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LrDataTable from "../../shared/LrDataTable/LrDataTable.vue";
import { lrS3AccountConst } from "./LrS3.constant";
import { Api } from "@/services/Api";
import LrSvgIcon from "@/components/shared/LrSvgIcon/LrSvgIcon.vue";
import { passwordTest } from "@/utils/CommonUtilFunctions";
@Component({
	name: "LrS3Account",
	components: { LrDataTable, LrSvgIcon },
})
export default class LrS3Account extends Vue {
	s3AccountConst: any = JSON.parse(JSON.stringify(lrS3AccountConst));
	s3AccountDetails = {};
	accessList = [];
	selectedRecord: any = null;
	passwordDialog = false;
	passwordForm = {
		password: "",
		confirmPassword: "",
	};
	newAccessKey = {};
	generatedAccessKeyDialog = false;
	mounted() {
		Api.getData("s3/s3_accounts", { isDummy: true }).then((resp: any) => {
			this.s3AccountDetails = resp["s3_accounts"][0];
		});
		Api.getData("s3/access_keys", { isDummy: true }).then((resp: any) => {
			this.accessList = resp["access_keys"];
			if (this.accessList.length > 1) {
				this.s3AccountConst.s3AccountTable.headerButton["disabled"] = true;
				this.s3AccountConst.s3AccountTable.headers[
					this.s3AccountConst.s3AccountTable.headers.length - 1
				]["actionList"] = ["delete"];
			} else {
				this.s3AccountConst.s3AccountTable.headerButton["disabled"] = false;
				this.s3AccountConst.s3AccountTable.headers[
					this.s3AccountConst.s3AccountTable.headers.length - 1
				]["actionList"] = [];
			}
		});
	}

	get passwordRules() {
		return [
			(value: any) => !!value || "Required.",
			(value: any) =>
				(value && passwordTest(value)) || "Please enter a valid password",
		];
	}
	get confirmPasswordRules() {
		return [
			(value: any) => !!value || "Required.",
			(value: any) =>
				(value && value == this.passwordForm.password) ||
				"Confirm password mismatch ",
		];
	}

	editDetails() {
		//
		this.passwordDialog = true;
	}

	resetPassword() {
		if (
			this.testValidation("password") &&
			this.testValidation("confirmPassword")
		) {
			//code for password change api call
			this.resetForm("password");
			this.resetForm("confirmPassword");
			this.passwordDialog = false;
		}
	}

	testValidation(name: string) {
		const field = this.$refs[name] as Vue & {
			validate: (flag: boolean) => boolean;
		};
		if (!field) return false;
		return field.validate(true);
	}

	resetForm(name: string) {
		const field = this.$refs[name] as Vue & { reset: () => void };
		field.reset();
	}

	generateNewKey() {
		//code to generate key
		Api.getData("s3/generate_access_keys", { isDummy: true }).then(
			(resp: any) => {
				this.newAccessKey = resp;
				this.generatedAccessKeyDialog = true;
			}
		);
	}

	downloadKey() {
		//code to download
		this.generatedAccessKeyDialog = false;
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

.title-container {
	width: 100%;
	.close-btn {
		cursor: pointer;
		float: right;
	}
}
.content-container {
	margin-top: 1rem;
}
</style>