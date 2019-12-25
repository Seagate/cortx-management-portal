<template>
  <v-container class="mt-6">
    <v-img
      id="alert-img"
      :src="require('./../../../../assets/onboarding-wizard.png')"
      width="780px"
      height="70px"
    ></v-img>
    <v-divider />
    <div class="body-2">
      <div class="title mt-6" id="lblIpv4Dns">Data Network Settings: IPv4</div>
      <div class="mt-2" id="lblIpv4Msg">You need to configure a single IP address for management of this system.</div>
      <v-divider class="mt-2" />
      <div class="font-weight-bold mt-6">Source</div>
      <div class="mt-4">
        <input type="radio" name="source" v-model="source" value="manual" id="rbtnIpv4Source" />
        <span class="ml-2 font-weight-bold" id="lblIpv4Manual">Manual</span>
        <input class="ml-6" type="radio" disabled name="DHCP" value="DHCP" id="rbtnIpv4DHCP" />
        <span class="ml-2 font-weight-bold" id="lblIpv4Dhcp">DHCP</span>
      </div>
    </div>
    <div class="row mt-5">
      <template v-for="node in ipv4Nodes">
        <div class="col-4 body-2 column" :key="node.id">
          <span class="font-weight-medium" id="lblIpv4Node">Node {{ node.id }}</span>
          <v-divider class="mt-2" />
          <div class="mt-5">
            <span class="font-weight-medium" id="lblIpv4Ipaddress">IP Address</span>
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
            <span class="font-weight-medium" id="lblKIpv4Netmask">Netmask</span>
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
            <span class="font-weight-medium" id="lblIpv4Gateway">Gateway</span>
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
    <div class="mt-8">
      <p
        v-if="!isValid"
        class="red--text error-message"
      >Please enter valid values.</p>
      <v-btn elevation="0" color="csmprimary" @click="gotToNextPage()" id="btnIpv4ApplyContinue">
        <span class="white--text">Apply and Continue</span>
      </v-btn>
      <span class="csmprimary--text ml-8 pointer" @click="gotToPrevPage()" id="lblIpv4Prevoius"
        >Back to previous step</span
      >
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { SystemConfigObject, DataNetworkIpv4 } from "./../../../../models/system-configuration";
@Component({
  name: "eos-data-network-ipv4"
})
export default class EosDataNetworkIpv4 extends Vue {
  private gotToNextPage() {
    this.updateDataNetworkconfig().then((res: any) => {
      if (res) {
          this.$router.push("dataconfig3");
        } else {
          this.$data.isValid = false;
        }        
    })
    .catch(() => {
      console.error("Save Email Notifications settings Failed");
    });    
  }
  private gotToPrevPage() {
    this.$router.push("dataconfig1");
  }
  private updateDataNetworkconfig() {
    const queryParams: DataNetworkIpv4 = {
      is_dhcp: false,
      nodes: this.$data.ipv4Nodes
    };
    
    return this.$store.dispatch("systemConfig/updateDataNetworkSettingIpv4", queryParams);
  }
  public mounted() {
    this.managementNetworkGetter();
  }
  public managementNetworkGetter(): any {
    const systemconfig = this.$store.getters["systemConfig/systemconfig"];
    if (systemconfig.data_network_settings && systemconfig.data_network_settings.ipv4) {
      this.$data.ipv4Nodes = systemconfig.data_network_settings.ipv4.nodes;
    }
  }
  private data() {
    return {
      ipv4Nodes: [
        { id: 0, ip_address: "", netmask: "", gateway: "" },
        { id: 1, ip_address: "", netmask: "", gateway: "" }
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
