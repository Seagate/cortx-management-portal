<template>
  <v-container class="mt-0 pt-0">
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
        <input
          type="radio"
          name="source"
          v-model="source"
          value="manual"
          id="rbtnIpv4Source"
        />
        <span class="ml-2 font-weight-bold" id="lblIpv4Manual">Manual</span>
        <input
          class="ml-6"
          type="radio"
          name="DHCP"
          v-model="source"
          value="DHCP"
          id="rbtnIpv4DHCP"
        />
        <span class="ml-2 font-weight-bold" id="lblIpv4Dhcp">DHCP</span>
      </div>
    </div>
    <div class="row pl-4 mt-5">
      <template v-for="node in ipv4Nodes">
        <div class="col-3 body-2 column" :key="node.id">
          <span class="font-weight-bold" id="lblIpv4Node"
            >Node {{ node.id }}</span
          >
          <v-divider class="mt-2" />
          <div class="mt-5" v-if="source == 'manual'">
            <span class="font-weight-bold" id="lblIpv4Ipaddress"
              >IP Address</span
            >
            <div>
              <input
                class="input-text"
                type="text"
                name="ipaddress"
                v-model="node.ip_address"
                :id="node.id + 'txtDataNetworkIpv4Ipaddress'"
              />
            </div>
          </div>
          <div class="mt-4">
            <span class="font-weight-bold" id="lblDataNetworkIpv4VIPAddress"
              >VIP Address</span
            >
            <div>
              <input
                class="input-text"
                type="text"
                name="vipaddress"
                v-model="node.vip_address"
                :id="node.id + 'txtDataNetworkIpv4VIpAddress'"
              />
            </div>
          </div>
          <div class="mt-4">
            <span class="font-weight-bold" id="lblKIpv4Netmask">Netmask</span>
            <div>
              <input
                class="input-text"
                type="text"
                name="netmask"
                v-model="node.netmask"
                :id="node.id + 'txtDataNetworkIpv4netmask'"
              />
            </div>
          </div>
          <div class="mt-4">
            <span class="font-weight-bold" id="lblIpv4Gateway">Gateway</span>
            <div>
              <input
                class="input-text"
                type="text"
                name="gateway"
                v-model="node.gateway"
                :id="node.id + 'txtDataNetworkIpv4gateway'"
              />
            </div>
          </div>
        </div>
      </template>
    </div>
    <span class="d-none">{{ isValidForm }}</span>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import {
  SystemConfigObject,
  DataNetworkIpv4
} from "./../../../../models/system-configuration";
import { EventBus } from "./../../../../main";

@Component({
  name: "eos-data-network-ipv4"
})
export default class EosDataNetworkIpv4 extends Vue {
  private updateDataNetworkConfig() {
    const queryParams: DataNetworkIpv4 = {
      is_dhcp: this.$data.source == "DHCP",
      nodes: this.$data.ipv4Nodes
    };

    return this.$store.dispatch(
      "systemConfig/updateDataNetworkSettingIpv4",
      queryParams
    );
  }
  private mounted() {
    this.dataNetworkGetter();
    // WizardHook: Open a listener for onNext event
    // So when wizard footer clicks on the Next Button this component can perform its own workflow
    EventBus.$on("emitOnNext", (res: any) => {
      this.updateDataNetworkConfig()
        .then(result => {
          res(true);
        })
        .catch(err => {});
    });
  }
  private destroyed() {
    // WizardHook: shut off on exit event listner
    EventBus.$off("emitOnNext");
  }
  get isValidForm() {
    const validate = true;
    // WizardHook: Emit event to sibling wizard footer component
    // to send information about data validation to enable/disable wizard footer
    EventBus.$emit("validForm", validate);
    return validate;
  }
  private dataNetworkGetter(): any {
    const systemconfig = this.$store.getters["systemConfig/systemconfig"];
    const dataNetworkSettings = systemconfig.data_network_settings;
    if (
      dataNetworkSettings &&
      dataNetworkSettings.ipv4 &&
      dataNetworkSettings.ipv4.nodes
    ) {
      this.$data.ipv4Nodes = dataNetworkSettings.ipv4.nodes;
      this.$data.source =
        dataNetworkSettings.ipv4.is_dhcp == true ? "DHCP" : "manual";
    }
  }
  private data() {
    return {
      ipv4Nodes: [
        { id: 0, vip_address: "", ip_address: "", netmask: "", gateway: "" },
        { id: 1, vip_address: "", ip_address: "", netmask: "", gateway: "" }
      ],
      source: "manual",
      isValid: true
    };
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
