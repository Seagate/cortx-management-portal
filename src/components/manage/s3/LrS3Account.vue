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
          <SgtSvgIcon icon="edit-green.svg" @click="editDetails" />
        </v-col>
      </v-row>
    </v-card>
    <SgtDataTable
      ref="lrS3AccountDataTable"
      :headers="s3AccountConst.s3AccountTable.headers"
      :records="accessList"
      :isMultiSelect="s3AccountConst.s3AccountTable.isMultiSelect"
      :itemKey="s3AccountConst.s3AccountTable.itemKey"
      :isPagination="false"
      :headerButton="s3AccountConst.s3AccountTable.headerButton"
      @generate="generateNewKey"
      @delete="deleteKey($event)"
    >
      <template v-slot:status="{ data }">
        <v-switch
          v-model="data.status"
          value="active"
          color="csmprimary"
          inset
          @change="updateAccessKeyStatus(data.rowIdx)"
        ></v-switch>
      </template>
    </SgtDataTable>
    <v-dialog v-model="passwordDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <div class="title-container">
            Reset Password
            <SgtSvgIcon
              icon="close-green.svg"
              @click="passwordDialog = false"
              class="close-btn"
            />
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
          <v-btn color="csmprimary" @click="passwordDialog = false" outlined
            >cancel</v-btn
          >
          <v-btn color="csmprimary" @click="resetPassword()" dark>Reset</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="generatedAccessKeyDialog" max-width="800px" persistent>
      <v-card>
        <v-card-title>
          <div class="title-container">
            <SgtSvgIcon icon="green-tick.svg" class="title-icon" />
            <div class="title-content">Access key created</div>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <div class="content-container">
            <v-container>
              <v-row class="content-title">
                <v-col>
                  <v-icon class="content-title-icon" color="csmwarning"
                    >mdi-alert-circle-outline</v-icon
                  >Save this information, you will not see it again. Download as
                  CSV and close.
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="3">
                  <b>Access Key :</b>
                </v-col>
                <v-col>{{ newAccessKey.access_key_id }}</v-col>
              </v-row>
              <v-row>
                <v-col cols="3">
                  <b>Secret Key :</b>
                </v-col>
                <v-col>{{ newAccessKey.secret_key }}</v-col>
              </v-row>
              <v-row>
                <v-col cols="3">
                  <b>Note :</b>
                </v-col>
                <v-col
                  >This deployment is not configured with Virtual IP. Please
                  check documentation to get IP Address of public data
                  interface</v-col
                >
              </v-row>
            </v-container>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <v-btn color="csmprimary" @click="downloadKey()" dark
            >Save & close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SgtDataTable from "@/lib/components/SgtDataTable/SgtDataTable.vue";
import { lrS3AccountConst } from "./LrS3.constant";
import { Api } from "@/services/Api";
import SgtSvgIcon from "@/lib/components/SgtSvgIcon/SgtSvgIcon.vue";
import { passwordTest } from "@/lib/services/CommonUtilFunctions";
import SgtModal from "@/lib/components/SgtModal/SgtModal.vue";
import { create } from "vue-modal-dialogs";
@Component({
  name: "LrS3Account",
  components: { SgtDataTable, SgtSvgIcon, SgtModal },
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
  deleteModal = create(SgtModal);

  mounted() {
    Api.getData("s3/s3_accounts", { isDummy: true }).then((resp: any) => {
      this.s3AccountDetails = resp["s3_accounts"][0];
    });
    this.getAccessKeys();
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

  getAccessKeys() {
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
    const headerNames = Object.keys(this.newAccessKey).join(",") + "\n";
    const values = Object.entries(this.newAccessKey)
      .map(([k, v]: [string, any]) => {
        return v.replaceAll(/,/g, " ");
      })
      .join(",");
    const csv = headerNames + values;
    const anchor = document.createElement("a");
    anchor.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    anchor.target = "_blank";
    anchor.download = "credentials.csv";
    anchor.click();
    this.getAccessKeys();
    this.generatedAccessKeyDialog = false;
  }

  async deleteKey(row: any) {
    const result = await this.deleteModal({
      modalTitle: "Confirmation",
      modalContent: `Are you sure you want to delete ${row.access_key_id} ?`,
      modalType: "prompt",
    }).then((resp) => {
      //code to delete
      console.log(resp)
      });
  }

  updateAccessKeyStatus() {
    //code to update
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
  .title-content {
    display: inline-block;
  }
  .title-icon {
    vertical-align: top;
    padding-right: 0.5rem;
  }
}
.content-container {
  margin-top: 1rem;
  .content-title {
    color: $warning;
    font-size: 1rem;
    .content-title-icon {
      padding-right: 0.5rem;
    }
  }
}
</style>