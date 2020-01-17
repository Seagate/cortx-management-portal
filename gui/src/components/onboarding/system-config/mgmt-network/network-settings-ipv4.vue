<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblNetworkIP4">
        Management network settings: IPv4
      </div>
      <div class="mt-6" id="lblNetworkMsg">
        You need to configure a single IP address for management of this system.
      </div>
      <v-divider class="mt-2" />
      <div class="font-weight-bold mt-6" id="lblIp4Source">Source</div>
      <div class="mt-4">
        <input type="radio" name="source" v-model="source" value="manual" />
        <span class="ml-3 font-weight-bold" id="lblIp4Manual">Manual</span>
        <input
          class="ml-10"
          type="radio"
          name="DHCP"
          v-model="source"
          value="DHCP"
          id="txtIP4DHCP"
        />
        <!-- disabled -->
        <span class="ml-3 font-weight-bold" id="lblIp4DHCP">DHCP</span>
      </div>
      <div class="row mt-5">
        <template v-for="node in ipv4Nodes">
          <div class="col-3 body-2 column" :key="node.id">
            <span class="font-weight-bold" id="lblIpv4Node"
              >Node {{ node.id }}</span
            >
            <v-divider class="mt-2" />
            <div class="mt-5" v-if="source == 'manual'">
              <span class="font-weight-bold" id="lblMngmtNetworkIpv4Ipaddress"
                >IP Address</span
              >
              <div>
                <input
                  class="input-text"
                  type="text"
                  name="ipaddress"
                  v-model="node.ip_address"
                  :id="node.id + 'txtMngmtNetworkIpv4Ipaddress'"
                />
              </div>
            </div>
            <div class="mt-4">
              <span class="font-weight-bold" id="lblMngmtNetworkIpv4VIPAddress"
                >VIP Address</span
              >
              <div>
                <input
                  class="input-text"
                  type="text"
                  name="vipaddress"
                  v-model="node.vip_address"
                  :id="node.id + 'txtMngmtNetworkIpv4VIpAddress'"
                />
              </div>
            </div>
            <div class="mt-4">
              <span class="font-weight-bold" id="lblMngmtNetworkIpv4Netmask"
                >Netmask</span
              >
              <div>
                <input
                  class="input-text"
                  type="text"
                  name="netmask"
                  v-model="node.netmask"
                  :id="node.id + 'txtMngmtNetworkIpv4netmask'"
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
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
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
    EVENT_BUS.$emit("validForm", true);
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
      this.$data.ipv4Nodes = mngmtNetworkSettings.ipv4.nodes;
      this.$data.source =
        mngmtNetworkSettings.ipv4.is_dhcp === true ? "DHCP" : "manual";
    }
  }
  public updateIpv4Config() {
    const queryParams: Ipv4 = {
      is_dhcp: this.$data.source === "DHCP",
      nodes: this.$data.ipv4Nodes
    };
    return this.$store.dispatch("systemConfig/updateMngmtIpv4", queryParams);
  }
  private data() {
    return {
      ipv4IpAddress: "",
      ipv4Netmask: "",
      ipv4Gateway: "",
      source: "manual",
      systemConfigObject: {} as SystemConfigObject,
      isValid: true,
      ipv4Nodes: [
        { id: 0, ip_address: "", netmask: "", gateway: "" },
        { id: 1, ip_address: "", netmask: "", gateway: "" }
      ]
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
