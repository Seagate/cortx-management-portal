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
            <label class="eos-form-group-label" for="bucketName">Bucket name*</label>
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
              >Bucket name is required</label>
              <label
                v-else-if="
                  $v.createBucketForm.bucket.bucket_name.$dirty &&
                    !$v.createBucketForm.bucket.bucket_name.bucketNameRegex
                "
              >Invalid bucket name</label>
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
          >Create bucket</button>
          <button
            type="button"
            class="ml-8 eos-btn-secondary"
            @click="closeCreateBucketForm()"
          >Cancel</button>
        </v-col>
      </v-row>
    </div>
    <eos-has-access :to="$eosUserPermissions.s3buckets + $eosUserPermissions.create">
      <button
        type="button"
        class="mt-2 mb-2 eos-btn-primary"
        v-if="!showCreateBucketForm"
        @click="openCreateBucketForm()"
      >Create</button>
    </eos-has-access>
    <v-dialog v-model="showBucketCreateSuccessDialog" persistent max-width="790">
      <v-card>
        <v-system-bar color="grey lighten-3">
          <v-spacer></v-spacer>
          <v-icon @click="closeBucketCreateSuccessDialog()" style="cursor: pointer;">mdi-close</v-icon>
        </v-system-bar>
        <v-card-title class="title mt-6 ml-3">
          <img class="mr-2" src="./../../assets/status/healthy-icon.png" />
          <span>Bucket created successfully.</span>
        </v-card-title>
        <v-card-actions>
          <button
            type="button"
            class="ma-5 eos-btn-primary"
            @click="closeBucketCreateSuccessDialog()"
          >Ok</button>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showConfirmDeleteDialog" persistent max-width="790">
      <v-card>
        <v-system-bar color="greay lighten-3">
          <v-spacer></v-spacer>
          <v-icon @click="closeConfirmDeleteDialog('no')" style="cursor: pointer;">mdi-close</v-icon>
        </v-system-bar>
        <v-card-title class="title ml-3">
          <img class="mr-2" src="./../../assets/status/warning.png" />
          <span>Confirmation</span>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <label
            class="ml-3 delete-bucket-confirmation-msg"
          >Are you sure you want to delete the bucket?</label>
        </v-card-text>

        <v-card-actions>
          <button
            type="button"
            class="ma-5 eos-btn-primary"
            @click="closeConfirmDeleteDialog('yes')"
          >Yes</button>
          <button
            type="button"
            class="ma-5 eos-btn-primary"
            @click="closeConfirmDeleteDialog('no')"
          >No</button>
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
            @click="closeBucketPolicyeDialog()"
          />
        </div>
        <div class="eos-modal-body">
          <div class="eos-form-group" style="width: 100%;">
            <label class="eos-form-group-label" for="comment">Add your JSON here</label>
            <textarea
              class="eos-form__input_textarea"
              v-model="policyJson"
              @input="$v.policyJson.$touch"
            ></textarea>
            <span
              class="eos-form-group-label eos-form-group-error-msg red--text"
              v-if="$v.policyJson.$dirty && !$v.policyJson.required"
            >Policy JSON is required</span>
            <span class="eos-form-group-label eos-form-group-error-msg red--text">{{ jsonerr }}</span>
          </div>
          <div class="policy-container">
            <button
              type="button"
              class="eos-btn-primary"
              :disabled="!$v.policyJson.jsonValidator"
              @click="updateBuketPolicy()"
            >Update</button>
          <button
              type="button"
              class="eos-btn-primary ml-8"
              :disabled="!$v.policyJson.jsonValidator"
              @click="deleteBuketPolicy()"
            >Delete </button>
            <button
              type="button"
              class="ml-8 eos-btn-secondary ml-8"
              @click="closeBucketPolicyeDialog()"
            >Cancel</button>
         
          </div>
        </div>
      </div>
    </div>
    <eos-has-access :to="$eosUserPermissions.s3buckets + $eosUserPermissions.list">
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
            <th v-for="header in bucketsTableHeaderList" :key="header.text" class="tableheader">
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
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Validations } from "vuelidate-property-decorators";
import { required, helpers, minLength } from "vuelidate/lib/validators";
import { Bucket } from "../../models/s3";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";

const bucketNameRegex = helpers.regex("bucketNameRegex", /^[a-zA-Z0-9_-]*$/);

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
        bucket_name: { required, bucketNameRegex, minLength: minLength(3) }
      }
    },
    policyJson: {
      required,
      jsonValidator: (value: any, $data: any) => {
        let isValid = false;
        try {
          JSON.parse(value);
          $data.jsonerr = "";
          isValid = true;
        } catch (e) {
          $data.jsonerr = e.message;
        }
        return isValid;
      }
    }
  };

  private jsonvalidationMsg: any = "" || null;
  private showCreateBucketForm: boolean;
  private showBucketCreateSuccessDialog: boolean;
  private showConfirmDeleteDialog: boolean;
  private showBucketPolicyDialog: boolean;
  private bucketsTableHeaderList: any[];
  private bucketsList: Bucket[] = [];
  private bucketToDelete: string = "";
  private policyJson: any = "";
  private bucketName: any = "";

  constructor() {
    super();
    this.jsonvalidationMsg = "";
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
      jsonerr: ""
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
      this.policyJson = JSON.stringify(res.data, null, 4);
    } catch (error) {
      this.policyJson = "";
    }
    this.$store.dispatch("systemConfig/hideLoader");
    this.showBucketPolicyDialog = true;
  }

  public async closeConfirmDeleteDialog(confirmation: string) {
    this.showConfirmDeleteDialog = false;
    if (confirmation === "yes") {
      await this.deleteBucket();
    }
    this.bucketToDelete = "";
  }
  public closeBucketPolicyeDialog() {
    this.showBucketPolicyDialog = false;
    this.policyJson = "";
  }
  public async updateBuketPolicy() {
    const policy = JSON.parse(this.policyJson);
    this.showBucketPolicyDialog = false;
    this.$store.dispatch(
      "systemConfig/showLoader",
      "Updating bucket policy..."
    );
    await Api.put(apiRegister.bucket_policy, policy, this.bucketName);
    this.policyJson = "";
    this.$store.dispatch("systemConfig/hideLoader");
  }
  public async deleteBuketPolicy() {
    this.showBucketPolicyDialog = false;
    this.$store.dispatch(
      "systemConfig/showLoader",
      "Delete bucket policy..."
    );
    await Api.delete(apiRegister.bucket_policy,  this.bucketName);
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
.policy-container{
  display:flex; 
  margin-top:10px;
}
</style>
