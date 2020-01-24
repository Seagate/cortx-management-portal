<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblNetworkIP4">Management network settings: IPv4</div>
      <div
        class="mt-6"
        id="lblNetworkMsg"
      >You need to configure a single IP address for management of this system.</div>
      <v-divider class="mt-2" />
      <div class="font-weight-bold mt-6" id="lblIp4Source">Source</div>
      <div class="mt-4">
        <label class="eos-rdb-container">
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
      <!---->
      <br />
      <div class="row mt-5 ml-1">
        <div
          class="eos-form-group"
          :class="{
          'eos-form-group--error': $v.ipv4VipAddress.$error
        }"
        >
          <label class="eos-form-group-label" for="accountName">VIP Address*</label>
          <input
            class="eos-form__input_text"
            type="text"
            id="txtMngmtNetworkIpv4VIpAddress"
            name="vipaddress"
            v-model.trim="ipv4VipAddress"
            @input="$v.ipv4VipAddress.$touch"
          />
          <div class="eos-form-group-label eos-form-group-error-msg">
            <label
              v-if="$v.ipv4VipAddress.$dirty && !$v.ipv4VipAddress.required"
            >VIP Address is required</label>
            <label
              v-else-if="$v.ipv4VipAddress.$dirty && !$v.ipv4VipAddress.ipAddress"
            >Invalid VIP Address</label>
          </div>
        </div>
        <!----->
        <div
          class="eos-form-group ml-6"
          :class="{
          'eos-form-group--error': $v.ipv4VipHostname.$error
        }"
        >
          <label class="eos-form-group-label" for="accountName">VIP Hostname*</label>
          <input
            class="eos-form__input_text"
            type="text"
            id="txtMngmtNetworkIpv4VIpHostname"
            name="viphostname"
            v-model.trim="ipv4VipHostname"
            @input="$v.ipv4VipHostname.$touch"
          />
          <div class="eos-form-group-label eos-form-group-error-msg">
            <label
              v-if="$v.ipv4VipHostname.$dirty && !$v.ipv4VipHostname.required"
            >VIP hostname is required</label>
          </div>
        </div>
      </div>

      <!---->
      <div class="row mt-5 ml-1">
        <div
          class="eos-form-group"
          :class="{
          'eos-form-group--error': $v.ipv4Netmask.$error
        }"
        >
          <label
            class="eos-form-group-label"
            id="lblMngmtNetworkIpv4Netmask"
            for="accountName"
          >Netmask*</label>
          <input
            class="eos-form__input_text"
            type="text"
            id="txtMngmtNetworkIpv4netmask"
            name="netmask"
            v-model.trim="ipv4Netmask"
            @input="$v.ipv4Netmask.$touch"
          />
          <div class="eos-form-group-label eos-form-group-error-msg">
            <label v-if="$v.ipv4Netmask.$dirty && !$v.ipv4Netmask.required">Netmask is required</label>
            <label v-else-if="$v.ipv4Netmask.$dirty && !$v.ipv4Netmask.ipAddress">Invalid Netmask</label>
          </div>
        </div>
        <div
          class="eos-form-group ml-6"
          :class="{
          'eos-form-group--error': $v.ipv4Gateway.$error
        }"
        >
          <label
            class="eos-form-group-label"
            id="lblMngmtNetworkIpv4Gateway"
            for="accountName"
          >Gateway*</label>
          <input
            class="eos-form__input_text"
            type="text"
            id="txtMngmtNetworkIpv4Gateway"
            name="gateway"
            v-model.trim="ipv4Gateway"
            @input="$v.ipv4Gateway.$touch"
          />
          <div class="eos-form-group-label eos-form-group-error-msg">
            <label v-if="$v.ipv4Gateway.$dirty && !$v.ipv4Gateway.required">Gateway is required</label>
            <label v-else-if="$v.ipv4Gateway.$dirty && !$v.ipv4Gateway.ipAddress">Invalid Gateway</label>
          </div>
        </div>
      </div>
      <!---->
      <div class="row mt-5" v-if="source == 'manual'">
        <template v-for="node in $v.ipv4Nodes.$each.$iter">
          <div class="col-3 body-2 column mr-10" :key="node.id">
            <span class="font-weight-bold" id="lblIpv4Node">Node {{ node.$model.id }}</span>
            <v-divider class="mt-2" />
            <div class="mt-5" v-if="source == 'manual'">
              <div
                class="eos-form-group"
                :class="{
                  'eos-form-group--error': node.ip_address.$error
                }"
              >
                <label
                  class="eos-form-group-label"
                  :id="node.$model.id + 'lblMngmtNetworkIpv4Ipaddress'"
                  :for="node.$model.id + 'txtMngmtNetworkIpv4Ipaddress'"
                >IP address*</label>
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
                  >IP address is required</label>
                  <label
                    v-else-if="
                      node.ip_address.$dirty && !node.ip_address.ipAddress
                    "
                  >Invalid IP address</label>
                </div>
              </div>
              <div
                class="eos-form-group"
                :class="{
                  'eos-form-group--error': node.hostname.$error
                }"
              >
                <label
                  class="eos-form-group-label"
                  :id="node.$model.id + 'lblMngmtNetworkIpv4Iphostname'"
                  :for="node.$model.id + 'txtMngmtNetworkIpv4Iphostname'"
                >Hostname*</label>
                <input
                  class="eos-form__input_text"
                  type="text"
                  :id="node.$model.id + 'txtMngmtNetworkIpv4Iphostname'"
                  :name="node.$model.id + 'ipaddress'"
                  v-model.trim="node.hostname.$model"
                  @input="node.hostname.$touch"
                />
                <div class="eos-form-group-label eos-form-group-error-msg">
                  <label v-if="node.hostname.$dirty && !node.hostname.required">hostname is required</label>
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
  public validations = {
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
          required: requiredIf(function(this: any, form) {
            return this.$data.source === "manual";
          })
        }
      }
    }
  };
  private data() {
    return {
      ipv4VipAddress: "",
      ipv4Netmask: "",
      ipv4Gateway: "",
      ipv4VipHostname: "",
      source: "manual",
      systemConfigObject: {} as SystemConfigObject,
      isValid: true,
      ipv4Nodes: [
        { id: 0, ip_address: "", hostname: "" },
        { id: 1, ip_address: "", hostname: "" }
      ]
    };
  }

  public mounted() {
    this.managementNetworkGetter();
    // WizardHook: Open a listener for onNext event
    // So when wizard footer clicks on the Next Button this component can perform its own workflow
    EVENT_BUS.$on("emitOnNext", (res: any) => {
      this.updateIpv4Config().then(result => {
        res(true);
      });
    });
  }
  public destroyed() {
    // WizardHook: shut off on exit event listener
    EVENT_BUS.$off("emitOnNext");
  }
  get isValidForm() {
    // WizardHook: Emit event to sibling wizard footer component
    // to send information about data validation to enable/disable wizard footer
    EVENT_BUS.$emit("validForm", !this.$v.$invalid);
    return true;
  }
  public managementNetworkGetter(): any {
    const systemconfig = this.$store.getters["systemConfig/systemconfig"];
    const mngmtNetworkSettings = systemconfig.management_network_settings;
    if (
      mngmtNetworkSettings &&
      mngmtNetworkSettings.ipv4 &&
      mngmtNetworkSettings.ipv4.nodes
    ) {
      this.$data.source =
        mngmtNetworkSettings.ipv4.is_dhcp === true ? "DHCP" : "manual";
      this.$data.ipv4VipAddress = mngmtNetworkSettings.ipv4.vip_address;
      this.$data.ipv4Netmask = mngmtNetworkSettings.ipv4.netmask;
      this.$data.ipv4Gateway = mngmtNetworkSettings.ipv4.gateway;
      this.$data.ipv4VipHostname = mngmtNetworkSettings.ipv4.vip_hostname;
      this.$data.ipv4Nodes = mngmtNetworkSettings.ipv4.nodes;
    }
  }
  public updateIpv4Config() {
    const queryParams: Ipv4 = {
      is_dhcp: this.$data.source === "DHCP",
      vip_address: this.$data.ipv4VipAddress,
      netmask: this.$data.ipv4Netmask,
      gateway: this.$data.ipv4Gateway,
      nodes: this.$data.ipv4Nodes,
      vip_hostname: this.$data.ipv4VipHostname
    };
    console.log(queryParams, "queryParams");
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
</style>
