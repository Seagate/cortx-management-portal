<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblUpdateFirmware">Upload SSL Certificate</div>
      <div class="mt-6" id="lblUpdateFirmwareMsg">
        <span class="eos-text-bold">It is important that you are uploading ssl cerificate</span>
      </div>
      <div class="mt-6" id="lblVersion"></div>
      <v-divider class="mt-2 mb-5" />
      <input type="file" id="file" ref="file" v-on:change="handleFileUpload($event.target.files)" />
      <v-divider class="mt-5 mb-2" />
      <div class="mt-8">
        <!-- <button
          id="btnInstallFirmware"
          type="button"
          class="eos-btn-primary"
          @click="uploadCertificate()"
        >Upload Certificate</button>-->
        <v-row>
          <v-col cols="12">
            <v-row
              :align="alignment"
              :justify="justify"
              class="grey lighten-5"
              style="height: 300px;"
            >
              <button
                id="btnInstallFirmware"
                type="button"
                class="eos-btn-primary"
                @click="uploadCertificate()"
              >Upload Certificate</button>
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
  name: "uploade-ssl"
})
export default class EOSUploadSSL extends Vue {
  private mounted() {
    // WizardHook: Open a listener for onNext event
    // So when wizard footer clicks on the Next Button this component can perform its own workflow
    EVENT_BUS.$on("emitOnNext", (res: any) => {
      res(true);
    });
  }
  private destroyed() {
    // WizardHook: shut off on exit event listner
    EVENT_BUS.$off("emitOnNext");
  }
  get isValidForm() {
    const validate = true;
    // WizardHook: Emit event to sibling wizard footer component
    // to send information about data validation to enable/disable wizard footer
    EVENT_BUS.$emit("validForm", validate);
    return validate;
  }
  public data() {
    return {
      file: File
    };
  }
  private handleFileUpload(fileList: FileList) {
    this.$data.file = fileList[0];
  }
  private uploadCertificate() {
    const formData = new FormData();
    formData.append("pemfile", this.$data.file);
    this.$store.dispatch("sslupload/uploadSSLCerificate", formData);
  }
}
</script>
<style lang="scss" scoped>
</style>
};