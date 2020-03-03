<template>
  <v-container>
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblIpv4Dns">SSL Upload</div>
      <div
        class="mt-6"
        id="lblIpv4Msg"
      >You need to upload ssl and key certificate here</div>
      <v-card class="col-10 pb-5 mt-10 elevation-0" outlined tile>
        <v-row class="resource-container mt-5">
          <v-col>
            <label
              class="eos-form-group-label ml-10 mt-5"
              for="Resource"
              style=" font-size: 1em;"
            >Upload SSL Certificate</label>
          </v-col>
          <v-col>
            <button type="button" class="eos-btn-primary" @click="uploadSSLCertificate()">Upload</button>
          </v-col>
        </v-row>
        <v-row class="resource-container mt-5">
          <v-col>
            <label
              class="eos-form-group-label ml-10 mt-5"
              for="Resource"
              style=" font-size: 1em;"
            >Upload Key Certificate</label>
          </v-col>
          <v-col>
            <button type="button" class="eos-btn-primary" @click="uploadKeyCertificate()">Upload</button>
          </v-col>
        </v-row>
      </v-card>
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
  private data() {
    return {};
  }
}
</script>
<style lang="scss" scoped>
</style>
