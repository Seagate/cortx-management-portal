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
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblDataNetwork">
        Data network settings
      </div>
      <div class="mt-3" id="lblMsg">
        Use the data network settings to setup your system.
      </div>
      <v-divider class="mt-2" />
      <div class="mt-6">
        <label class="cortx-ckb-container">
          IPv4
          <input
            type="checkbox"
            :disabled="isSkip"
            v-model="isDataipV4Status"
            name="ipv4"
            id="chkDNSisipV4Status"
          />
          <span class="cortx-ckb-tick" id="lblDNsIpv4"></span>
        </label>
      </div>
      <div class="mt-2" id="lblDNSSetting">
        Configure the IPv4 settings.
      </div>
      <div class="mt-6">
        <label class="cortx-ckb-container">
          Skip data network settings
          <input
            type="checkbox"
            @change="isSkipNetworkSettings()"
            :disabled="isDataipV6Status || isDataipV4Status"
            v-model="isSkip"
            name="skip"
            id="chkDNSSkip"
          />
          <span class="cortx-ckb-tick" id="lblSkipManagmentSetting"></span>
        </label>
      </div>
      <div class="mt-2" id="lblMsgSkipStep">
        You can skip this step if your data network settings are already
        complete.
      </div>
      <v-divider class="mt-8" />
    </div>
    <span class="d-none">{{ isValidForm }}</span>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { EVENT_BUS } from "./../../../../main";

@Component({
  name: "cortx-data-network"
})
export default class CortxDataNetwork extends Vue {
  public data() {
    return {
      loadbalancer: "internal",
      isSkip: false
    };
  }
  public mounted() {
    // WizardHook: Open a listener for onNext event
    // So when wizard footer clicks on the Next Button this component can perform its own workflow
    EVENT_BUS.$on("emitOnNext", (res: any) => {
      res(true);
    });
  }
  public destroyed() {
    // WizardHook: shut off on exit event listner
    EVENT_BUS.$off("emitOnNext");
  }
  get isValidForm() {
    const validate = true;
    // WizardHook: Emit event to sibling wizard footer component
    // to send information about data validation to enable/disable wizard footer
    EVENT_BUS.$emit(
      "validForm",
      this.isDataipV6Status || this.isDataipV4Status || this.$data.isSkip
    );
    return validate;
  }
  public get isDataipV4Status(): any {
    return this.$store.getters["systemConfig/isDataipV4Status"];
  }
  public set isDataipV4Status(status: any) {
    this.$store.commit("systemConfig/setDataNetworkSettings", {
      type: "ipV4",
      flag: status
    });
  }

  public get isDataipV6Status(): any {
    return this.$store.getters["systemConfig/isDataipV6Status"];
  }
  public set isDataipV6Status(status: any) {
    this.$store.commit("systemConfig/setDataNetworkSettings", {
      type: "ipV6",
      flag: status
    });
  }
  public isSkipNetworkSettings() {
    this.$store.commit("systemConfig/setDataNetworkSettings", {
      type: "ipV6",
      flag: false
    });

    this.$store.commit("systemConfig/setDataNetworkSettings", {
      type: "ipV4",
      flag: false
    });
  }
}
</script>
<style lang="scss" scoped>
.pointer {
  cursor: pointer;
}
</style>
