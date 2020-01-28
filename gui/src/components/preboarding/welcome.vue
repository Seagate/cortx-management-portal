<template>
  <v-container class="pa-0 ma-0 col-12 black">
    <div height="70em" class="pl-10 py-5">
      <img src="../../assets/logo.png" />
    </div>
    <v-divider class="mx-0 grey darken-3"></v-divider>
    <v-container class="black px-10 pt-5" fluid>
      <div class="ml-4 white--text headline my-10">
        Welcome to the Storage Management Console.
      </div>
      <div class="ml-4 white--text">
        We will guide you through the first-time setup of your system.
      </div>
      <div class="ml-4 mt-1 mb-8 white--text">
        By clicking the Get Started button, you agree to the
        <span class="csmprimary--text">EULA.</span>
      </div>
      <v-btn
        class=" ml-4"
        outlined
        dark
        elevation="0"
        @click="showLicenseAgreement = true"
      >
        <span>Get Started</span>
      </v-btn>
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
export default class EosWelcome extends Vue {
  private data() {
    return {
      showLicenseAgreement: false
    };
  }
  private licenseAcceptedOrClosed(status: boolean) {
    if (status) {
      this.gotToNextPage();
    } else {
      this.$data.showLicenseAgreement = false;
    }
  }
  public mounted() {
    this.$store.commit("alerts/setOnboardingFlag", false);
  }
  private gotToNextPage() {
    this.$router.push("adminuser");
  }
}
</script>

<style lang="scss" scoped></style>
