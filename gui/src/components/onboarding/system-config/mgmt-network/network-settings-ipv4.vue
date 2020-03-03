<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div
        class="eos-text-lg mt-0 font-weight-bold"
        id="lblNetworkIP4"
      >Management network settings: IPv4</div>
      <div
        class="mt-6"
        id="lblNetworkMsg"
      >You need to configure a single IP address for management of this system.</div>
      <v-divider class="mt-2" />
      <div class="font-weight-bold mt-6" id="lblIp4Source">
        Source
        <label class="eos-rdb-container ml-3">
          Manual
          <input type="radio" name="source" v-model="source" value="manual" />
          <span class="eos-rdb-tick" id="lblIp4Manual"></span>
        </label>
        <label class="eos-rdb-container ml-10">
          DHCP
          <input type="radio" name="DHCP" v-model="source" value="DHCP" id="txtIP4DHCP" />
          <span class="eos-rdb-tick" id="lblIp4DHCP"></span>
        </label>
      </div>
      <div class="row ma-0 mt-3">
        <div class="col-1 body-2 column node-container mr-12">
          <div class="mt-5 font-weight-bold">
            <div class="mt-12" v-if="source == 'manual'">
              <label>IPaddress*</label>
            </div>
            <div class="mt-12">
              <label>Hostname*</label>
            </div>
            <div class="mt-12">
              <label>Netmask*</label>
            </div>
            <div class="mt-12">
              <label>Gateway*</label>
            </div>
          </div>
        </div>
        <template v-for="node in $v.ipv4Nodes.$each.$iter">
          <div class="col-3 body-2 column node-container mr-5" :key="node.id">
            <span class="font-weight-bold" id="lblIpv4Node">{{ node.$model.name}}</span>
            <v-divider class="mt-2" />
            <div class="mt-5">
              <div
                v-if="source == 'manual'"
                class
                :class="{
                  'eos-form-group--error': node.ip_address.$error
                }"
              >
                <input
                  v-on:change="setipAddress"
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
                  >IP address is required</label>
                  <label
                    v-else-if="
                      node.ip_address.$dirty && !node.ip_address.ipAddress
                    "
                  >Invalid IP address</label>
                </div>
              </div>
              <div
                class="mt-3"
                :class="{
                  'eos-form-group--error': node.hostname.$error
                }"
              >
                <input
                  v-on:change="setHostname"
                  class="eos-form__input_text"
                  type="text"
                  :id="node.$model.id + 'txtMngmtNetworkIpv4Iphostname'"
                  :name="node.$model.id + 'hostname'"
                  v-model.trim="node.hostname.$model"
                  @input="node.hostname.$touch"
                />
                <div class="eos-form-group-label eos-form-group-error-msg">
                  <label v-if="node.hostname.$dirty && !node.hostname.required">Hostname is required</label>
                </div>
              </div>
              <div
                class="mt-3"
                :class="{
                  'eos-form-group--error': node.netmask.$error
                }"
              >
                <input
                  v-on:change="setNetmask"
                  class="eos-form__input_text"
                  type="text"
                  :id="node.$model.id + 'txtMngmtNetworkIpv4netmask'"
                  :name="node.$model.id + 'netmask'"
                  v-model.trim="node.netmask.$model"
                  @input="node.netmask.$touch"
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
                  v-on:change="setGetway"
                  class="eos-form__input_text"
                  type="text"
                  :id="node.$model.id + 'txtMngmtNetworkIpv4Gateway'"
                  :name="node.$model.id + 'gateway'"
                  v-model.trim="node.gateway.$model"
                  @input="node.gateway.$touch"
                />
                <div class="eos-form-group-label eos-form-group-error-msg">
                  <label v-if="node.gateway.$dirty && !node.gateway.required">Gateway is required</label>
                  <label
                    v-else-if="
                      node.gateway.$dirty && !node.gateway.ipAddress
                    "
                  >Invalid IP address</label>
                </div>
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

@Component({
  name: "eos-network-settings-ipv4"
})
export default class EosNetworkSettingsIpv4 extends Vue {
  @Validations()
  private validations = {
    ipv4VipAddress: {
      required,
      ipAddress
    },
    ipv4Netmask: {
      required,
      ipAddress
    },
    ipv4Gateway: {
      required,
      ipAddress
    },
    ipv4VipHostname: {
      required
    },
    ipv4Nodes: {
      $each: {
        ip_address: {
          required: requiredIf(function(this: any, form) {
            return this.$data.source === "manual";
          }),
          ipAddress
        },
        hostname: {
          required
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
  private setipAddress(e: any) {
    if (this.$v.ipv4Nodes.$model[1].ip_address === "") {
      this.$v.ipv4Nodes.$model[1].ip_address = e.target.value;
    }
    if (this.$v.ipv4Nodes.$model[2].ip_address === "") {
      this.$v.ipv4Nodes.$model[2].ip_address = e.target.value;
    }
  }
  private setHostname(e: any) {
    if (this.$v.ipv4Nodes.$model[1].hostname === "") {
      this.$v.ipv4Nodes.$model[1].hostname = e.target.value;
    }
    if (this.$v.ipv4Nodes.$model[2].hostname === "") {
      this.$v.ipv4Nodes.$model[2].hostname = e.target.value;
    }
  }
  private setNetmask(e: any) {
    if (this.$v.ipv4Nodes.$model[1].netmask === "") {
      this.$v.ipv4Nodes.$model[1].netmask = e.target.value;
    }
    if (this.$v.ipv4Nodes.$model[2].netmask === "") {
      this.$v.ipv4Nodes.$model[2].netmask = e.target.value;
    }
  }
  private setGetway(e: any) {
    if (this.$v.ipv4Nodes.$model[1].gateway === "") {
      this.$v.ipv4Nodes.$model[1].gateway = e.target.value;
    }
    if (this.$v.ipv4Nodes.$model[2].gateway === "") {
      this.$v.ipv4Nodes.$model[2].gateway = e.target.value;
    }
  }
  private data() {
    return {
      source: "manual",
      systemConfigObject: {} as SystemConfigObject,
      isValid: true,
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
      ]
    };
  }

  private mounted() {
    this.managementNetworkGetter();
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
    EVENT_BUS.$emit("validForm", !this.$v.ipv4Nodes.$invalid);
    return true;
  }
  private managementNetworkGetter(): any {
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
  }
  private updateIpv4Config() {
    const queryParams: Ipv4 = {
      is_dhcp: this.$data.source === "DHCP",
      nodes: this.$data.ipv4Nodes
    };
    return this.$store.dispatch("systemConfig/updateMngmtIpv4", queryParams);
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
