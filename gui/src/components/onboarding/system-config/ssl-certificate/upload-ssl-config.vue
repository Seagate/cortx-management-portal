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
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div
        class="mt-3 pa-3 pb-0 cortx-last-ssl-info-container cortx-text-md"
        v-if="lastSSLStatus.status"
      >
        <table>
          <tr>
            <td style="width: 180px;">
              <label class="cortx-text-bold">{{ $t("onBoarding.lastInstallationStatus") }}:</label>
            </td>
            <td>
              <label>{{ lastSSLStatus.status }}</label>
            </td>
          </tr>
          <tr>
            <td>
              <label class="cortx-text-bold">{{ $t("onBoarding.lastCertificateFilename") }}:</label>
            </td>
            <td>
              <label>{{ lastSSLStatus.filename }}</label>
            </td>
          </tr>
          <tr>
            <td>
              <label class="cortx-text-bold">{{ $t("onBoarding.lastCertificateUploadDate") }}:</label>
            </td>
            <td>{{ lastSSLStatus.date }}</td>
          </tr>
          <tr>
            <td>
              <label class="cortx-text-bold">{{ $t("onBoarding.serialNumber") }}:</label>
            </td>
            <td>
              <label>{{ lastSSLStatus.serial_number }}</label>
            </td>
          </tr>
        </table>
      </div>
      <v-divider class="mt-2 mb-5" />
      <input
        type="file"
        id="file"
        ref="file"
        v-on:change="handleFileUpload($event.target.files)"
        accept=".pem"
      />
      <v-divider class="mt-5" />
      <div class="mt-4">
        <v-row>
          <v-col cols="12">
            <v-row>
              <button
                :disabled="!fileStatus"
                id="btnUploadSSL"
                type="button"
                class="cortx-btn-primary mt-3"
                @click="uploadCertificate()"
              >
                {{ $t("onBoarding.uploadCertificate") }}
              </button>
              <span class="ml-5" v-if="$route.path !== '/onboarding'">
                <CortxInstallSSL :installStatus="buttonStatus" />
              </span>
            </v-row>
          </v-col>
        </v-row>
      </div>
    </div>
    <span class="d-none">{{ isValidForm }}</span>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Api } from "./../../../../services/api";
import apiRegister from "./../../../../services/api-register";
import CortxInstallSSL from "./install-ssl.vue";
import {
  SystemConfigObject,
  DnsNetworkSettings
} from "./../../../../models/system-configuration";
import { EVENT_BUS } from "./../../../../main";
import { Validations } from "vuelidate-property-decorators";
import {
  required,
  helpers,
  sameAs,
  ipAddress,
  requiredIf
} from "vuelidate/lib/validators";
import i18n from "../.././../../i18n";

@Component({
  name: "upload-ssl-config",
  components: {
    CortxInstallSSL
  }
})
export default class CortxUploadSSLConfig extends Vue {
  @Validations()
  private validations = {
    file: { required }
  };
  private mounted() {
    this.getCertificateStatus();
    // WizardHook: Open a listener for onNext event
    // So when wizard footer clicks on the Next Button this component can perform its own workflow
    EVENT_BUS.$on("emitOnNext", (res: any) => {
      res(true);
    });
  }
  private destroyed() {
    // WizardHook: shut off on exit event listener
    EVENT_BUS.$off("emitOnNext");
  }
  get isValidForm() {
    const validate = true;
    // WizardHook: Emit event to sibling wizard footer component
    // to send information about data validation to enable/disable wizard footer
    EVENT_BUS.$emit("validForm", validate);
    return validate;
  }
  private data() {
    return {
      buttonStatus: false,
      lastSSLStatus: {},
      fileStatus: false,
      file: File,
      route: false
    };
  }
  private handleFileUpload(fileList: FileList) {
    this.$data.file = fileList[0];
    this.$data.fileStatus = true;
  }
  private async getCertificateStatus() {
    this.$store.dispatch("systemConfig/showLoader", "Fetching certificate...");
    const res = await Api.getAll(apiRegister.ssl_status);
    this.$data.lastSSLStatus = res.data;
    if (this.$data.lastSSLStatus.status === "installation_successful") {
      this.$data.buttonStatus = false;
    } else if (this.$data.lastSSLStatus.status === "not_installed") {
      this.$data.buttonStatus = true;
    }
    this.$store.dispatch("systemConfig/hideLoader");
  }
  private async uploadCertificate() {
    const formData = new FormData();
    formData.append("pemfile", this.$data.file);
    this.$store.dispatch("systemConfig/showLoader", "Uploading certificate...");
    const res = await Api.uploadFile(apiRegister.ssl_upload, formData);
    this.$data.buttonStatus = true;
    this.$store.dispatch("systemConfig/hideLoader");
  }
}
</script>
<style lang="scss" scoped>
.cortx-last-ssl-info-container {
  border: 1px solid #e3e3e3;
  border-radius: 5px;
}
</style>
