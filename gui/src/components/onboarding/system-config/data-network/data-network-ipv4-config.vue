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
    <div>
      <div class="font-weight-bold mt-5">
        Source:
        <label class="cortx-rdb-container ml-9">
          Manual
          <input type="radio" name="source" v-model="source" value="manual" />
          <span class="cortx-rdb-tick" id="lblIp4Manual"></span>
        </label>
        <label class="cortx-rdb-container ml-6">
          DHCP
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
              <label>VIP*: </label>
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
                  v-model.trim="node.ip_address.$model"
                  @input="node.ip_address.$touch"
                  placeholder="XXX.XXX.XXX.XXX"
                />
                <div class="cortx-form-group-label cortx-form-group-error-msg">
                  <label
                    v-if="node.ip_address.$dirty && !node.ip_address.required"
                    >IP address is required.</label
                  >
                  <label
                    v-else-if="
                      node.ip_address.$dirty && !node.ip_address.ipAddress
                    "
                    >Invalid IP address.</label
                  >
                  <label
                    v-else-if="
                      node.ip_address.$dirty && !node.ip_address.isUnique
                    "
                    >IP address must be unique for VIP and nodes.</label
                  >
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div class="row ma-0 mt-4" v-if="source == 'manual'">
        <div class="col-1 body-2 column pa-0 node-container mr-12">
          <div class="mt-5 font-weight-bold">
            <div class="mt-12">
              <label>IP address*:</label>
            </div>
            <div class="mt-12">
              <label>Netmask*:</label>
            </div>
            <div class="mt-12">
              <label>Gateway:</label>
            </div>
          </div>
        </div>
        <template v-for="node in $v.ipv4Nodes.$each.$iter">
          <div
            class="col-3 body-2 column pa-0 node-container mr-5"
            v-if="node.$model.name !== 'VIP'"
            :key="node.id"
          >
            <span class="font-weight-bold" id="lblIpv4Node">{{
              node.$model.name
            }}</span>
            <v-divider class="mt-2" />
            <div
              class="cortx-form-group cortx-form-group-custom mt-3"
              :class="{
                'cortx-form-group--error': node.ip_address.$error
              }"
            >
              <input
                class="cortx-form__input_text"
                type="text"
                :id="node.$model.id + 'txtDataNetworkIpv4Ipaddress'"
                :name="node.$model.id + 'ipaddress'"
                v-model.trim="node.ip_address.$model"
                @input="node.ip_address.$touch"
                placeholder="XXX.XXX.XXX.XXX"
              />
              <div class="cortx-form-group-label cortx-form-group-error-msg">
                <label
                  v-if="node.ip_address.$dirty && !node.ip_address.required"
                  >IP address is required.</label
                >
                <label
                  v-else-if="
                    node.ip_address.$dirty && !node.ip_address.ipAddress
                  "
                  >Invalid IP address.</label
                >
                <label
                  v-else-if="
                    node.ip_address.$dirty && !node.ip_address.isUnique
                  "
                  >IP address must be unique for VIP and nodes.</label
                >
              </div>
            </div>

            <div
              class="cortx-form-group cortx-form-group-custom mt-3"
              :class="{
                'cortx-form-group--error': node.netmask.$error
              }"
            >
              <input
                v-on:change="setNetmask"
                class="cortx-form__input_text"
                type="text"
                :id="node.$model.id + 'txtDataNetworkIpv4netmask'"
                :name="node.$model.id + 'netmask'"
                v-model.trim="node.netmask.$model"
                @input="node.netmask.$touch"
                placeholder="XXX.XXX.XXX.XXX"
              />
              <div class="cortx-form-group-label cortx-form-group-error-msg">
                <label v-if="node.netmask.$dirty && !node.netmask.required"
                  >Netmask is required.</label
                >
                <label
                  v-else-if="node.netmask.$dirty && !node.netmask.ipAddress"
                  >Invalid netmask.</label
                >
              </div>
            </div>

            <div
              class="cortx-form-group cortx-form-group-custom mt-3"
              :class="{
                'cortx-form-group--error': node.gateway.$error
              }"
            >
              <input
                v-on:change="setGateway"
                class="cortx-form__input_text"
                type="text"
                :id="node.$model.id + 'txtDataNetworkIpv4Gateway'"
                :name="node.$model.id + 'gateway'"
                v-model.trim="node.gateway.$model"
                @input="node.gateway.$touch"
                placeholder="XXX.XXX.XXX.XXX"
              />
              <div class="cortx-form-group-label cortx-form-group-error-msg">
                <label v-if="node.gateway.$dirty && !node.gateway.ipAddress"
                  >Invalid gateway.</label
                >
              </div>
            </div>
          </div>
        </template>
      </div>
      <span class="d-none">{{ isValidForm }}{{ dataNetworkGetter }}</span>
    </div>
    <button
      type="button"
      v-if="$route.path !== '/onboarding'"
      :disabled="$v.$invalid"
      @click="applySettings()"
      class="cortx-btn-primary cortx-float-l my-10"
    >
      Apply
    </button>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import {
  SystemConfigObject,
  DataNetworkIpv4
} from "./../../../../models/system-configuration";
import { Validations } from "vuelidate-property-decorators";
import {
  required,
  helpers,
  sameAs,
  ipAddress,
  requiredIf
} from "vuelidate/lib/validators";
import { EVENT_BUS } from "./../../../../main";
@Component({
  name: "cortx-data-network-ipv4-config"
})
export default class CortxDataNetworkIpv4Config extends Vue {
  @Validations()
  private validations = {
    ipv4Nodes: {
      $each: {
        ip_address: {
          required: requiredIf(function(this: any, form) {
            if (
              this.$data.source === "manual" ||
              (this.$data.source === "DHCP" && form.name === "VIP")
            ) {
              return true;
            }
            return false;
          }),
          ipAddress,
          isUnique(value: string) {
            // If IP address is not set
            if (!value) {
              return true;
            }
            // Check if IP address is already assigned to VIP, Node 0 or Node 1
            const vueInstance: any = this;
            return (
              vueInstance.$data.ipv4Nodes.filter(
                (e: any) => e.ip_address === value
              ).length === 1
            );
          }
        },
        gateway: {
          ipAddress
        },
        netmask: {
          required: requiredIf(function(this: any, form) {
            return this.$data.source === "manual";
          }),
          ipAddress
        }
      }
    }
  };
  private setNetmask(e: any) {
    let target = e.target.value;
    if (!e.target.value) {
      target = null;
    }
    if (!this.$v.ipv4Nodes.$model[1].netmask) {
      this.$v.ipv4Nodes.$model[1].netmask = target;
    }
    if (!this.$v.ipv4Nodes.$model[2].netmask) {
      this.$v.ipv4Nodes.$model[2].netmask = target;
    }
  }
  private setGateway(e: any) {
    let target = e.target.value;
    if (!e.target.value) {
      target = null;
    }
    if (!this.$v.ipv4Nodes.$model[1].gateway) {
      this.$v.ipv4Nodes.$model[1].gateway = target;
    }
    if (!this.$v.ipv4Nodes.$model[2].gateway) {
      this.$v.ipv4Nodes.$model[2].gateway = target;
    }
  }
  private data() {
    return {
      ipv4Nodes: [
        {
          id: 2,
          name: "VIP",
          ip_address: null,
          netmask: "0.0.0.0",
          gateway: null
        },
        {
          id: 0,
          name: "Node 0",
          ip_address: null,
          netmask: null,
          gateway: null
        },
        {
          id: 1,
          name: "Node 1",
          ip_address: null,
          netmask: null,
          gateway: null
        }
      ],
      source: "manual",
      isValid: true
    };
  }

  private getDataNetworkQueryParams() {
    let queryParams: DataNetworkIpv4 = {
      is_dhcp: false,
      nodes: this.$data.ipv4Nodes
    };
    if (this.$data.source === "DHCP") {
      queryParams = {
        is_dhcp: true,
        nodes: this.$data.ipv4Nodes.filter((node: any) => node.name === "VIP")
      };
    }
    return queryParams;
  }
  private updateDataNetworkConfig() {
    const queryParams = this.getDataNetworkQueryParams();
    return this.$store.dispatch(
      "systemConfig/updateDataNetworkSettingIpv4",
      queryParams
    );
  }
  private mounted() {
    // WizardHook: Open a listener for onNext event
    // So when wizard footer clicks on the Next Button this component can perform its own workflow
    EVENT_BUS.$on("emitOnNext", (res: any) => {
      this.updateDataNetworkConfig().then(result => {
        res(true);
      });
    });
  }
  private destroyed() {
    // WizardHook: shut off on exit event listener
    EVENT_BUS.$off("emitOnNext");
  }
  get isValidForm() {
    const validate = true;
    // WizardHook: Emit event to sibling wizard footer component
    // to send information about data validation to enable/disable wizard footer
    EVENT_BUS.$emit("validForm", !this.$v.$invalid);
    return validate;
  }
  get dataNetworkGetter(): any {
    const systemconfig = this.$store.getters["systemConfig/systemconfig"];
    const dataNetworkSettings = systemconfig.data_network_settings;
    if (
      dataNetworkSettings &&
      dataNetworkSettings.ipv4 &&
      dataNetworkSettings.ipv4.nodes &&
      Array.isArray(dataNetworkSettings.ipv4.nodes) &&
      dataNetworkSettings.ipv4.nodes.length
    ) {
      this.$data.ipv4Nodes = this.$data.ipv4Nodes.map((node: any) => {
        const nodeData = dataNetworkSettings.ipv4.nodes.find(
          (e: any) => e.name === node.name
        );
        return nodeData ? nodeData : node;
      });
      this.$data.source =
        dataNetworkSettings.ipv4.is_dhcp === true ? "DHCP" : "manual";
    }
    return true;
  }
  private applySettings() {
    const queryParams = this.getDataNetworkQueryParams();
    this.$emit("apply-settings", queryParams);
  }
}
</script>
<style lang="scss" scoped>
.pointer {
  cursor: pointer;
}
.node-container {
  max-width: 25em;
}
</style>
