<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="mt-6" id="lblVersion">
        <span class="eos-text-bold"
          >Last uploaded file: {{ status.filename }} : {{ status.date }}</span
        >
      </div>
      <v-divider class="mt-2 mb-5" />
      <input
        type="file"
        id="file"
        ref="file"
        v-on:change="handleFileUpload($event.target.files)"
        accept=".pem"
      />
      <v-divider class="mt-5 mb-2" />
      <div class="mt-8">
        <v-row>
          <v-col cols="12">
            <v-row>
              <button
                :disabled="!fileStatus"
                id="btnUploadSSL"
                type="button"
                class="eos-btn-primary mt-3"
                @click="uploadCertificate()"
              >
                Upload certificate
              </button>
              <span class="ml-7" v-if="$route.path !== '/onboarding'">
                <EOSInstallSSL :installStatus="buttonStatus" />
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
import EOSInstallSSL from "./install-ssl.vue";
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
@Component({
  name: "upload-ssl-config",
  components: {
    EOSInstallSSL
  }
})
export default class EOSUploadSSLConfig extends Vue {
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
      status: "",
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
    this.$data.status = res.data;
    if (this.$data.status.status === "installation_successful") {
      this.$data.buttonStatus = false;
    } else if (this.$data.status.status === "not_installed") {
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
<style lang="scss" scoped></style>
