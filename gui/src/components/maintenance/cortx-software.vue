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
  <div>
    <div class="cortx-text-lg cortx-text-bold" id="lblUpdateHotfix">
      Update software
    </div>
    <div class="mt-3" id="lblSoftwareUploadmsg">
      Update the software. Upload the software bundle file (.iso) received from
      Seagate.
      <br />
      Click Start update once the bundle file is uploaded successfully. After
      the software update, you must login again.
    </div>
    <div
      class="mt-3 pa-3 cortx-last-upgrade-info-container cortx-text-md"
      v-if="lastUpgradeStatus"
    >
      <table>
        <tr>
          <td style="width: 180px;">
            <label class="cortx-text-bold">Last update status:</label>
          </td>
          <td style="padding-top: 2px;">
            <label>{{
              lastUpgradeStatus.status
                ? lastUpgradeStatus.status.toUpperCase()
                : "Not available"
            }}</label>
          </td>
        </tr>
        <tr v-if="lastUpgradeStatus.version">
          <td>
            <label class="cortx-text-bold">Last update version:</label>
          </td>
          <td style="padding-top: 2px;">{{ lastUpgradeStatus.version }}</td>
        </tr>
        <tr v-if="lastUpgradeStatus.description">
          <td>
            <label class="cortx-text-bold">Last update description:</label>
          </td>
          <td style="padding-top: 2px;">
            <label>{{ lastUpgradeStatus.description }}</label>
          </td>
        </tr>
      </table>
    </div>
    <div class="mt-6 cortx-text-md" id="lblUpdateHotfixMsg"></div>
    <v-divider class="mt-2 mb-5" />
    <div v-if="!showUploadForm">
      <button
        id="btnInstallHotfix"
        type="button"
        class="cortx-btn-primary"
        @click="showUploadForm = true"
        :disabled="!canInstallHotfix"
      >
        Upload new software file
      </button>
      <button
        id="btnStartUpgrade"
        type="button"
        class="ml-5 cortx-btn-primary"
        @click="startUpgrade()"
        :disabled="!systemStatus || !isPackageAvailable"
      >
        Start update
      </button>
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
        class="cortx-form-group-label cortx-form-group-error-msg mt-3"
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
        class="mt-3 cortx-btn-primary"
        @click="uploadHotfixPackage()"
        :disabled="!hotfixPackage"
      >
        Upload
      </button>
      <button
        id="btnCancelInstallHotfix"
        type="button"
        class="mt-3 ml-5 cortx-btn-secondary"
        @click="closeUploadForm()"
      >
        Cancel
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";

@Component({
  name: "cortx-hotfix",
})
export default class CortxHotfix extends Vue {
  public lastUpgradeStatus: any = null;
  public showUploadForm: boolean = false;
  public isPackageAvailable: boolean = false;
  public canInstallHotfix: boolean = true;
  public hotfixPackage: File | null = null;
  public hotfixPackageFormValidation: any = {
    isDirty: false,
    isValid: false,
  };
  public systemStatus: boolean = true;
  public async mounted() {
    await this.getSyetmStatus();
    await this.getLastUpgradeStatus();
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
      this.$data.systemStatus = false;
      let errorMessage = "please check service status";
      if (error && error.error) {
        errorMessage = error.error.message;
      }
      throw {
        error: {
          message: errorMessage
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
    const res: any = await Api.getAll(apiRegister.hotfix_status);
    this.lastUpgradeStatus = res && res.data ? res.data : null;
    if (this.lastUpgradeStatus.status === "uploaded") {
      this.$data.isPackageAvailable = true;
    }
    if (this.lastUpgradeStatus.status === "in_progress") {
      this.$data.isPackageAvailable = false;
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
        if (error && error.error && error.data.message) {
          errorMessage = error.data.message;
        }
        throw {
          error: {
            message: errorMessage,
          },
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
.cortx-last-upgrade-info-container {
  border: 1px solid #e3e3e3;
  border-radius: 5px;
}
</style>
