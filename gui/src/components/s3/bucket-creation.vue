<template>
  <div>
    <Loader :show="showLoader" :message="loaderMessage" />
    <div style="width: 100%">
      <div v-if="showCreateBucketForm" class="px-2">
        <v-row>
          <v-col class="py-0 pr-0">
            <div
              class="eos-form-group"
              :class="{ 'eos-form-group--error': $v.createBucketForm.bucket.bucket_name.$error }"
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
                  v-if="$v.createBucketForm.bucket.bucket_name.$dirty && !$v.createBucketForm.bucket.bucket_name.required"
                >Bucket name is required</label>
                <label
                  v-else-if="$v.createBucketForm.bucket.bucket_name.$dirty && !$v.createBucketForm.bucket.bucket_name.bucketNameRegex"
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

      <button
        type="button"
        class="mt-2 mb-4 eos-btn-primary"
        v-if="!showCreateBucketForm"
        @click="openCreateBucketForm()"
      >Create</button>

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
              <span class="eos-form-group-label eos-form-group-error-msg red--text">{{jsonerr}}</span>
            </div>
            <div>
              <button
                type="button"
                class="eos-btn-primary"
                :disabled="!$v.policyJson.jsonValidator"
                @click="updateBuketPolicy()"
              >Create</button>
              <button
                type="button"
                class="ml-8 eos-btn-secondary"
                @click="closeBucketPolicyeDialog()"
              >Cancel</button>
            </div>
          </div>
        </div>
      </div>

      <v-data-table
        calculate-widths
        :items="bucketsList"
        item-key="name"
        class="eos-table"
        :hide-default-header="true"
        :hide-default-footer="true"
        :disable-pagination="true"
      >
        <template v-slot:header="{props}">
          <tr>
            <th v-for="header in bucketsTableHeaderList" :key="header.text" class="tableheader">
              <span class="headerText">{{ header.text }}</span>
            </th>
            <th class="tableheader" />
          </tr>
        </template>

        <template v-slot:item="props">
          <tr class="font-weight-small">
            <td>{{props.item.name}}</td>
            <td>
              <img
                @click="openConfirmDeleteDialog(props.item.name)"
                style="cursor: pointer;"
                src="./../../assets/actions/delete-green.svg"
              />
              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <span style="margin-left:20px;">
                    <img
                      @click="openBucketPolicyDialog(props.item.name)"
                      style="cursor: pointer;"
                      src="./../../assets/actions/edit-green.svg"
                      v-on="on"
                    />
                  </span>
                </template>
                <span>Bucket policy</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Validations } from "vuelidate-property-decorators";
import { required, helpers, minLength } from "vuelidate/lib/validators";
import { Bucket } from "../../models/s3";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import Loader from "../widgets/loader.vue";
const bucketNameRegex = helpers.regex("bucketNameRegex", /^[a-zA-Z0-9_-]*$/);

@Component({
  name: "eos-bucketcreation",
  components: { Loader }
})
export default class EosBucketCreation extends Vue {
  public createBucketForm = {
    bucket: {} as Bucket
  };
  private jsonvalidationMsg: any = "" || null;
  private showCreateBucketForm: boolean;
  private showLoader: boolean;
  private loaderMessage: string;
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
    this.showLoader = false;
    this.loaderMessage = "";
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
  data() {
    return {
      jsonerr: ""
    };
  }
  public mounted() {
    this.getAllBuckets();
  }

  public async getAllBuckets() {
    this.showLoader = true;
    this.loaderMessage = "Fetching all buckets...";
    try {
      const res: any = await Api.getAll(apiRegister.s3_bucket);
      this.bucketsList = res.data.buckets;
    } catch (error) {
      // tslint:disable-next-line: no-console
    }
    this.showLoader = false;
    this.loaderMessage = "";
  }

  public async createBucket() {
    this.showLoader = true;
    this.loaderMessage = "Creating bucket...";
    try {
      const res = await Api.post(
        apiRegister.s3_bucket,
        this.createBucketForm.bucket
      );
      this.showBucketCreateSuccessDialog = true;
    } catch (error) {
      this.showBucketCreateSuccessDialog = false;
      // tslint:disable-next-line: no-console
    }
    this.showLoader = false;
    this.loaderMessage = "";
  }

  public closeBucketCreateSuccessDialog() {
    this.clearCreateBucketForm();
    this.showBucketCreateSuccessDialog = false;
    this.showCreateBucketForm = false;
    this.getAllBuckets();
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

  public async deleteBucket() {
    this.showLoader = true;
    this.loaderMessage = "Deleting bucket " + this.bucketToDelete;
    try {
      await Api.delete(apiRegister.s3_bucket, this.bucketToDelete);
    } catch (error) {
      // tslint:disable-next-line: no-console
    }
    this.showLoader = false;
    this.loaderMessage = "";
    this.getAllBuckets();
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
    this.showBucketPolicyDialog = true;
    try {
      const res: any = await Api.getAll(
        apiRegister.bucket_policy + "/" + bucketname
      );
      this.policyJson = JSON.stringify(res.data, null, 4);
    } catch (error) {
      this.policyJson = "";
      // tslint:disable-next-line: no-console
    }
  }

  public async closeConfirmDeleteDialog(confirmation: string) {
    this.showConfirmDeleteDialog = false;
    if (confirmation === "yes") {
      this.deleteBucket();
    }
    this.bucketToDelete = "";
  }
  public async closeBucketPolicyeDialog() {
    this.showBucketPolicyDialog = false;
    this.policyJson = "";
  }
  public async updateBuketPolicy() {
    let policy = JSON.parse(this.policyJson);
    this.showLoader = true;
    try {
      const res = await Api.put(
        apiRegister.bucket_policy,
        policy,
        this.bucketName
      );
    } catch (error) {
      // tslint:disable-next-line: no-console
      this.policyJson = "";
    }
    this.policyJson = "";
    this.showBucketPolicyDialog = false;
    this.showLoader = false;
    this.loaderMessage = "";
  }
}
</script>
<style lang="scss" scoped>
.pointer {
  cursor: pointer;
}
.actbtn {
  position: absolute;
  float: left;
}
#clear {
  font-size: 14px;
  color: var(--v-csmprimary-base);
  float: right;
}
#title {
  color: black;
}
.active {
  display: inline-block;
  color: var(--v-csmprimary-base) !important;
}
.notActive {
  opacity: 0;
}
.headerText {
  color: black;
}
.backoverview {
  position: relative;
  top: 1em;
  cursor: pointer;
}
.backoverviewimg {
  position: relative;
  display: inline-block;
}
.backoverviewtxt {
  position: relative;
  top: -0.3em;
}
.tableheader:hover {
  .notActive {
    opacity: 1;
  }
}
.largeAlert {
  border: 2px solid #e3e3e3;
}
tbody tr:active {
  border-top: 2px solid darkgray !important;
  border-bottom: 2px solid darkgray !important;
}
.center {
  padding: 22px;
}
.delete-bucket-confirmation-msg {
  color: #000;
  font-size: 16px;
}
.textarea-text {
  border-style: solid;
  border-width: 1px;
}
</style>
