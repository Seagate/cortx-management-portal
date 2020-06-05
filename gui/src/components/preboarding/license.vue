<template>
  <v-container class="pa-0 ma-0 col-12 black">
    <div height="70em" class="pl-10 py-5">
      <img :src="require('@/assets/seagate-green.svg/')" />
      <div class="eos-brand-div">
        <img class="ml-3" :src="require('@/assets/lyve-drive-green.svg/')" />
        <span class="ml-1 eos-brand-label">RACK</span>
      </div>
    </div>
    <v-divider class="mx-0 grey darken-3"></v-divider>
    <v-container class="black px-10 pt-5" fluid>
      <div class="ml-4 mt-4 white--text">
        To set up your system, you must accept the EULA.
      </div>
      <div class="ml-4 mt-1 mb-8 white--text">
        Click Get started to agree
        <span class="csmprimary--text">EULA.</span>
      </div>
        <button
        type="button"
        class="eos-btn-primary-dark ml-4"
        @click="showLicenseAgreement = true"
      >
        <span>Get started</span>
      </button>
      <LicenseAgreement
        @accepted="licenseAcceptedOrClosed"
        v-if="showLicenseAgreement"
      ></LicenseAgreement>
    </v-container>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import LicenseAgreement from "./license-agreement.vue";

@Component({
  name: "eos-welcome",
  components: { LicenseAgreement }
})
export default class EosLicense extends Vue {
  private data() {
    return {
      showLicenseAgreement: false,
      getStarted: false
    };
  }

  private licenseAcceptedOrClosed(status: boolean) {
    if (status) {
      this.gotToNextPage();
    } else {
      this.$data.showLicenseAgreement = false;
    }
  }

  private gotToNextPage() {
    this.$router.push("adminuser");
  }
}
</script>
<style lang="scss" scoped>
.eos-form-group {
  width: 500px;
  min-height: 88px;
}
</style>
