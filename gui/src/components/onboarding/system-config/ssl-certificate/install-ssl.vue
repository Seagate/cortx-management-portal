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
    <button
      :disabled="!installStatus"
      id="btnInstallFirmware"
      type="button"
      class="eos-btn-primary"
      @click="openConfirmDialog()"
    >
      Install certificate
    </button>
    <eos-confirmation-dialog
      id="ssl-dialogbox"
      :show="showConfirmDialog"
      title="Confirmation"
      message="Click Yes to install the SSL certificate. After installing the SSL certificate, you must login again."
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
    const res = Api.post(apiRegister.ssl_install, install);
    this.$store.dispatch("systemConfig/hideLoader");
  }
}
</script>
<style lang="scss" scoped></style>
