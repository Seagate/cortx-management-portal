<template>
  <div>
    <Loader :show="showLoader" :message="loaderMessage" />

    <div style="width: 100%">
      <div v-if="showCreateBucketForm">
        <v-row>
          <v-col class="pl-5">
            <div class="pt-3">
              <InputBox :form="createBucketForm" :control="createBucketForm.controls[0]" />
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn
              v-if="showCreateBucketForm"
              color="green"
              class="mx-2"
              @click="createBucket()"
              :disabled="!createBucketForm.isValid"
            >
              <span class="white--text">Create Bucket</span>
            </v-btn>
            <v-btn
              v-if="showCreateBucketForm"
              outlined
              color="success"
              class="ml-5"
              @click="closeCreateBucketForm()"
            >
              <span style="text-transform: none !important;">Cancel</span>
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <v-btn
        v-if="!showCreateBucketForm"
        color="green"
        class="mt-2 mb-4 elevation-0"
        @click="openCreateBucketForm()"
      >
        <span class="white--text">Create Bucket</span>
      </v-btn>

      <v-dialog v-model="showBucketCreateSuccessDialog" persistent max-width="790">
        <v-card>
          <v-system-bar color="greay lighten-3">
            <v-spacer></v-spacer>
            <v-icon @click="closeBucketCreateSuccessDialog()" style="cursor: pointer;">mdi-close</v-icon>
          </v-system-bar>
          <v-card-title class="title mt-6 ml-3">
            <img class="mr-2" src="./../../assets/status/healthy-icon.png" />
            <span>Bucket created successfully.</span>
          </v-card-title>
          <v-card-actions>
            <v-btn color="green" @click="closeBucketCreateSuccessDialog()" class="ma-5 elevation-0">
              <span class="white--text">OK</span>
            </v-btn>
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
            <v-btn color="green" @click="closeConfirmDeleteDialog('yes')" class="ma-5 elevation-0">
              <span class="white--text">Yes</span>
            </v-btn>
            <v-btn
              color="green"
              outlined
              @click="closeConfirmDeleteDialog('no')"
              class="ma-5 elevation-0"
            >
              <span style="text-transform: none;">No</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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
            <th
              v-for="header in bucketsTableHeaderList"
              :key="header.text"
              class="tableheader text-capitalize font-weight-medium text--black"
            >
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
                src="./../../assets/delete-off.png"
              />
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Buckets } from "./../.././././models/s3Buckets";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import Loader from "../widgets/loader.vue";
import InputBox from "../widgets/input-box.vue";
import { Form, FormControl, Validator } from "../widgets/form-widget";

@Component({
  name: "eos-bucketcreation",
  components: { Loader, InputBox }
})
export default class EosBucketCreation extends Vue {
  private showCreateBucketForm: boolean;
  private showLoader: boolean;
  private loaderMessage: string;
  private showBucketCreateSuccessDialog: boolean;
  private showConfirmDeleteDialog: boolean;

  private bucketsTableHeaderList: any[];
  private bucketsList: Buckets[] = [];
  private bucketToDelete: string = "";

  private createBucketForm: Form;

  constructor() {
    super();
    this.showCreateBucketForm = false;
    this.showLoader = false;
    this.loaderMessage = "";
    this.showBucketCreateSuccessDialog = false;
    this.showConfirmDeleteDialog = false;
    this.bucketsTableHeaderList = [
      {
        text: "Bucket Name",
        value: "name",
        sortable: false
      }
    ];

    const controls: FormControl[] = [
      new FormControl(
        "Bucket Name",
        "bucket_name",
        "text",
        "",
        true,
        "Bucket Name is required",
        new Validator(new RegExp("^[a-zA-Z0-9_-]*$"), "Invalid Bucket Name"),
        "Bucket Name should be alphanumeric " +
          "and can have _ or - but no spaces"
      )
    ];
    this.createBucketForm = new Form(controls, false);
  }

  public mounted() {
    this.getAllBuckets();
  }

  public async getAllBuckets() {
    this.showLoader = true;
    this.loaderMessage = "Fetching All Buckets...";
    try {
      const res: any = await Api.getAll(apiRegister.s3_bucket);
      this.bucketsList = res.data.buckets;
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log("TCL: EosBucketCreation -> getAllBuckets -> error", error);
    }
    this.showLoader = false;
    this.loaderMessage = "";
  }

  public async createBucket() {
    this.showLoader = true;
    this.loaderMessage = "Creating Bucket...";
    const tempBucket = this.createBucketForm.getModel();
    try {
      const res = await Api.post(apiRegister.s3_bucket, tempBucket);
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log("TCL: EosBucketCreation -> createBucket -> error", error);
    }
    this.showLoader = false;
    this.loaderMessage = "";
    this.showBucketCreateSuccessDialog = true;
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
    this.createBucketForm.isValid = false;
    this.createBucketForm.controls.forEach(control => {
      control.value = "";
      control.isDirty = false;
      control.isValid = false;
    });
  }

  public async deleteBucket() {
    this.showLoader = true;
    this.loaderMessage = "Deleting bucket " + this.bucketToDelete;
    try {
      await Api.delete(apiRegister.s3_bucket, this.bucketToDelete);
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log("TCL: EosBucketCreation -> deleteBucket -> error", error);
    }
    this.showLoader = false;
    this.loaderMessage = "";
    this.getAllBuckets();
  }

  public openConfirmDeleteDialog(bucketName: string) {
    this.bucketToDelete = bucketName;
    this.showConfirmDeleteDialog = true;
  }

  public async closeConfirmDeleteDialog(confirmation: string) {
    this.showConfirmDeleteDialog = false;
    if (confirmation === "yes") {
      this.deleteBucket();
    }
    this.bucketToDelete = "";
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
  color: green;
  float: right;
}
#title {
  color: black;
}
.tableheader {
  height: 2.5em;
  background-color: #e3e3e3;
  border-top: 1px solid whitesmoke;
  padding-top: 0.5em;
}
.active {
  display: inline-block;
  color: green !important;
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
tbody tr {
  background-color: #ebf1e9 !important ;
}
tbody tr:hover {
  border-top: 2px solid darkgray !important;
  border-bottom: 2px solid darkgray !important;
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
</style>
