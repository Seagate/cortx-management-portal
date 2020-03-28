<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblUpdateHotfix">
        Update hotfix
      </div>
      <div class="mt-6" id="lblUpdateHotfixMsg">
        <span class="eos-text-bold"
          >It is important that you are using the hotfix for your system.</span
        >
        Use the link below to see if there's a newer version.
        <br />If a newer version is available, download it to your device and
        then install the file using button below.
      </div>
      <div class="mt-6" id="lblVersion">
        <span class="eos-text-bold">Your hotfix version:</span> Seagate storage
        complete 10.2 (Jan 2019 release).
      </div>
      <v-divider class="mt-2 mb-5" />
      <input
        type="file"
        id="file"
        ref="file"
        accept=".iso"
        v-on:change="handleFileUpload($event.target.files)"
      />
      <div
        class="eos-form-group-label eos-form-group-error-msg mt-3"
        v-if="
          hotfixPackageFormValidation.isDirty &&
            !hotfixPackageFormValidation.isValid
        "
      >
        <label>Package should be a '.iso' file.</label>
      </div>
      <v-divider class="mt-5 mb-2" />
      <div class="mt-8">
        <!-- :disabled="!file" -->
        <button
          id="btnInstallHotfix"
          type="button"
          class="eos-btn-primary"
          @click="uploadHotfix()"
        >
          Install new hotfix file
        </button>
        <button
          id="btnStartUpgrade"
          type="button"
          class="ml-5 eos-btn-primary"
          @click="startUpgrade()"
          :disabled="!isPackageUploaded"
        >
          Start upgrade
        </button>
      </div>
    </div>
    <eos-confirmation-dialog
      :show="showConfirmDialog"
      title="Confirmation"
      :message="confirmationMessage"
      :severity="confirmDialogSeverity"
      @closeDialog="closeConfirmDialog"
      :confirmButtonText="
        confirmButtonText || confirmButtonText === ''
          ? confirmButtonText
          : undefined
      "
      :confirmButtonDisabled="confirmButtonDisabled"
      :cancelButtonText="cancelButtonText ? cancelButtonText : undefined"
    ></eos-confirmation-dialog>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
@Component({
  name: "eos-hotfix"
})
export default class EosHotfix extends Vue {
  public hotfixPackage: File | null = null;
  public hotfixPackageFormValidation: any = {
    isDirty: false,
    isValid: false
  };

  public data() {
    return {
      file: File,
      confirmationMessage: "",
      showConfirmDialog: false,
      cancelButtonText: undefined,
      confirmButtonText: undefined,
      confirmDialogSeverity: "info",
      formData: undefined,
      hotfixStatus: "",
      confirmButtonDisabled: false,
      isPackageUploaded: false
    };
  }
  public async mounted() {
    await this.getLastUpgradeStatus();
  }

  public async getLastUpgradeStatus() {
    this.$store.dispatch(
      "systemConfig/showInfiniteLoader",
      "Getting upgrade status..."
    );
    const res: any = await Api.getAll(apiRegister.hotfix_status);
    this.$data.hotfixStatus = res && res.data ? res.data : null;
    if (this.$data.hotfixStatus.status === "uploaded") {
      this.$data.isPackageUploaded = true;
    }
    this.$store.dispatch("systemConfig/hideLoader");
  }

  private async uploadHotfix() {
    // const hotfixStatus = {
    //   data: {
    //     status: "uploaded",
    //     version: "unknown_ver",
    //     description: "unknown_desc",
    //     details: "Package uploaded successfully",
    //     uploaded_at: "2020-03-24T05:17:04.276455",
    //     started_at: "2020-03-24T05:18:11.044907",
    //     updated_at: "2020-03-24T05:58:29.945115"
    //   }
    //   // data: {}
    // };
    const hotfixStatus = this.$data.hotfixStatus;

    if (hotfixStatus && hotfixStatus) {
      if (hotfixStatus.status) {
        this.$data.hotfixStatus = hotfixStatus.status;
        if (hotfixStatus.status === "success") {
          this.$data.confirmationMessage = `Success. ${hotfixStatus.details}
          Do you want to upload new package?`;
          this.$data.showConfirmDialog = true;
        } else if (hotfixStatus.status === "fail") {
          this.$data.confirmationMessage = `Failed.
          ${hotfixStatus.details}
          Do you want to upload new package?`;
          this.$data.showConfirmDialog = true;
          this.$data.confirmDialogSeverity = "warning";
        } else if (hotfixStatus.status === "in_progress") {
          this.$data.confirmationMessage = `Package upload is in progress.
          ${hotfixStatus.details}`;
          this.$data.showConfirmDialog = true;
          this.$data.confirmButtonText = "";
          this.$data.confirmDialogSeverity = "warning";
          this.$data.cancelButtonText = "Okay";
        } else if (hotfixStatus.status === "uploaded") {
          this.$data.confirmationMessage = `Package has been uploaded successfully.
          ${hotfixStatus.details}
          Do you want to start the upgrading process?`;
          this.$data.showConfirmDialog = true;
          this.$data.confirmButtonText = "Yes";
          this.$data.cancelButtonText = "Cancel";
        }
      } else {
        this.$data.confirmationMessage = `Do you want to upload new package?`;
        this.$data.showConfirmDialog = true;
      }
    }
  }
  private async closeConfirmDialog(confirmation: boolean) {
    const formData = new FormData();
    formData.append("package", this.$data.hotfixPackage);
    if (confirmation) {
      this.$data.showConfirmDialog = false;
      if (this.$data.hotfixStatus === "uploaded") {
        this.$store.dispatch(
          "systemConfig/showInfiniteLoader",
          "Upgrading in progress..."
        );
        const res = await Api.post(apiRegister.hotfix_start, {});
      } else {
        this.$store.dispatch(
          "systemConfig/showInfiniteLoader",
          "Uploading hotfix upgrade file..."
        );
        const res = await Api.uploadFile(apiRegister.hotfix_upload, formData);
      }
    }
    this.$store.dispatch("systemConfig/hideLoader");
    this.$data.showConfirmDialog = false;
    this.$data.confirmDialogSeverity = "info";
    this.$data.confirmButtonText = undefined;
    this.$data.cancelButtonText = undefined;
  }
  public handleFileUpload(fileList: FileList) {
    this.hotfixPackageFormValidation.isDirty = true;
    this.hotfixPackageFormValidation.isValid = false;
    this.hotfixPackage = null;
    if (this.validateFilename(fileList[0].name)) {
      this.hotfixPackage = fileList[0];
      this.hotfixPackageFormValidation.isValid = true;
    }
  }

  private validateFilename(fileName: string): boolean {
    let isFileNameValid: boolean = false;
    const fileNameParts = fileName.split(".");
    if (
      fileNameParts.length > 1 &&
      fileNameParts[fileNameParts.length - 1] === "iso"
    ) {
      isFileNameValid = true;
    }
    return isFileNameValid;
  }
}
</script>

<style lang="scss" scoped></style>
