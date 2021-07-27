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
  <v-container class="pa-0 ma-0 col-12 black black-container-height" v-feature="unsupportedFeatures.licence_agreement">
    <div class="cortx-header pl-10 py-3">
      <div class="cortx-brand-logo"></div>
    </div>
    <v-divider class="mx-0 grey darken-3"></v-divider>
    <v-container class="black px-10 pt-5" fluid>
      <div class="ml-4 mt-4 white--text mb-5">
        {{ $t("license.header") }}
      </div>
      <button
        id="show-license-agreement-dialogbtn"
        type="button"
        class="cortx-btn-primary-dark ml-4"
        @click="showLicenseAgreement = true"
      >
        <span>{{ $t("license.getStarted") }}</span>
      </button>
      <LicenseAgreement
       id="license-agreement-close"
        @accepted="licenseAcceptedOrClosed"
        v-if="showLicenseAgreement"
      ></LicenseAgreement>
    </v-container>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import LicenseAgreement from "./license-agreement.vue";
import i18n from "./preboarding.json";
import { unsupportedFeatures } from "../../common/unsupported-feature"

@Component({
  name: "cortx-welcome",
  components: { LicenseAgreement },
  i18n: {
    messages: i18n
  }
})
export default class CortxLicense extends Vue {
  public unsupportedFeatures = unsupportedFeatures;
  
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
    this.$router.push("login");
  }
}
</script>
<style lang="scss" scoped>
.cortx-form-group {
  width: 500px;
  min-height: 88px;
}
</style>
