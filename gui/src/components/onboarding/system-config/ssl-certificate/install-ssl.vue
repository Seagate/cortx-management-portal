<template>
  <v-container class="mt-0 ml-0">
    <button
      :disabled="!installStatus"
      id="btnInstallFirmware"
      type="button"
      class="eos-btn-primary"
      @click="openConfirmDialog()"
    >Apply Certificate</button>
    <eos-confirmation-dialog
      :show="showConfirmDialog"
      title="Confirmation"
      message="Are you sure you want to install the certifate? If you install certificate you will redirect to login"
      severity="warning"
      @closeDialog="closeConfirmDialog"
      cancelButtonText="No"
    ></eos-confirmation-dialog>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Api } from "./../../../../services/api";
import apiRegister from "./../../../../services/api-register";
import {
  SystemConfigObject,
  DnsNetworkSettings
} from "./../../../../models/system-configuration";
import { EVENT_BUS } from "./../../../../main";
import { Validations } from "vuelidate-property-decorators";
import { required, helpers } from "vuelidate/lib/validators";
@Component({
  name: "eos-install-ssl"
})
export default class EOSInstallSSL extends Vue {
  @Prop({ required: true })
  public installStatus: any;
  private showConfirmDialog: boolean;
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
    return {
      showConfirmDialog: false
    };
  }
  private openConfirmDialog() {
    this.showConfirmDialog = true;
  }
  private async closeConfirmDialog(confirmation: boolean) {
    this.showConfirmDialog = false;
    if (confirmation) {
      await this.installCertificate();
      this.$router.push("/login");
    }
  }
  private async installCertificate() {
    const install = {
      install: true
    };
    this.$store.dispatch(
      "systemConfig/showLoader",
      "certificate installation in progress..."
    );
    const res = Api.patch(apiRegister.ssl_upload, install);
    this.$store.dispatch("systemConfig/hideLoader");
  }
}
</script>
<style lang="scss" scoped>
</style>
};
</script>
<style lang="scss" scoped>
</style>
};