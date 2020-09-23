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
  <div>
    <v-container>
      <div class="cortx-modal-container">
        <div class="cortx-modal cortx-modal-onboarding">
          <div class="cortx-modal-header">
            <label id="agreement-title"> {{ agreementText.title }}</label>
            <img
              id="license-cancelagreementicon"
              class="cortx-modal-close"
              :src="require('@/assets/close-green.svg')"
              @click="cancelAgreement"
            />
          </div>
          <div class="cortx-modal-body ">
            <div class="title-container pr-3" id="agreement-data">
              <div v-html="agreementText.description" id="agreement-discription"></div>
            </div>
            <div class="mt-5 nav-btn">
              <button
                id="license-acceptagreement"
                type="button"
                class="cortx-btn-primary mr-2"
                @click="acceptAgreement"
              >
                {{ $t("common.accept") }}
              </button>

              <button
                id="license-cancelagreementbtn"
                type="button"
                class="cortx-btn-tertiary"
                @click="cancelAgreement"
              >
                {{ $t("common.cancel") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { agreementText } from "./../../common/license-agreement-text";
import i18n from "./../../i18n";

@Component({
  name: "cortx-onboarding-finish"
})
export default class CortxOnboardingFinish extends Vue {
  private data() {
    return {
      agreementText
    };
  }
  private acceptAgreement() {
    this.$emit("accepted", true);
  }
  private cancelAgreement() {
    this.$emit("accepted", false);
  }
}
</script>

<style lang="scss" scoped>
.cortx-modal-onboarding {
  width: 730px;
  min-height: 214px;
  height: 535px;
  position: fixed;
}
.nav-btn {
  text-align: right;
}
.finish-text {
  vertical-align: center;
  float: left;
}
.success-img {
  margin-top: 3px;
  float: left;
}
.title-container {
  height: 376px;
  overflow: auto;
  text-align: justify;
}
</style>
