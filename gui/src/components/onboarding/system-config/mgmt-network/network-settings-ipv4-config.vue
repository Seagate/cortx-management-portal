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
      <div class="font-weight-bold mt-5" id="lblIp4Source">
        {{ $t("common.source") }}:
        <label class="cortx-rdb-container ml-9">
          {{ $t("onBoarding.DHCP") }}
          <input
            type="radio"
            name="DHCP"
            v-model="source"
            value="DHCP"
            id="txtIP4DHCP"
          />
          <span class="cortx-rdb-tick" id="lblIp4DHCP"></span>
        </label>
      </div>
      <div class="row ma-0">
        <div class="col-1 body-2 column pa-0 node-container">
          <div class="mt-5 font-weight-bold">
            <div class="mt-7">
              <label>{{ $t("onBoarding.VIP") }}*: </label>
            </div>
          </div>
        </div>
        <template v-for="node in $v.ipv4Nodes.$each.$iter">
          <div
            class="col-3 body-2 column pa-0 node-container"
            v-if="node.$model.name === 'VIP'"
            :key="node.id"
          >
            <div class="mt-5">
              <div
                class="cortx-form-group cortx-form-group-custom"
                :class="{
                  'cortx-form-group--error': node.ip_address.$error
                }"
              >
                <input
                  class="cortx-form__input_text"
                  type="text"
                  :id="node.$model.id + 'txtMngmtNetworkIpv4Ipaddress'"
                  :name="node.$model.id + 'ipaddress'"
                  placeholder="XXX.XXX.XXX.XXX"
                  v-model.trim="node.ip_address.$model"
                  @input="node.ip_address.$touch"
                />
                <div class="cortx-form-group-label cortx-form-group-error-msg">
                  <label
                    v-if="node.ip_address.$dirty && !node.ip_address.required"
                    >{{ $t("onBoarding.ipAddressReq") }}</label
                  >
                  <label
                    v-else-if="
                      node.ip_address.$dirty && !node.ip_address.ipAddress
                    "
                    >{{ $t("onBoarding.invalidIpAddress") }}</label
                  >
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <span class="d-none">{{ isValidForm }}{{ managementNetworkGetter }}</span>
    <button
      type="button"
      v-if="$route.path !== '/onboarding'"
      :disabled="$v.$invalid"
      @click="applySettings()"
      class="cortx-btn-primary cortx-float-l my-10"
    >
      {{ $t("common.apply") }}
    </button>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Validations } from "vuelidate-property-decorators";
import {
  required,
  helpers,
  sameAs,
  ipAddress,
  requiredIf
} from "vuelidate/lib/validators";
import { mapState } from "vuex";
import {
  SystemConfigObject,
  Ipv4
} from "./../../../../models/system-configuration";
import { EVENT_BUS } from "./../../../../main";
import i18n from "../.././../../i18n";

@Component({
  name: "cortx-network-settings-ipv4-config"
})
export default class CortxNetworkSettingsIpv4Config extends Vue {
  @Validations()
  private validations = {
    ipv4Nodes: {
      $each: {
        ip_address: {
          required,
          ipAddress
        }
      }
    }
  };
  private data() {
    return {
      source: "DHCP",
      systemConfigObject: {} as SystemConfigObject,
      isValid: true,
      ipv4Nodes: [
        {
          id: 2,
          name: "VIP",
          ip_address: ""
        }
      ]
    };
  }

  private mounted() {
    // WizardHook: Open a listener for onNext event
    // So when wizard footer clicks on the Next Button this component can perform its own workflow
    EVENT_BUS.$on("emitOnNext", (res: any) => {
      this.updateIpv4Config().then(result => {
        res(true);
      });
    });
  }
  private destroyed() {
    // WizardHook: shut off on exit event listener
    EVENT_BUS.$off("emitOnNext");
  }
  get isValidForm() {
    // WizardHook: Emit event to sibling wizard footer component
    // to send information about data validation to enable/disable wizard footer
    EVENT_BUS.$emit("validForm", !this.$v.$invalid);
    return true;
  }
  get managementNetworkGetter(): any {
    const systemconfig = this.$store.getters["systemConfig/systemconfig"];
    const mngmtNetworkSettings = systemconfig.management_network_settings;
    if (
      mngmtNetworkSettings &&
      mngmtNetworkSettings.ipv4 &&
      mngmtNetworkSettings.ipv4.nodes
    ) {
      this.$data.source =
        mngmtNetworkSettings.ipv4.is_dhcp === true ? "DHCP" : "manual";
      this.$data.ipv4Nodes = mngmtNetworkSettings.ipv4.nodes;
    }
    return true;
  }
  private updateIpv4Config() {
    const queryParams: Ipv4 = {
      is_dhcp: this.$data.source === "DHCP",
      nodes: this.$data.ipv4Nodes
    };
    return this.$store.dispatch("systemConfig/updateMngmtIpv4", queryParams);
  }
  private applySettings() {
    const queryParams: Ipv4 = {
      is_dhcp: this.$data.source === "DHCP",
      nodes: this.$data.ipv4Nodes
    };
    this.$emit("apply-settings", queryParams);
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

.node-container {
  max-width: 25em;
}
</style>
