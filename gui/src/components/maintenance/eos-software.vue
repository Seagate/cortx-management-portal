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
  public data() {
    return {
      file: undefined,
      confirmationMessage: "",
      showConfirmDialog: false,
      cancelButtonText: undefined,
      confirmButtonText: undefined,
      confirmDialogSeverity: "info",
      formData: undefined,
      hotfixStatus: ""
    };
  }

  private handleFileUpload(fileList: FileList) {
    this.$data.file = fileList[0];
  }
  private async uploadHotfix() {
    const formData = new FormData();
    formData.append("file", this.$data.file);

    this.$store.dispatch(
      "systemConfig/showLoader",
      "Getting upgrade status..."
    );
    const hotfixStatus = await Api.getAll(apiRegister.hotfix_status);
    this.$store.dispatch("systemConfig/hideLoader");
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

    if (hotfixStatus && hotfixStatus.data) {
      if (hotfixStatus.data.status) {
        this.$data.hotfixStatus = hotfixStatus.data.status;
        if (hotfixStatus.data.status === "success") {
          this.$data.confirmationMessage = `Success. ${hotfixStatus.data.details}
          Do you want to upload new package?`;
          this.$data.showConfirmDialog = true;
        } else if (hotfixStatus.data.status === "fail") {
          this.$data.confirmationMessage = `Failed.
          ${hotfixStatus.data.details}
          Do you want to upload new package?`;
          this.$data.showConfirmDialog = true;
          this.$data.confirmDialogSeverity = "warning";
        } else if (hotfixStatus.data.status === "in_progress") {
          this.$data.confirmationMessage = `Package upload is in progress.
          ${hotfixStatus.data.details}`;
          this.$data.showConfirmDialog = true;
          this.$data.confirmButtonText = "";
          this.$data.confirmDialogSeverity = "warning";
          this.$data.cancelButtonText = "Okay";
        } else if (hotfixStatus.data.status === "uploaded") {
          this.$data.confirmationMessage = `Package has been uploaded successfully.
          ${hotfixStatus.data.details}
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
    if (confirmation) {
      if (this.$data.hotfixStatus === "uploaded") {
        const res = await Api.post(apiRegister.hotfix_start, {});
      } else {
        const res = await Api.uploadFile(
          apiRegister.hotfix_upload,
          this.$data.formData
        );
      }
    }
    this.$data.showConfirmDialog = false;
    this.$data.confirmDialogSeverity = "info";
    this.$data.confirmButtonText = undefined;
    this.$data.cancelButtonText = undefined;
  }
}
</script>

<style lang="scss" scoped></style>
