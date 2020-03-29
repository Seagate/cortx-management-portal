<template>
  <div>
    <div v-if="showCreateBucketForm" class="pa-2">
      <v-row>
        <v-col class="py-0 pr-0">
          <div
            class="eos-form-group"
            :class="{
              'eos-form-group--error':
                $v.createBucketForm.bucket.bucket_name.$error
            }"
          >
            <label class="eos-form-group-label" for="bucketName">
              <eos-info-tooltip
                label="Bucket name*"
                :message="accountNameTooltipMessage"
              />
            </label>
            <input
              class="eos-form__input_text"
              type="text"
              id="bucketName"
              name="bucketName"
              v-model.trim="createBucketForm.bucket.bucket_name"
              @input="$v.createBucketForm.bucket.bucket_name.$touch"
            />
            <div class="eos-form-group-label eos-form-group-error-msg">
              <label
                v-if="
                  $v.createBucketForm.bucket.bucket_name.$dirty &&
                    !$v.createBucketForm.bucket.bucket_name.required
                "
                >Bucket name is required</label
              >
              <label
                v-else-if="
                  $v.createBucketForm.bucket.bucket_name.$dirty &&
                    !$v.createBucketForm.bucket.bucket_name.accountNameRegex
                "
                >Invalid bucket name</label
              >
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <button
            type="button"
            class="eos-btn-primary"
            @click="createBucket()"
            :disabled="$v.createBucketForm.$invalid"
          >
            Create bucket
          </button>
          <button
            type="button"
            class="eos-btn-tertiary"
            @click="closeCreateBucketForm()"
          >
            Cancel
          </button>
        </v-col>
      </v-row>
    </div>
    <eos-has-access
      :to="$eosUserPermissions.s3buckets + $eosUserPermissions.create"
    >
      <button
        type="button"
        class="mt-2 mb-2 eos-btn-primary"
        v-if="!showCreateBucketForm"
        @click="openCreateBucketForm()"
      >
        Create
      </button>
    </eos-has-access>
    <v-dialog
      v-model="showBucketCreateSuccessDialog"
      persistent
      max-width="790"
    >
      <v-card>
        <v-system-bar color="grey lighten-3">
          <v-spacer></v-spacer>
          <v-icon
            @click="closeBucketCreateSuccessDialog()"
            style="cursor: pointer;"
            >mdi-close</v-icon
          >
        </v-system-bar>
        <v-card-title class="title mt-6 ml-3">
          <img class="mr-2" :src="require('@/assets/resolved-default.svg')" />
          <span>Bucket created successfully.</span>
        </v-card-title>
        <v-card-actions>
          <button
            type="button"
            class="ma-5 eos-btn-primary"
            @click="closeBucketCreateSuccessDialog()"
          >
            Okay
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="eos-modal-container" v-if="showBucketPolicyDialog">
      <div class="eos-modal">
        <div class="eos-modal-header">
          <label>JSON policy</label>
          <img
            class="eos-modal-close"
            :src="require('@/assets/close-green.svg')"
            @click="closeBucketPolicyDialog()"
          />
        </div>
        <div class="eos-modal-body">
          <div
            class="eos-form-group eos-form-group-custom"
            :class="{
              'eos-form-group--error': $v.policyJSON.$error
            }"
          >
            <label class="eos-form-group-label" for="policyJSONTextarea">
              Add your JSON here
            </label>
            <textarea
              class="eos-form__input_textarea eos-form__input_textarea-custom"
              name="policyJSONTextarea"
              id="policyJSONTextarea"
              rows="10"
              v-model="policyJSON"
              @input="$v.policyJSON.$touch"
            ></textarea>
            <div class="eos-form-group-label eos-form-group-error-msg">
              <label v-if="$v.policyJSON.$dirty && !$v.policyJSON.required"
                >Policy JSON is required</label
              >
              <label
                v-else-if="$v.policyJSON.$dirty && !$v.policyJSON.JSONValidator"
                >{{ JSONError }}</label
              >
            </div>
          </div>
          <div class="mt-3 policy-container">
            <button
              type="button"
              class="eos-btn-primary"
              :disabled="!$v.policyJSON.JSONValidator"
              @click="updateBucketPolicy()"
            >
              Update
            </button>
            <button
              type="button"
              class="eos-btn-primary ml-2"
              :disabled="!$v.policyJSON.JSONValidator"
              @click="deleteBucketPolicy()"
            >
              Delete
            </button>
            <button
              type="button"
              class="eos-btn-tertiary"
              @click="closeBucketPolicyDialog()"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
    <eos-has-access
      :to="$eosUserPermissions.s3buckets + $eosUserPermissions.list"
    >
      <v-data-table
        calculate-widths
        :items="bucketsList"
        item-key="name"
        class="eos-table"
        :hide-default-header="true"
        :hide-default-footer="true"
        :disable-pagination="true"
      >
        <template v-slot:header="{}">
          <tr>
            <th
              v-for="header in bucketsTableHeaderList"
              :key="header.text"
              class="tableheader"
            >
              <span>{{ header.text }}</span>
            </th>
            <th class="tableheader" />
          </tr>
        </template>

        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.name }}</td>
            <td>
              <img
                @click="openBucketPolicyDialog(props.item.name)"
                class="eos-cursor-pointer"
                src="@/assets/actions/edit-green.svg"
              />
              <img
                @click="openConfirmDeleteDialog(props.item.name)"
                class="eos-cursor-pointer ml-5"
                src="@/assets/actions/delete-green.svg"
              />
            </td>
          </tr>
        </template>
      </v-data-table>
    </eos-has-access>

    <eos-confirmation-dialog
      :show="showConfirmDeleteDialog"
      title="Confirmation"
      message="Are you sure you want to delete the bucket?"
      severity="warning"
      @closeDialog="closeConfirmDeleteDialog"
      cancelButtonText="No"
    ></eos-confirmation-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Validations } from "vuelidate-property-decorators";
import { required, helpers, minLength } from "vuelidate/lib/validators";
import { Bucket } from "../../models/s3";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";

import {
  accountNameRegex,
  accountNameTooltipMessage
} from "./../../common/regex-helpers";

@Component({
  name: "eos-bucket-creation"
})
export default class EosBucketCreation extends Vue {
  public createBucketForm = {
    bucket: {} as Bucket
  };
  @Validations()
  public validations = {
    createBucketForm: {
      bucket: {
        bucket_name: { required, accountNameRegex }
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
  private accountNameTooltipMessage: string = accountNameTooltipMessage;

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
    this.$store.dispatch("systemConfig/showLoader", "Fetching all buckets...");
    const res: any = await Api.getAll(apiRegister.s3_bucket);
    this.bucketsList = res && res.data ? res.data.buckets : [];
    this.$store.dispatch("systemConfig/hideLoader");
  }

  public async createBucket() {
    this.$store.dispatch("systemConfig/showLoader", "Creating bucket...");
    const res = await Api.post(
      apiRegister.s3_bucket,
      this.createBucketForm.bucket
    );
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
      "Fetching bucket policy..."
    );
    try {
      const res: any = await Api.getAll(
        apiRegister.bucket_policy + "/" + bucketname
      );
      this.policyJSON = JSON.stringify(res.data, null, 4);
    } catch (error) {
      this.policyJSON = "";
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
      "Updating bucket policy..."
    );
    await Api.put(apiRegister.bucket_policy, policy, this.bucketName);
    this.policyJSON = "";
    this.$store.dispatch("systemConfig/hideLoader");
  }
  public async deleteBucketPolicy() {
    this.showBucketPolicyDialog = false;
    this.$store.dispatch("systemConfig/showLoader", "Delete bucket policy...");
    await Api.delete(apiRegister.bucket_policy, this.bucketName);
    this.$store.dispatch("systemConfig/hideLoader");
  }
  private async deleteBucket() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      "Deleting bucket " + this.bucketToDelete
    );
    await Api.delete(apiRegister.s3_bucket, this.bucketToDelete);
    this.$store.dispatch("systemConfig/hideLoader");
    await this.getAllBuckets();
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

</style>
