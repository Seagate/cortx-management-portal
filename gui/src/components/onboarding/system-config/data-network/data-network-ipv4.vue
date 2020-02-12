<template>
  <v-container class="mt-0 ml-0 pt-0">
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblIpv4Dns">
        Data network settings: IPv4
      </div>
      <div class="mt-6" id="lblIpv4Msg">
        You need to configure a single IP address for management of this system.
      </div>
      <v-divider class="mt-2" />
      <div class="font-weight-bold mt-6">Source</div>
      <div class="mt-4">
        <label class="eos-rdb-container">
          Manual
          <input type="radio" name="source" v-model="source" value="manual" />
          <span class="eos-rdb-tick" id="lblIp4Manual"></span>
        </label>
        <label class="eos-rdb-container ml-10">
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
      <!-- node block -->
      <div class="row mt-5">
        <template v-for="node in $v.ipv4Nodes.$each.$iter">
          <div class="col-3 body-2   column node-container mr-5" :key="node.id">
            <span class="font-weight-bold" id="lblIpv4Node"
              > {{ node.$model.name }}</span
            >
            <v-divider class="mt-2" />
            <div
              v-if="source == 'manual'"
              class="mt-3"
              :class="{
                'eos-form-group--error': node.ip_address.$error
              }"
            >
              <input
                class="eos-form__input_text"
                type="text"
                :id="node.$model.id + 'txtDataNetworkIpv4Ipaddress'"
                :name="node.$model.id + 'ipaddress'"
                v-model.trim="node.ip_address.$model"
                @input="node.ip_address.$touch"
                  placeholder="IP address"
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
              class="mt-3"
              :class="{
                'eos-form-group--error': node.hostname.$error
              }"
            >
              <input
                class="eos-form__input_text"
                :id="node.$model.id + 'txtDataNetworkIpv4hostname'"
                :name="node.$model.id + 'ipaddress'"
                v-model.trim="node.hostname.$model"
                @input="node.hostname.$touch"
                  placeholder="Hostname"
              />
              <div class="eos-form-group-label eos-form-group-error-msg">
                <label v-if="node.hostname.$dirty && !node.hostname.required"
                  >Hostname is required</label
                >
              </div>
            </div>
            <div
                class="mt-3"
                :class="{
                  'eos-form-group--error': node.netmask.$error
                }"
              >
                <input
                  class="eos-form__input_text"
                  type="text"
                  :id="node.$model.id + 'txtDataNetworkIpv4netmask'"
                  :name="node.$model.id + 'netmask'"
                  v-model.trim="node.netmask.$model"
                  @input="node.netmask.$touch"
                  placeholder="Netmask"
                />
                <div class="eos-form-group-label eos-form-group-error-msg">
                  <label v-if="node.netmask.$dirty && !node.netmask.required">Netmask is required</label>
                  <label
                    v-else-if="
                      node.netmask.$dirty && !node.netmask.ipAddress
                    "
                  >Invalid IP address</label>
                </div>
              </div>
             <div
                class="mt-3"
                :class="{
              'eos-form-group--error': node.gateway.$error
            }"
              >
                <input
                  class="eos-form__input_text"
                  type="text"
                  :id="node.$model.id + 'txtDataNetworkIpv4Gateway'"
                  :name="node.$model.id + 'gateway'"
                  v-model.trim="node.gateway.$model"
                  @input="node.gateway.$touch"
                  placeholder="Gateway"
                />
                <div class="eos-form-group-label eos-form-group-error-msg">
                  <label v-if="node.gateway.$dirty && !node.gateway.required">Gateway is required</label>
                  <label
                    v-else-if="
                      node.gateway.$dirty && !node.gateway.ipAddress "
                  >Invalid IP address</label>
                </div>
              </div>
          </div>
        </template>
      </div>
      <span class="d-none">{{ isValidForm }}</span>
    </div>
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
  name: "eos-data-network-ipv4"
})
export default class EosDataNetworkIpv4 extends Vue {
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
        hostname: {
          required,
        },
        netmask: {
          required,
          ipAddress
        },
        gateway: {
          required,
          ipAddress
        }
      }
    }
  };

  private data() {
    return {
      ipv4VipAddress: "",
      ipv4VipHostname: "",
      ipv4Netmask: "",
      ipv4Gateway: "",
        ipv4Nodes: [
        {
          id: 2,
          name: "VIP",
          ip_address: "",
          hostname: "",
          netmask: "",
          gateway: ""
        },
        {
          id: 0,
          name: "Node 0",
          ip_address: "",
          hostname: "",
          netmask: "",
          gateway: ""
        },
        {
          id: 1,
          name: "Node 1",
          ip_address: "",
          hostname: "",
          netmask: "",
          gateway: ""
        }
      ],
      source: "manual",
      isValid: true
    };
  }

  private updateDataNetworkConfig() {
    const queryParams: DataNetworkIpv4 = {
      is_dhcp: this.$data.source === "DHCP",
      nodes: this.$data.ipv4Nodes
    };
    console.log(queryParams,'jjj');
    return this.$store.dispatch(
      "systemConfig/updateDataNetworkSettingIpv4",
      queryParams
    );
  }
  private mounted() {
    this.dataNetworkGetter();
    // WizardHook: Open a listener for onNext event
    // So when wizard footer clicks on the Next Button this component can perform its own workflow
    EVENT_BUS.$on("emitOnNext", (res: any) => {
      this.updateDataNetworkConfig().then(result => {
        res(true);
      });
    });
  }
  private destroyed() {
    // WizardHook: shut off on exit event listner
    EVENT_BUS.$off("emitOnNext");
  }
  get isValidForm() {
    const validate = true;
    // WizardHook: Emit event to sibling wizard footer component
    // to send information about data validation to enable/disable wizard footer
    EVENT_BUS.$emit("validForm", !this.$v.$invalid);
    return validate;
  }
  private dataNetworkGetter(): any {
    // const systemconfig = this.$store.getters["systemConfig/systemconfig"];
    // const dataNetworkSettings = systemconfig.data_network_settings;
    // if (
    //   dataNetworkSettings &&
    //   dataNetworkSettings.ipv4 &&
    //   dataNetworkSettings.ipv4.nodes
    // ) {
    //   this.$data.ipv4Nodes = dataNetworkSettings.ipv4.nodes;
    //   this.$data.source =
    //     dataNetworkSettings.ipv4.is_dhcp === true ? "DHCP" : "manual";
    //   this.$data.ipv4VipAddress = dataNetworkSettings.ipv4.vip_address;
    //   this.$data.ipv4VipHostname = dataNetworkSettings.ipv4.vip_hostname;
    //   this.$data.ipv4Netmask = dataNetworkSettings.ipv4.netmask;
    //   this.$data.ipv4Gateway = dataNetworkSettings.ipv4.gateway;
    // }
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
