<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="font-weight-bold mt-5">
        Source:
        <label class="eos-rdb-container ml-9">
          Manual
          <input type="radio" name="source" v-model="source" value="manual" />
          <span class="eos-rdb-tick" id="lblIp4Manual"></span>
        </label>
        <label class="eos-rdb-container ml-6">
          DHCP
          <input
            type="radio"
            name="DHCP"
            v-model="source"
            value="DHCP"
            id="txtIP4DHCP"
          />
          <span class="eos-rdb-tick" id="lblIp4DHCP"></span>
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
                class="eos-form-group eos-form-group-custom"
                :class="{
                  'eos-form-group--error': node.ip_address.$error
                }"
              >
                <input
                  class="eos-form__input_text"
                  type="text"
                  :id="node.$model.id + 'txtMngmtNetworkIpv4Ipaddress'"
                  :name="node.$model.id + 'ipaddress'"
                  v-model.trim="node.ip_address.$model"
                  @input="node.ip_address.$touch"
                />
                <div class="eos-form-group-label eos-form-group-error-msg">
                  <label
                    v-if="node.ip_address.$dirty && !node.ip_address.required"
                    >IP address is required</label
                  >
                  <label
                    v-else-if="
                      node.ip_address.$dirty && !node.ip_address.ipAddress
                    "
                    >Invalid IP address</label
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
              class="eos-form-group eos-form-group-custom mt-3"
              :class="{
                'eos-form-group--error': node.ip_address.$error
              }"
            >
              <input
                v-on:change="setipAddress"
                class="eos-form__input_text"
                type="text"
                :id="node.$model.id + 'txtDataNetworkIpv4Ipaddress'"
                :name="node.$model.id + 'ipaddress'"
                v-model.trim="node.ip_address.$model"
                @input="node.ip_address.$touch"
              />
              <div class="eos-form-group-label eos-form-group-error-msg">
                <label
                  v-if="node.ip_address.$dirty && !node.ip_address.required"
                  >IP address is required</label
                >
                <label
                  v-else-if="
                    node.ip_address.$dirty && !node.ip_address.ipAddress
                  "
                  >Invalid IP address</label
                >
              </div>
            </div>

            <div
              class="eos-form-group eos-form-group-custom mt-3"
              :class="{
                'eos-form-group--error': node.netmask.$error
              }"
            >
              <input
                v-on:change="setNetmask"
                class="eos-form__input_text"
                type="text"
                :id="node.$model.id + 'txtDataNetworkIpv4netmask'"
                :name="node.$model.id + 'netmask'"
                v-model.trim="node.netmask.$model"
                @input="node.netmask.$touch"
              />
              <div class="eos-form-group-label eos-form-group-error-msg">
                <label v-if="node.netmask.$dirty && !node.netmask.required"
                  >Netmask is required</label
                >
                <label
                  v-else-if="node.netmask.$dirty && !node.netmask.ipAddress"
                  >Invalid netmask</label
                >
              </div>
            </div>

            <div
              class="eos-form-group eos-form-group-custom mt-3"
              :class="{
                'eos-form-group--error': node.gateway.$error
              }"
            >
              <input
                v-on:change="setGateway"
                class="eos-form__input_text"
                type="text"
                :id="node.$model.id + 'txtDataNetworkIpv4Gateway'"
                :name="node.$model.id + 'gateway'"
                v-model.trim="node.gateway.$model"
                @input="node.gateway.$touch"
              />
              <div class="eos-form-group-label eos-form-group-error-msg">
                <label v-if="node.gateway.$dirty && !node.gateway.ipAddress"
                  >Invalid gateway</label
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
      class="eos-btn-primary eos-float-l my-10"
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
  name: "eos-data-network-ipv4-config"
})
export default class EosDataNetworkIpv4Config extends Vue {
  @Validations()
  private validations = {
    ipv4Nodes: {
      $each: {
        ip_address: {
          required: requiredIf(function(this: any, form) {
            return this.$data.source === "manual";
          }),
          ipAddress
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
  private setipAddress(e: any) {
    if (!this.$v.ipv4Nodes.$model[1].ip_address) {
      this.$v.ipv4Nodes.$model[1].ip_address = e.target.value;
    }
    if (!this.$v.ipv4Nodes.$model[2].ip_address) {
      this.$v.ipv4Nodes.$model[2].ip_address = e.target.value;
    }
  }
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
