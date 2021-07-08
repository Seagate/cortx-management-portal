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
  <div v-feature="unsupportedFeatures.fw_update">
    <div class="cortx-text-lg cortx-text-bold" id="lblUpdateFirmware">
      {{ $t("onBoarding.updateFirmware") }}
    </div>
    <div class="mt-3" id="lblFirmwareUploadmsg">
      {{ $t("onBoarding.updateStorageEnclosure") }}
      <br />
      {{ $t("onBoarding.updateStorageEnclosureClick") }}
    </div>
    <div
      class="mt-3 pa-3 cortx-last-upgrade-info-container cortx-text-md"
      v-if="lastUpgradeStatus"
    >
      <table>
        <tr>
          <td style="width: 180px">
            <label class="cortx-text-bold">Last update status:</label>
          </td>
          <td style="padding-top: 3px">
            <label>{{
              lastUpgradeStatus.status
                ? lastUpgradeStatus.status.toUpperCase()
                : "Not available"
            }}</label>
          </td>
        </tr>
      </table>
    </div>
    <div class="mt-6 cortx-text-md" id="lblUpdateFirmwareMsg"></div>
    <v-divider class="mt-2 mb-5" />
    <div v-if="!showUploadForm">
      <button
        id="btnInstallFirmware"
        type="button"
        class="cortx-btn-primary"
        @click="showUploadForm = true"
      >
        {{ $t("onBoarding.uploadNewFirmware") }}
      </button>
      <button
        id="btnStartUpgrade"
        type="button"
        class="ml-5 cortx-btn-primary"
        @click="startUpgrade()"
        :disabled="
          !isSystemStable ||
          !isPackageAvailable ||
          (lastUpgradeStatus && lastUpgradeStatus.status === 'in_progress')
        "
      >
        {{ $t("onBoarding.startUpdate") }}
      </button>
    </div>
    <div v-if="showUploadForm">
      <input
        type="file"
        id="file"
        ref="firmwarePackageFileInput"
        @change="handleFileUpload($event.target.files)"
        accept=".bin"
      />
      <div
        class="cortx-form-group-label cortx-form-group-error-msg mt-3"
        v-if="
          firmwarePackageFormValidation.isDirty &&
          !firmwarePackageFormValidation.isValid
        "
      >
        <label>{{ $t("onBoarding.invalidFile") }}</label>
      </div>
      <v-divider class="mt-5 mb-2" />
      <button
        id="btnInstallFirmware"
        type="button"
        class="mt-3 cortx-btn-primary"
        @click="uploadFirmwarePackage()"
        :disabled="!firmwarePackage"
      >
        {{ $t("common.upload") }}
      </button>
      <button
        id="btnCancelInstallFirmware"
        type="button"
        class="mt-3 ml-5 cortx-btn-secondary"
        @click="closeUploadForm()"
      >
        {{ $t("common.cancel") }}
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Api } from "../../../../services/api";
import apiRegister from "../../../../services/api-register";
import { LastUpgradeStatus } from "../../../../models/firmware";
import i18n from "../../onboarding.json";
import { unsupportedFeatures } from "../../../../common/unsupported-feature";

@Component({
  name: "cortx-firmware",
  i18n: {
    messages: i18n
  }
})
export default class CortxFirmware extends Vue {
  public lastUpgradeStatus: LastUpgradeStatus | null = null;
  public showUploadForm: boolean = false;
  public isPackageAvailable: boolean = false;
  public firmwarePackage: File | null = null;
  public firmwarePackageFormValidation: any = {
    isDirty: false,
    isValid: false
  };
  public isSystemStable: boolean = true;
  public unsupportedFeatures = unsupportedFeatures;

  public async mounted() {
    await this.getSyetmStatus();
    await this.getLastUpgradeStatus();
    await this.getPackageAvailability();
  }
  public async getSyetmStatus() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      "checking service status..."
    );
    try {
      const res: any = await Api.getAll(apiRegister.system_status);
      this.$store.dispatch("systemConfig/hideLoader");
    } catch (error) {
      this.$data.isSystemStable = false;
      let errorMessage = "Please check service status.";
      if (error.data.consul !== "success" && error.data.es !== "success") {
        errorMessage = error.data.consul + " " + "and" + " " + error.data.es;
      } else if (error.data.consul !== "success") {
        errorMessage = error.data.consul;
      } else if (error.data.es !== "success") {
        errorMessage = error.data.es;
      }
      throw {
        error: {
          message: "error"
        }
      };
    } finally {
      this.$store.dispatch("systemConfig/hideLoader");
    }
  }
  public async getLastUpgradeStatus() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      "Fetching last update status..."
    );
    this.getSyetmStatus();
    const res: any = await Api.getAll(apiRegister.last_upgrade_status);
    this.lastUpgradeStatus = res && res.data ? res.data : null;
    this.$store.dispatch("systemConfig/hideLoader");
  }

  public async startUpgrade() {
    if (this.lastUpgradeStatus) {
      this.lastUpgradeStatus.status = "in_progress";
    }
    this.$store.dispatch("systemConfig/showLoader", "Starting update...");
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
        "systemConfig/showLoader",
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
      fileNameParts[fileNameParts.length - 1] === "bin"
    ) {
      isFileNameValid = true;
    }
    return isFileNameValid;
  }
}
</script>

<style lang="scss" scoped>
.cortx-last-upgrade-info-container {
  border: 1px solid #e3e3e3;
  border-radius: 5px;
}
</style>
