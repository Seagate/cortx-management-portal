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
      <div class="font-weight-bold mt-6">
        Source
        <v-icon class="green--text" size="20">mdi-help-circle-outline</v-icon>
      </div>
      <div class="mt-4">
        <input type="radio" name="source" v-model="source" value="manual"  id="rbtnIpv4Source"/>
        <span class="ml-2 font-weight-bold" id="lblIpv4Manual">Manual</span>
        <input class="ml-6" type="radio" disabled name="DHCP" value="DHCP" id="rbtnIpv4DHCP" />
        <span class="ml-2 font-weight-bold" id="lblIpv4Dhcp">DHCP</span>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-4 body-2 column">
        <span class="font-weight-medium" id="lblIpv4Node">Node 0</span>
        <v-divider class="mt-2" />
        <div class="mt-5">
          <span class="font-weight-medium" id="lblIpv4Ipaddress">IP Address</span>
          <div>
            <input class="input-text" type="text" name="ipaddress" v-model="ipv4IpAddress" id="txtIpv4Ipaddress" />
          </div>
        </div>
        <div class="mt-4">
          <span class="font-weight-medium" id="lblKIpv4Netmask">Netmask</span>
          <div>
            <input class="input-text" type="text" name="netmask" v-model="ipv4Netmask"  id="txtIpv4Ipv4netmask"/>
          </div>
        </div>
        <div class="mt-4">
          <span class="font-weight-medium" id="lblIpv4Gateway">Gateway</span>
          <div>
            <input class="input-text" type="text" name="gateway" v-model="ipv4Gateway" id="txtIpv4Ipv4Gateway" />
          </div>
        </div>
      </div>
      <div class="col-4 body-2 column">
        <span class="font-weight-medium" id="lblNode1">Node 1</span>
        <v-divider class="mt-2" />
        <div class="mt-5">
          <span class="font-weight-medium" id="lblIpv4Ipaddress">IP Address</span>
          <div>
            <input class="input-text" type="text" name="ipaddress" v-model="ipv4IpAddress" id="txtIpv4Ipaddress" />
          </div>
        </div>
        <div class="mt-4">
          <span class="font-weight-medium" id="lblNetmask">Netmask</span>
          <div>
            <input class="input-text" type="text" name="netmask" v-model="ipv4Netmask"  id="txtIpv4Ipv4Netmask"/>
          </div>
        </div>
        <div class="mt-4">
          <span class="font-weight-medium" id="lblGateway">Gateway</span>
          <div>
            <input class="input-text" type="text" name="gateway" v-model="ipv4Gateway" id="txtIpv4Gatewayt" />
          </div>
        </div>
      </div>
    </div>
    <div class="mt-8">
      <v-btn elevation="0" color="green" id="btnIpv4ApplyContinue">
        <span class="white--text" @click="gotToNextPage()">Apply and Continue</span>
      </v-btn>
      <span class="green--text ml-8 pointer" @click="gotToPrevPage()" id="lblIpv4Prevoius">Back to previous step</span>
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "eos-data-network-ipv4"
})
export default class EosDataNetworkIpv4 extends Vue {
  private gotToNextPage() {
    this.$router.push("dataconfig3");
  }
  private gotToPrevPage() {
    this.$router.push("dataconfig1");
  }
  private data() {
    return {
      source: "manual"
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
