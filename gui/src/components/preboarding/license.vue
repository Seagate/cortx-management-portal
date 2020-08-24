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
  <v-container class="pa-0 ma-0 col-12 black black-container-height">
    <div class="cortx-header pl-10 py-3">
      <div class="cortx-brand-logo"></div>
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
