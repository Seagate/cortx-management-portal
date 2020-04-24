<template>
  <div>
    <div class="eos-text-lg eos-text-bold" id="lblUpdateHotfix">Update software</div>
    <div class="mt-3" id="lblSoftwareUploadmsg">
      Update the software. Upload the software bundle file (.iso) received from Seagate.
      <br />
Click Start update once the bundle file is uploaded successfully. After the software update, you must login again.
    </div>
    <div class="mt-3 pa-3 eos-last-upgrade-info-container eos-text-md" v-if="lastUpgradeStatus">
      <table>
        <tr>
          <td style="width: 180px;">
            <label class="eos-text-bold">Last update status:</label>
          </td>
          <td style="padding-top: 2px;">
            <label>{{ lastUpgradeStatus.status ? lastUpgradeStatus.status.toUpperCase(): "Not available" }}</label>

          </td>
        </tr>
        <tr v-if="lastUpgradeStatus.version">
          <td>
            <label class="eos-text-bold">Last update version:</label>
          </td>
          <td style="padding-top: 2px;">{{ lastUpgradeStatus.version }}</td>
        </tr>
        <tr v-if="lastUpgradeStatus.description">
          <td>
            <label class="eos-text-bold">Last update description:</label>
          </td>
          <td style="padding-top: 2px;">
            <label>{{ lastUpgradeStatus.description }}</label>
          </td>
        </tr>
      </table>
    </div>
    <div class="mt-6 eos-text-md" id="lblUpdateHotfixMsg"></div>
    <v-divider class="mt-2 mb-5" />
    <div v-if="!showUploadForm">
      <button
        id="btnInstallHotfix"
        type="button"
        class="eos-btn-primary"
        @click="showUploadForm = true"
        :disabled="!canInstallHotfix"
      >Upload new software file</button>
      <button
        id="btnStartUpgrade"
        type="button"
        class="ml-5 eos-btn-primary"
        @click="startUpgrade()"
        :disabled="!isPackageAvailable"
      >Start update</button>
    </div>
    <div v-else>
      <input
        type="file"
        id="file"
        ref="hotfixPackageFileInput"
        accept=".iso"
        @change="handleFileUpload($event.target.files)"
      />
      <div
        class="eos-form-group-label eos-form-group-error-msg mt-3"
        v-if="
          hotfixPackageFormValidation.isDirty &&
            !hotfixPackageFormValidation.isValid
        "
      >
        <label>Invalid file.</label>
      </div>
      <v-divider class="mt-5 mb-2" />
      <button
        id="btnInstallHotfix"
        type="button"
        class="mt-3 eos-btn-primary"
        @click="uploadHotfixPackage()"
        :disabled="!hotfixPackage"
      >Upload</button>
      <button
        id="btnCancelInstallHotfix"
        type="button"
        class="mt-3 ml-5 eos-btn-secondary"
        @click="closeUploadForm()"
      >Cancel</button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";

@Component({
  name: "eos-hotfix"
})
export default class EosHotfix extends Vue {
  public lastUpgradeStatus: any = null;
  public showUploadForm: boolean = false;
  public isPackageAvailable: boolean = false;
  public canInstallHotfix: boolean = true;
  public hotfixPackage: File | null = null;
  public hotfixPackageFormValidation: any = {
    isDirty: false,
    isValid: false
  };

  public async mounted() {
    await this.getLastUpgradeStatus();
  }

  public async getLastUpgradeStatus() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      "Fetching last update status..."
    );
    const res: any = await Api.getAll(apiRegister.hotfix_status);
    this.lastUpgradeStatus = res && res.data ? res.data : null;
    if (this.lastUpgradeStatus.status === "uploaded") {
      this.$data.isPackageAvailable = true;
    }
    if (this.lastUpgradeStatus.status === "in_progress") {
      this.$data.canInstallHotfix = false;
    }
    this.$store.dispatch("systemConfig/hideLoader");
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

  public async uploadHotfixPackage() {
    if (this.hotfixPackage !== null) {
      this.$store.dispatch(
        "systemConfig/showLoader",
        "Uploading the package..."
      );
      const formData = new FormData();
      formData.append("package", this.hotfixPackage);
      try {
        const res = await Api.uploadFile(apiRegister.hotfix_upload, formData);
      } catch (error) {
        let errorMessage = "No response, please check the upload status";
        if (error && error.error && error.error.message) {
          errorMessage = error.message;
        }
        throw {
          error: {
            message: errorMessage
          }
        };
      } finally {
        this.closeUploadForm();
        this.isPackageAvailable = true;
        this.$store.dispatch("systemConfig/hideLoader");
        await this.getLastUpgradeStatus();
      }
    }
  }
  public async startUpgrade() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      "Software update in progress..."
    );
    const res = await Api.post(apiRegister.hotfix_start, {}, { timeout: -1 });
    this.$store.dispatch("systemConfig/hideLoader");
    await this.getLastUpgradeStatus();
  }
  public closeUploadForm() {
    const fileInput: any = this.$refs.hotfixPackageFileInput;
    fileInput.value = "";
    this.hotfixPackage = null;
    this.showUploadForm = false;
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

<style lang="scss" scoped>
.eos-last-upgrade-info-container {
  border: 1px solid #e3e3e3;
  border-radius: 5px;
}
</style>
