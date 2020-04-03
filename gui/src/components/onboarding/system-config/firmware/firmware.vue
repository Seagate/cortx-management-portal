/*****************************************************************************
 Filename:          firmware.vue
 Description:       Update firmware file component

 Creation Date:     05/02/2019
 Author:            Sanjeevan Bhave

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <div>
    <div class="eos-text-lg eos-text-bold" id="lblUpdateFirmware">Update firmware</div>
    <div class="mt-3 pa-3 eos-last-upgrade-info-container eos-text-md" v-if="lastUpgradeStatus">
      <table>
        <tr>
          <td style="width: 180px;">
            <label class="eos-text-bold">Last Upgrade status:</label>
          </td>
          <td style="padding-top: 3px;">
            <label>{{ lastUpgradeStatus.status.toUpperCase() }}</label>
          </td>
        </tr>
        <tr>
          <td style="width: 180px;">
            <label class="eos-text-bold">Last Upgraded version:</label>
          </td>
          <td style="padding-top: 3px;">{{ lastUpgradeStatus.version }}</td>
        </tr>
      </table>
    </div>
    <div class="mt-6 eos-text-md" id="lblUpdateFirmwareMsg">
      <span class="eos-text-bold">It is important that you are using the firmware for your system.</span>
      Use the link below to see if there's a newer version.
      <br />If a newer version is available, download it to your device and then install the file using button below.
    </div>
    <v-divider class="mt-2 mb-5" />
    <div v-if="!showUploadForm">
      <button
        id="btnInstallFirmware"
        type="button"
        class="eos-btn-primary"
        @click="showUploadForm = true"
      >Upload new firmware file</button>
      <button
        id="btnStartUpgrade"
        type="button"
        class="ml-5 eos-btn-primary"
        @click="startUpgrade()"
        :disabled="!isPackageAvailable || (lastUpgradeStatus && lastUpgradeStatus.status === 'in_progress')"
      >Start upgrade</button>
    </div>
    <div v-if="showUploadForm">
      <input
        type="file"
        id="file"
        ref="firmwarePackageFileInput"
        @change="handleFileUpload($event.target.files)"
        accept =".iso"
      />
      <div
        class="eos-form-group-label eos-form-group-error-msg mt-3"
        v-if="firmwarePackageFormValidation.isDirty && !firmwarePackageFormValidation.isValid"
      >
        <label>Package should be a '.iso' file.</label>
      </div>
      <v-divider class="mt-5 mb-2" />
      <button
        id="btnInstallFirmware"
        type="button"
        class="mt-3 eos-btn-primary"
        @click="uploadFirmwarePackage()"
        :disabled="!firmwarePackage"
      >Upload</button>
      <button
        id="btnCancelInstallFirmware"
        type="button"
        class="mt-3 ml-5 eos-btn-secondary"
        @click="closeUploadForm()"
      >Cancel</button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Api } from "../../../../services/api";
import apiRegister from "../../../../services/api-register";
import { LastUpgradeStatus } from "../../../../models/firmware";

@Component({
  name: "eos-firmware"
})
export default class EosFirmware extends Vue {
  public lastUpgradeStatus: LastUpgradeStatus | null = null;
  public showUploadForm: boolean = false;
  public isPackageAvailable: boolean = false;
  public firmwarePackage: File | null = null;
  public firmwarePackageFormValidation: any = {
    isDirty: false,
    isValid: false
  };

  public async mounted() {
    await this.getLastUpgradeStatus();
    await this.getPackageAvailability();
  }

  public async getLastUpgradeStatus() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      "Fetching last upgrade status..."
    );
    const res: any = await Api.getAll(apiRegister.last_upgrade_status);
    this.lastUpgradeStatus = res && res.data && res.data.status ? res.data : null;
    this.$store.dispatch("systemConfig/hideLoader");
  }

  public async startUpgrade() {
    if (this.lastUpgradeStatus) {
      this.lastUpgradeStatus.status = "in_progress";
    }
    this.$store.dispatch("systemConfig/showLoader", "Starting upgrade...");
    const res: any = await Api.post(apiRegister.start_firmware_upgrade, {});
    this.lastUpgradeStatus = res && res.data ? res.data : null;
    this.$store.dispatch("systemConfig/hideLoader");
  }

  public async getPackageAvailability() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      "Fetching package availability..."
    );
    try {
      await Api.getAll(apiRegister.firmware_package_availability);
      this.isPackageAvailable = true;
    } catch (e) {
      if (
        e.status &&
        e.status === 400 &&
        e.data &&
        e.data.error_code === 4101
      ) {
        this.isPackageAvailable = false;
      }
    }
    this.$store.dispatch("systemConfig/hideLoader");
  }

  public handleFileUpload(fileList: FileList) {
    this.firmwarePackageFormValidation.isDirty = true;
    this.firmwarePackageFormValidation.isValid = false;
    this.firmwarePackage = null;
    if (this.validateFilename(fileList[0].name)) {
      this.firmwarePackage = fileList[0];
      this.firmwarePackageFormValidation.isValid = true;
    }
  }

  public async uploadFirmwarePackage() {
    if (this.firmwarePackage !== null) {
      this.$store.dispatch(
        "systemConfig/showInfiniteLoader",
        "Uploading the package..."
      );
      const formData = new FormData();
      formData.append("package", this.firmwarePackage);
      const res = await Api.uploadFile(apiRegister.upload_firmware, formData);
      this.lastUpgradeStatus = res && res.data ? res.data : null;
      this.closeUploadForm();
      this.isPackageAvailable = true;
      this.$store.dispatch("systemConfig/hideLoader");
    }
  }

  public closeUploadForm() {
    const fileInput: any = this.$refs.firmwarePackageFileInput;
    fileInput.value = "";
    this.firmwarePackage = null;
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
