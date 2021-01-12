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
  <v-container class="mt-6 body-2">
    <v-img
      id="alert-img"
      :src="require('./../../../../assets/onboarding-wizard.png')"
      width="780px"
      height="70px"
    ></v-img>
    <v-divider />
    <div>
      <div class="title mt-6 csmprimary--text" id="lblInterface">
        {{ $t("onBoarding.interfaceSelection") }}
      </div>
    </div>
    <div class="mt-4">
      <div class="font-weight-regular black--text" id="lblInterfaceMsg">
        {{ $t("onBoarding.selectObjectBased") }}
      </div>

      <div
        class="mt-5 font-weight-regular black--text"
        id="lblInterfaceMsgChoose"
      >
        {{ $t("onBoarding.chooseWhichInterface") }}
      </div>
      <v-divider class="mt-5" />
      <div class="mt-5">
        <input
          type="checkbox"
          @change="s3"
          v-model="s3"
          name="s3"
          id="chkInterfaceS3"
        />
        <span
          class="ml-3 font-weight-medium csmprimary--text"
          id="lblInterfaceChooseStorage"
          >{{ $t("onBoarding.objectBasedStorage") }}</span
        >
        <div
          class="mt-5 font-weight-regular black--text"
          id="lblInterfaceConfig"
        >
          {{ $t("onBoarding.startConfigObjectBased") }}
        </div>
      </div>
      <div class="mt-5">
        <input
          type="checkbox"
          @change="nfs"
          v-model="nfs"
          name="nfs"
          id="txtInterfaceNfs"
        />
        <span
          class="ml-3 font-weight-medium csmprimary--text"
          id="lblInterfaceNFS"
          >{{ $t("onBoarding.NFS") }}</span
        >
        <div class="mt-5 font-weight-regular black--text">
          {{ $t("onBoarding.startConfigNFS") }}
        </div>
      </div>
    </div>
    <v-divider class="mt-8" />
    <div class="mt-3">
      <v-btn
        elevation="0"
        color="csmprimary"
        @click="gotToNextPage()"
        id="btnInterfaceContinue"
      >
        <span class="white--text">{{ $t("onBoarding.continue") }}</span>
      </v-btn>
      <span
        class="csmprimary--text ml-8 pointer"
        @click="gotToPrevPage()"
        id="lblInterfaceBack"
        >{{ $t("onBoarding.BackToPreviousStep") }}</span
      >
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import i18n from "../../onboarding.json";

@Component({
  name: "cortx-interface-select",
  i18n: {
    messages: i18n
  }
})
export default class CortxInterfaceSelect extends Vue {
  private data() {
    return {
      s3: false,
      nfs: false
    };
  }
  private gotToNextPage() {
    // this.$router.push("notificationsemail");
  }
  private gotToPrevPage() {
    if (this.$store.getters["systemConfig/isSysLogSettingsStatus"] === true) {
      this.$router.push("notificationssyslog");
    } else if (
      this.$store.getters["systemConfig/isEmailSettingsStatus"] === true
    ) {
      this.$router.push("notificationsemail");
    } else {
      this.$router.push("notifications");
    }
  }
}
</script>
<style lang="scss" scoped>
.input-text {
  border-style: solid;
  border-width: 1px;
  border-color: #e3e3e3;
  width: 20em;
  height: 2.5em;
}
.pointer {
  cursor: pointer;
}
</style>
