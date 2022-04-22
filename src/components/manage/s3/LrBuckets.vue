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
      ref="lrIAmUserDataTable"
      :headers="bucketTableConfig.headers"
      :records="userList"
      :isMultiSelect="bucketTableConfig.isMultiSelect"
      :itemKey="bucketTableConfig.itemKey"
      :headerButton="bucketTableConfig.headerButton"
      @create="create"
      @edit="edit($event)"
      @delete="deleteBucket($event)"
      @update-record="updateRecord($event)"
    ></SgtDataTable>
    <v-dialog :value="showBucketDialog" max-width="800px" persistent>
      <v-card>
        <v-card-title>
          <div class="title-container">
            <b
              >{{
                formType === "create"
                  ? "Add New Bucket"
                  : "Bucket - " + bucketForm.name
              }}
            </b>
            <SgtSvgIcon
              icon="close-green.svg"
              tooltip="Close"
              @click="closeForm"
              class="close-btn"
            />
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <div class="content-container">
            <v-form ref="form" v-model="formValid">
              <v-row v-if="formType === 'create'">
                <v-col cols="12" sm="6">
                  <label for="name" class="sgt-form-group-label"
                    >Bucket Name *
                    <SgtTooltipIcon>
                      <template>
                        <div class="i-content">
                          <p>
                            Bucket names must be between 3 (min) and 63 (max)
                            characters long.
                          </p>
                          <p>
                            Names can consist only of lowercase letters,
                            numbers, dots (.), and hyphens (-).
                          </p>
                          <p>
                            Bucket names must begin and end with a letter or
                            number.
                          </p>
                        </div>
                      </template>
                    </SgtTooltipIcon>
                  </label>
                  <v-text-field
                    name="name"
                    ref="name"
                    v-model="bucketForm.name"
                    outlined
                    :rules="nameRules"
                    validate-on-blur
                    type="text"
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>
              <h2 v-else class="pb-2">Bucket Policy</h2>
              <v-row>
                <v-col cols="12" sm="12">
                  <label for="jsonPolicy" class="sgt-form-group-label">{{
                    `Type to add new bucket policy ${
                      formType == "edit" ? "or edit an existing policy" : ""
                    } in the text area below.`
                  }}</label>
                  <v-textarea
                    auto-grow
                    name="jsonPolicy"
                    ref="jsonPolicy"
                    v-model="bucketForm.jsonPolicy"
                    outlined
                    :rules="jsonPolicyRules"
                    validate-on-blur
                    dense
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-form>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="button-container">
          <v-btn
            class="mr-2"
            color="primary"
            v-if="formType == 'create'"
            @click="createBucket"
            dark
          >
            Create bucket
          </v-btn>
          <v-btn
            class="mr-2"
            color="primary"
            v-if="formType == 'edit'"
            @click="updatePolicy"
            dark
            >Update
          </v-btn>
          <v-btn
            class="mr-2"
            color="csmdisabled"
            v-if="formType == 'edit'"
            @click="deleteBucket"
            depressed
            dark
            >Delete</v-btn
          >
          <v-btn color="csmdisabled" @click="closeForm" depressed dark
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SgtDataTable from "@/lib/components/SgtDataTable/SgtDataTable.vue";
import { LrBucketConst } from "./LrS3.constant";
import { Api } from "@/services/Api";
import { SgtDataTableFilterSortPag } from "@/lib/components/SgtDataTable/SgtDataTableFilterSortPag.model";
import { jsonTest, usernameTest } from "@/utils/CommonUtilFunctions";
import SgtSvgIcon from "@/lib/components/SgtSvgIcon/SgtSvgIcon.vue";
import SgtDialog from "@/lib/components/SgtDialog/SgtDialog.vue";
import { SgtDialogModel } from "@/lib/components/SgtDialog/SgtDialog.model";
import { create } from "vue-modal-dialogs";
import SgtTooltipIcon from "@/lib/components/SgtTooltipIcon/SgtTooltipIcon.vue";

@Component({
  name: "LrBuckets",
  components: { SgtDataTable, SgtSvgIcon, SgtTooltipIcon },
})
export default class LrBuckets extends Vue {
  bucketTableConfig: any = JSON.parse(
    JSON.stringify(LrBucketConst.bucketTable)
  );
  userList = [];
  showBucketDialog = false;
  formType = "create";
  bucketForm = {
    name: "",
    jsonPolicy: "",
  };
  formValid = false;
  deleteModal = create<SgtDialogModel>(SgtDialog);

  mounted() {
    this.getAccessKeys();
  }
  get jsonPolicyRules() {
    return [
      (value: any) => (value && jsonTest(value)) || "Please enter a valid Json",
    ];
  }
  get nameRules() {
    return [
      (value: any) => !!value || "Required.",
      (value: string) =>
        (value && value.length >= 3 && value.length <= 63) ||
        "Bucket names must be between 3 (min) and 63 (max) characters long.",
      (value: any) =>
        (value && usernameTest(value, "^[ a-z0-9.-]*$")) ||
        "Names can consist only of lowercase letters, numbers, dots (.), and hyphens (-).",
      (value: string) =>
        (value && usernameTest(value, "^[a-z0-9].*[a-z0-9]$")) ||
        "Bucket names must begin and end with a letter or number.",
    ];
  }
  updateRecord(tableDataConfig: SgtDataTableFilterSortPag) {
    // code for API call
  }
  getAccessKeys() {
    Api.getData("s3/buckets", { isDummy: true }).then((resp: any) => {
      this.userList = resp["buckets"];
    });
  }
  create() {
    this.formType = "create";
    this.showBucketDialog = true;
  }
  edit(row: any) {
    //get json policy from server
    this.formType = "edit";
    this.bucketForm.name = row.name;
    this.showBucketDialog = true;
  }

  async deleteBucket(row: any) {
    const result = await this.deleteModal({
      modalTitle: "Confirmation",
      modalContent: `Are you sure you want to delete <b>${row.name}</b> ?`,
      modalType: "prompt",
      modalContentType: "html",
    }).then((resp) => {
      //code to delete
      console.log(resp);
    });
  }

  createBucket(data: any) {
    this.validateForm();
    if (this.formValid) {
      //code to create
      this.closeForm();
    }
  }
  updatePolicy() {
    this.validateForm();
    if (this.formValid) {
      //code to update policy
      this.closeForm();
    }
  }
  deletePolicy() {
    //code to delete policy
  }
  validateForm() {
    (this.$refs.form as Vue & { validate: () => boolean }).validate();
  }
  closeForm() {
    this.bucketForm.name = "";
    (this.$refs.form as Vue & { reset: () => boolean }).reset();
    this.showBucketDialog = false;
  }
}
</script>
<style lang="scss" scoped>
.title-container {
  width: 100%;
  .close-btn {
    cursor: pointer;
    float: right;
  }
  .title-content {
    display: inline-block;
  }
}
.button-container {
  padding: 1.2rem 1.5rem !important;
}
.content-container {
  margin-top: 1rem;
}
</style>