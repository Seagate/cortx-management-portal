/*****************************************************************************
 Filename:          udx.vue
 Description:       UDX Component

 Creation Date:     28/10/2019
 Author:            Sri Bhargav Metta

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <div class="eos-p-2">
    <EosUDXDetails v-if="udx" :udx="udx" />
    <EosUDXRegistration v-if="showUDXRegistrationForm" @complete="registrationComplete()" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { UDX } from "../../models/udx";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import EosUDXDetails from "./eos-udx-details.vue";
import EosUDXRegistration from "./eos-udx-registration.vue";

@Component({
  name: "eos-udx",
  components: { EosUDXDetails, EosUDXRegistration }
})
export default class EosUDX extends Vue {
  public udx: UDX | null = null;
  public isUDXRegistered: boolean = false;
  public showUDXRegistrationForm: boolean = false;

  public async mounted() {
    await this.getRegistrationStatus();
    if (this.isUDXRegistered) {
      await this.getUDXDetails();
    } else {
      this.showUDXRegistrationForm = true;
    }
  }

  public async getUDXDetails() {
    this.$store.dispatch("systemConfig/showLoader", "Fetching UDX details...");
    const res = await Api.getAll(apiRegister.udx_device);
    if (res && res.data && res.data.length > 0) {
      this.udx = res.data[0];
    }
    this.$store.dispatch("systemConfig/hideLoader");
  }

  public async registrationComplete() {
    this.showUDXRegistrationForm = false;
    await this.getUDXDetails();
  }

  private async getRegistrationStatus() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      "Checking registration status..."
    );
    try {
      const res = await Api.getAll(apiRegister.udx_registration);
      this.isUDXRegistered = true;
    } catch (e) {
      this.isUDXRegistered = false;
    }
    this.$store.dispatch("systemConfig/hideLoader");
  }
}
</script>
<style lang="scss" scoped>
</style>
