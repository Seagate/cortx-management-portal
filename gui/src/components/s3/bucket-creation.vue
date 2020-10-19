/*
* CORTX-CSM: CORTX Management web and CLI interface.
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
* please email opensource@seagate.com or cortx-questions@seagate.com.
*/
<template>
  <div class="body-2">
    <v-row>
      <v-col class="py-0 pr-0 col-9">
        <cortx-has-access
          :to="$cortxUserPermissions.s3buckets + $cortxUserPermissions.list"
        >
          <v-data-table
            calculate-widths
            :items="bucketsList"
            item-key="name"
            class="cortx-table"
            id="bucket-datatable"
            :hide-default-header="true"
            :hide-default-footer="true"
            :disable-pagination="true"
          >
            <template v-slot:header="{}">
              <tr id="bucket-tableheading">
                <th
                  v-for="header in bucketsTableHeaderList"
                  :key="header.text"
                  class="tableheader"
                  id="table-name"
                >
                  <span>{{ header.text }}</span>
                </th>
              </tr>
            </template>

            <template v-slot:item="props">
              <tr :id="props.item.name">
                <td id="bucket-name">
                  {{ props.item.name }}
                  <v-tooltip right max-width="300" v-if="props.item.bucket_url">
                    <template v-slot:activator="{ on }">
                      <img
                        :id="`copy-bucket-url-${props.item.name}`"
                        v-on:click="copyBucketUrl(props.item.bucket_url)"
                        v-on="on"
                        class="cortx-cursor-pointer copy-url"
                        src="@/assets/actions/copy-text.svg"
                      />
                    </template>
                    <span id="copy-tooltip"
                      >{{ props.item.bucket_url }}<br />{{
                        $t("s3.account.copy-tooltip")
                      }}</span
                    >
                  </v-tooltip>
                </td>
                <td>
                  <img
                    id="bucket-edit-icon"
                    @click="openBucketPolicyDialog(props.item.name)"
                    class="cortx-cursor-pointer"
                    src="@/assets/actions/edit-green.svg"
                  />
                  <img
                    id="bucket-delete-icon"
                    @click="openConfirmDeleteDialog(props.item.name)"
                    class="cortx-cursor-pointer ml-5"
                    src="@/assets/actions/delete-green.svg"
                  />
                </td>
              </tr>
            </template>
          </v-data-table>
        </cortx-has-access>
      </v-col>
      <v-col class="py-0 col-3">
        <div v-if="showCreateBucketForm" class="pa-2">
          <v-row>
            <v-col class="pr-0 pb-0">
              <div
                class="cortx-form-group-custom"
                :class="{
                  'cortx-form-group--error':
                    $v.createBucketForm.bucket.bucket_name.$error
                }"
              >
                <label
                  class="cortx-form-group-label"
                  for="bucketName"
                  id="bucket-namelbl"
                >
                  <cortx-info-tooltip
                    label="Bucket name*"
                    :message="bucketNameTooltipMessage"
                  />
                </label>
                <input
                  class="cortx-form__input_text"
                  type="text"
                  id="bucketName"
                  name="bucketName"
                  v-model.trim="createBucketForm.bucket.bucket_name"
                  @input="$v.createBucketForm.bucket.bucket_name.$touch"
                />
                <div class="cortx-form-group-label cortx-form-group-error-msg">
                  <label
                    id="bucket-name-required"
                    v-if="
                      $v.createBucketForm.bucket.bucket_name.$dirty &&
                        !$v.createBucketForm.bucket.bucket_name.required
                    "
                    >{{ $t("s3.bucket.name-require") }}</label
                  >
                  <label
                    id="bucket-name-invalid"
                    v-else-if="
                      $v.createBucketForm.bucket.bucket_name.$dirty &&
                        !$v.createBucketForm.bucket.bucket_name.bucketNameRegex
                    "
                    >{{ $t("s3.bucket.invalid-name") }}</label
                  >
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <button
                id="bucket-create-btn"
                type="button"
                class="cortx-btn-primary"
                @click="createBucket()"
                :disabled="$v.createBucketForm.$invalid"
              >
                {{ $t("s3.bucket.create-bucket") }}
              </button>
              <button
                id="bucket-cancel-btn"
                type="button"
                class="cortx-btn-tertiary"
                @click="closeCreateBucketForm()"
              >
                {{ $t("common.cancel-btn") }}
              </button>
            </v-col>
          </v-row>
        </div>
        <cortx-has-access
          :to="$cortxUserPermissions.s3buckets + $cortxUserPermissions.create"
        >
          <button
            id="bucket-addbucket-formbtn"
            type="button"
            class="mt-4 cortx-btn-primary"
            v-if="!showCreateBucketForm"
            @click="openCreateBucketForm()"
          >
            {{ $t("common.create-btn") }}
          </button>
        </cortx-has-access>
      </v-col>
    </v-row>

    <v-dialog
      id="bucket-create-succeaadialogbox"
      v-model="showBucketCreateSuccessDialog"
      persistent
      max-width="700"
    >
      <v-card>
        <v-system-bar color="grey lighten-3">
          <v-spacer></v-spacer>
          <v-icon
            id="bucket-closedialogbox"
            @click="closeBucketCreateSuccessDialog()"
            style="cursor: pointer;"
            >mdi-close</v-icon
          >
        </v-system-bar>
        <v-card-title class="title mt-5">
          <img class="mr-2" :src="require('@/assets/resolved-default.svg')" />
          <span id="bucket-created-success-mgs">{{
            $t("s3.bucket.created-successfully")
          }}</span>
          <table class="mt-2 ml-9 cortx-text-md">
            <tr id="bucket-url-tr">
              <td id="bucket-url-td-label" class="py-2 cortx-text-bold bucket-url-label">
                {{ $t("s3.bucket.url-label") }}
              </td>
              <td id="bucket-url-td-value" class="py-2 bucket-url-text">{{ bucketUrl }}</td>
            </tr>
          </table>
        </v-card-title>
        <v-card-actions>
          <button
            id="bucket-closedialodbox"
            type="button"
            class="ma-5 cortx-btn-primary"
            @click="closeBucketCreateSuccessDialog()"
          >
            {{ $t("common.ok-text") }}
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div
      class="cortx-modal-container"
      v-if="showBucketPolicyDialog"
      id="bucket-policy"
    >
      <div class="cortx-modal bucket-policy-editor">
        <div class="cortx-modal-header">
          <label id="bucket-json-policy-lbl">{{
            $t("s3.bucket.json-policy")
          }}</label>
          <img
            id="close-bucket-policydialog"
            class="cortx-modal-close"
            :src="require('@/assets/close-green.svg')"
            @click="closeBucketPolicyDialog()"
          />
        </div>
        <div class="cortx-modal-body">
          <div
            class="cortx-form-group cortx-form-group-custom"
            :class="{
              'cortx-form-group--error': $v.policyJSON.$error
            }"
          >
            <label
              class="cortx-form-group-label"
              for="policyJSONTextarea"
              id="bucket-policy-text"
            >
              {{ $t("s3.bucket.policy-info") }}
            </label>
            <textarea
              class="cortx-form__input_textarea cortx-form__input_textarea-custom"
              name="policyJSONTextarea"
              id="policyJSONTextarea"
              rows="10"
              v-model="policyJSON"
              @input="$v.policyJSON.$touch"
            ></textarea>
            <div class="cortx-form-group-label cortx-form-group-error-msg">
              <label
                id="policy-required-msg"
                v-if="$v.policyJSON.$dirty && !$v.policyJSON.required"
                >{{ $t("s3.bucket.json-policy") }}</label
              >
              <label
                id="policy-jsonerror"
                v-else-if="$v.policyJSON.$dirty && !$v.policyJSON.JSONValidator"
                >{{ JSONError }}</label
              >
            </div>
          </div>
          <div class="mt-3 policy-container">
            <button
              id="update-bucketpolicy"
              type="button"
              class="cortx-btn-primary"
              :disabled="!$v.policyJSON.JSONValidator"
              @click="updateBucketPolicy()"
            >
              {{ $t("common.update-btn") }}
            </button>
            <button
              id="delete-bucket-policy"
              type="button"
              class="cortx-btn-primary ml-2"
              :disabled="!$v.policyJSON.JSONValidator || noBucketPolicy"
              @click="deleteBucketPolicy()"
            >
              {{ $t("common.delete-btn") }}
            </button>
            <button
              id="cancel-bucket-policy"
              type="button"
              class="cortx-btn-tertiary"
              @click="closeBucketPolicyDialog()"
            >
              {{ $t("common.cancel-btn") }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <cortx-confirmation-dialog
      id="bucket-confirmation-dialog"
      :show="showConfirmDeleteDialog"
      title="Confirmation"
      :message="confirmMsg"
      severity="warning"
      @closeDialog="closeConfirmDeleteDialog"
      cancelButtonText="No"
    ></cortx-confirmation-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Validations } from "vuelidate-property-decorators";
import { required, helpers, minLength } from "vuelidate/lib/validators";
import { Bucket } from "../../models/s3";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import i18n from "../../i18n";

import {
  bucketNameRegex,
  bucketNameTooltipMessage
} from "./../../common/regex-helpers";
import CommonUtils from "../../common/common-utils";

@Component({
  name: "cortx-bucket-creation"
})
export default class CortxBucketCreation extends Vue {
  public createBucketForm = {
    bucket: {} as Bucket
  };
  public confirmMsg: string = "";
  @Validations()
  public validations = {
    createBucketForm: {
      bucket: {
        bucket_name: { required, bucketNameRegex }
      }
    },
    policyJSON: {
      required,
      JSONValidator: (value: any, $data: any) => {
        let isValid = false;
        try {
          JSON.parse(value);
          $data.JSONError = "";
          isValid = true;
        } catch (e) {
          $data.JSONError = e.message;
        }
        return isValid;
      }
    }
  };

  private jsonValidationMessage: any = "" || null;
  private showCreateBucketForm: boolean;
  private showBucketCreateSuccessDialog: boolean;
  private showConfirmDeleteDialog: boolean;
  private showBucketPolicyDialog: boolean;
  private bucketsTableHeaderList: any[];
  private bucketsList: Bucket[] = [];
  private bucketToDelete: string = "";
  private policyJSON: any = "";
  private bucketName: any = "";
  private bucketNameTooltipMessage: string = bucketNameTooltipMessage;
  private bucketUrl = "";
  private noBucketPolicy: boolean;

  constructor() {
    super();
    this.jsonValidationMessage = "";
    this.bucketName = "";
    this.showCreateBucketForm = false;
    this.showBucketCreateSuccessDialog = false;
    this.showConfirmDeleteDialog = false;
    this.showBucketPolicyDialog = false;
    this.bucketsTableHeaderList = [
      {
        text: "Name",
        value: "name",
        sortable: false
      },
      { 
        text: "Action", 
        value: "data-table-expand" 
      }
    ];
  }

  public data() {
    return {
      JSONError: ""
    };
  }

  public async mounted() {
    await this.getAllBuckets();
  }

  public async getAllBuckets() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      i18n.t("s3.bucket.fetching-bucket")
    );
    const res: any = await Api.getAll(apiRegister.s3_bucket);
    this.bucketsList = res && res.data ? res.data.buckets : [];

    this.$store.dispatch("systemConfig/hideLoader");
  }

  public async createBucket() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      i18n.t("s3.bucket.creating-bucket")
    );
    const res = await Api.post(
      apiRegister.s3_bucket,
      this.createBucketForm.bucket
    );
    this.bucketUrl = res && res.data.bucket_url ? res.data.bucket_url : "NA";
    if (!res.error) {
      this.showBucketCreateSuccessDialog = true;
    }
    this.$store.dispatch("systemConfig/hideLoader");
  }

  public async closeBucketCreateSuccessDialog() {
    this.clearCreateBucketForm();
    this.showBucketCreateSuccessDialog = false;
    this.showCreateBucketForm = false;
    await this.getAllBuckets();
  }

  public openCreateBucketForm() {
    this.showCreateBucketForm = true;
  }

  public closeCreateBucketForm() {
    this.clearCreateBucketForm();
    this.showCreateBucketForm = false;
  }

  public clearCreateBucketForm() {
    this.createBucketForm = {
      bucket: {} as Bucket
    };
    if (this.$v.createBucketForm) {
      this.$v.createBucketForm.$reset();
    }
  }

  public openConfirmDeleteDialog(bucketName: string) {
    this.confirmMsg = `${i18n.t("s3.bucket.delete-confirm-msg")} ${bucketName}?`;
    this.bucketToDelete = bucketName;
    this.showConfirmDeleteDialog = true;
  }
  /**
   *
   * get bucket policy
   */
  public async openBucketPolicyDialog(bucketname: any) {
    this.bucketName = bucketname;
    this.$store.dispatch(
      "systemConfig/showLoader",
      i18n.t("s3.bucket.fetching-policy")
    );
    try {
      const res: any = await Api.getAll(
        apiRegister.bucket_policy + "/" + bucketname
      );
      this.policyJSON = JSON.stringify(res.data, null, 4);
    } catch (error) {
      this.policyJSON = "";
      this.noBucketPolicy = true;
    }
    this.$store.dispatch("systemConfig/hideLoader");
    this.showBucketPolicyDialog = true;
  }

  public async closeConfirmDeleteDialog(confirmation: boolean) {
    this.showConfirmDeleteDialog = false;
    if (confirmation) {
      await this.deleteBucket();
    }
    this.bucketToDelete = "";
  }
  public closeBucketPolicyDialog() {
    this.showBucketPolicyDialog = false;
    this.policyJSON = "";
    if (this.$v.policyJSON) {
      this.$v.policyJSON.$reset();
    }
  }
  public async updateBucketPolicy() {
    const policy = JSON.parse(this.policyJSON);
    this.showBucketPolicyDialog = false;
    this.$store.dispatch(
      "systemConfig/showLoader",
      i18n.t("s3.bucket.updating-policy")
    );
    await Api.put(apiRegister.bucket_policy, policy, this.bucketName);
    this.policyJSON = "";
    this.$store.dispatch("systemConfig/hideLoader");
  }
  public async deleteBucketPolicy() {
    this.showBucketPolicyDialog = false;
    this.$store.dispatch(
      "systemConfig/showLoader",
      i18n.t("s3.bucket.delete-policy")
    );
    await Api.delete(apiRegister.bucket_policy, this.bucketName);
    this.$store.dispatch("systemConfig/hideLoader");
  }
  private async deleteBucket() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      i18n.t("s3.bucket.delete-bucket") + this.bucketToDelete
    );
    await Api.delete(apiRegister.s3_bucket, this.bucketToDelete);
    this.$store.dispatch("systemConfig/hideLoader");
    await this.getAllBuckets();
  }
  private async copyBucketUrl(url: string) {
    CommonUtils.copyUrlToClipboard(url);
  }
}
</script>
<style lang="scss" scoped>
.delete-bucket-confirmation-msg {
  color: #000;
  font-size: 16px;
}
.textarea-text {
  border-style: solid;
  border-width: 1px;
}
.policy-container {
  display: flex;
  margin-top: 10px;
}
.bucket-policy-editor {
  width: 600px;
}
.bucket-url-label {
  width: 6rem;
}
.bucket-url-text {
  word-break: break-all;
}
</style>