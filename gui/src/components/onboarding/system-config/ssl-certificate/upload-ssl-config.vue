<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="mt-6" id="lblVersion"></div>
      <v-divider class="mt-2 mb-5" />
      <input
        type="file"
        id="file"
        ref="file"
        v-on:change="handleFileUpload($event.target.files) " accept =".pem"/>
      <v-divider class="mt-5 mb-2" />
      <div class="mt-8">
        <v-row>
          <v-col cols="12">
            <v-row
            >
              <button
                id="btnUploadSSL"
                type="button"
                class="eos-btn-primary mt-3"
                @click="uploadCertificate()"
              >Upload Certificate</button>
              <span class="ml-7"  v-if="!route">
                <EOSInstallSSL />
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
import { Api } from "./../../../../services/api"
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
  name: "uploade-ssl-config",
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
    if (this.$route.path == "/onboarding") {
      this.$data.route = true;
    } else {
      this.$data.route = false;
    }
    this.$data.route == this.$route.name;
    console.log(this.$data.route == this.$route.name, "component");
    console.log(this.$route, "$route.name");
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
      file: File,
      route: "false"
    };
  }
  private handleFileUpload(fileList: FileList) {
    this.$data.file = fileList[0];
  }
  private async uploadCertificate() {
    const formData = new FormData();
    formData.append("pemfile", this.$data.file);
      const res = await Api.uploadFile(apiRegister.ssl_upload, formData);
  }
}
</script>
<style lang="scss" scoped>
</style>
