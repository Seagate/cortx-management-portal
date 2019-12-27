<template>
  <v-container class="mt-0 pt-0">
    <v-row>
      <v-col cols="6" class="pt-0 mt-0">
        <div class="body-2">
          <div class="title mt-6" id="lblNetworkIP4">
            Management Network Settings: IPv4
          </div>
          <div class="mt-6" id="lblNetworkMsg">
            You need to configure a single IP address for management of this
            system.
          </div>
          <v-divider class="mt-2" />
          <div class="font-weight-bold mt-6" id="lblIp4Source">Source</div>
          <div class="mt-4">
            <input type="radio" name="source" v-model="source" value="manual" />
            <span class="ml-3 font-weight-bold" id="lblIp4Manual">Manual</span>
            <input
              class="ml-10"
              type="radio"
              disabled
              name="DHCP"
              value="DHCP"
              id="txtIP4DHCP"
            />
            <span class="ml-3 font-weight-bold" id="lblIp4DHCP">DHCP</span>
          </div>
          <div>
            <div class="mt-4">
              <span class="font-weight-bold" id="lblIp4Adress">IP Address</span>
              <div>
                <input
                  class="input-text"
                  type="text"
                  name="ipaddress"
                  v-model="ipv4IpAddress"
                  id="txtNetworkSettingsIpv4IpAddress"
                />
              </div>
            </div>
            <div class="mt-4">
              <span class="font-weight-bold" id="lblIp4Netmask">Netmask</span>
              <div>
                <input
                  class="input-text"
                  type="text"
                  name="netmask"
                  v-model="ipv4Netmask"
                  id="txtIpv4Netmask"
                />
              </div>
            </div>
            <div class="mt-4">
              <span class="font-weight-bold" id="lblIp4Gateway">Gateway</span>
              <div>
                <input
                  class="input-text"
                  type="text"
                  name="gateway"
                  v-model="ipv4Gateway"
                  id="txtIP4Gateway"
                />
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    <span class="d-none">{{ isValidForm }}</span>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { mapState } from "vuex";
import {
  SystemConfigObject,
  Ipv4
} from "./../../../../models/system-configuration";
import { EventBus } from "./../../../../main";

@Component({
  name: "eos-network-settings-ipv4"
})
export default class EosNetworkSettingsIpv4 extends Vue {
  public mounted() {
    this.managementNetworkGetter();
    this.$store.commit("alerts/setOnboardingFlag", false);
    // WizardHook: Open a listener for onNext event
    // So when wizard footer clicks on the Next Button this component can perform its own workflow
    EventBus.$on("emitOnNext", (res: any) => {
      this.updateIpv4Config()
        .then(result => {
          res(true);
        })
        .catch(err => {});
    });
  }
  public destroyed() {
    // WizardHook: shut off on exit event listner
    EventBus.$off("emitOnNext");
  }
  get isValidForm() {
    // WizardHook: Emit event to sibling wizard footer component
    // to send information about data validation to enable/disable wizard footer
    EventBus.$emit("validForm", true);
    return true;
  }
  public managementNetworkGetter(): any {
    const systemconfig = this.$store.getters["systemConfig/systemconfig"];
    if (
      systemconfig.management_network_settings &&
      systemconfig.management_network_settings.ipv4
    ) {
      this.$data.ipv4Gateway =
        systemconfig.management_network_settings.ipv4.gateway;
      this.$data.ipv4Netmask =
        systemconfig.management_network_settings.ipv4.netmask;
      this.$data.ipv4IpAddress =
        systemconfig.management_network_settings.ipv4.ip_address;
    }
  }
  public gotoNextPage() {
    this.updateIpv4Config();
    if (this.$store.getters["systemConfig/isipV6Status"] === true) {
      this.$router.push("systemconfig3");
    } else {
      this.$router.push("dataconfig1");
    }
  }

  public updateIpv4Config() {
    const queryParams: Ipv4 = {
      is_dhcp: false,
      ip_address: this.$data.ipv4IpAddress,
      netmask: this.$data.ipv4Netmask,
      gateway: this.$data.ipv4Gateway
    };
    return this.$store.dispatch("systemConfig/updateMngmtIpv4", queryParams);
  }
  private data() {
    return {
      ipv4IpAddress: "",
      ipv4Netmask: "",
      ipv4Gateway: "",
      source: "manual",
      systemConfigObject: {} as SystemConfigObject
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
