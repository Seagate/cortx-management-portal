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
    <EosUDXDetails v-if="udx" />
    <EosUDXRegistration v-else @complete="registrationComplete()" />
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

  public async mounted() {
    await this.getUDXDetails();
  }

  public async getUDXDetails() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      "Fetching UDX details..."
    );
    const res = await Api.getAll(apiRegister.udx_device);
    if (res && res.data && res.data.length > 0) {
      this.udx = res.data[0];
    }
    this.$store.dispatch("systemConfig/hideLoader");
  }

  public async registrationComplete() {
    await this.getUDXDetails();
  }
}
</script>
<style lang="scss" scoped>
</style>
