<template>
  <v-container class="mt-6 body-2">
    <v-img
      id="alert-img"
      :src="require('./../../../../assets/onboarding-wizard.png')"
      width="780px"
      height="70px"
    ></v-img>
    <v-divider />
    <div>
      <div class="title mt-6" id="lblDns">
        DNS Network Settings
        <v-icon class="green--text" size="20">mdi-help-circle-outline</v-icon>
      </div>
    </div>
    <div class="mt-5">
      <span class="font-weight-bold" id="lblFqdnName">FQDN Name :</span>
      <span class="font-weight-regular" id="lblId">vlan1.seagate.com</span>
    </div>
    <div class="mt-4">
      <span class="font-weight-medium black--text" id="lblHostname">Hostname</span>
      <div>
        <input class="input-text" type="text" name="hostname" v-model="hostname" id="txtHostname" />
      </div>
      <v-btn elevation="0" class="mt-5" color="udxprimary">
        <span class="white--text" @click="resetHostname()" id="btnResetHost">Reset Hostname</span>
      </v-btn>
    </div>
    <v-divider class="mt-5 col-3" />
    <v-row v-for="value in ipaddressNode0" :key="value" class="mt-2">
      <v-col cols="6">{{value}}</v-col>
      <v-col cols="3">
        <v-img
          @click="deleteIpAddressNode0(value)"
          id="alert-img"
          :src="require('./../../../../assets/delete-off.png')"
          width="1em"
          height="1em"
        ></v-img>
      </v-col>
    </v-row>
    <div>
      <div class="font-weight-medium black--text" id="lblDNsServer">DNS Server</div>
      <div class="pt-4 font-weight-regular black--text" id="lblDnsServer1">DNS Server 1</div>
      <div>
        <input
          class="input-text"
          type="text"
          name="dnsname"
          v-model="newAddressNode0"
          id="txtHostname"
        />
      </div>
      <div
        :class="[$data.ipaddressNode1.length < 3 ? 'green--text':'grey--text lighten-1','pointer','mt-5']"
        @click="addIpAddressNode0(newAddressNode0)"
      >+ Add another static address (maximum of 3)</div>
    </div>
    <v-divider class="mt-5 col-3" />
    <v-row v-for="value in ipaddressNode1" :key="value" class="mt-2">
      <v-col cols="6">{{value}}</v-col>
      <v-col cols="3">
        <v-img
          @click="deleteIpAddressNode1(value)"
          id="alert-img"
          :src="require('./../../../../assets/delete-off.png')"
          width="1em"
          height="1em"
        ></v-img>
      </v-col>
    </v-row>
    <div>
      <div class="font-weight-medium black--text" id="lblSearchDomains">Search Domains</div>
      <div class="pt-4 font-weight-regular black--text" id="lblSerachDomains">Search Domains 1</div>
      <div>
        <input
          class="input-text"
          type="text"
          name="search-domain"
          v-model="newAddressNode1"
          id="txtHostname"
        />
      </div>
      <div
        :class="[$data.ipaddressNode1.length < 3 ? 'green--text':'grey--text lighten-1','pointer','mt-5']"
        @click="addIpAddressNode1(newAddressNode1)"
      >+ Add Search Domain</div>
      <v-btn elevation="0" color="udxprimary" class="mt-3">
        <span class="white--text" @click="clearDns()" id="btnClearDns">Clear DNS</span>
      </v-btn>
    </div>
    <v-divider class="mt-8" />
    <div class="mt-8">
      <v-btn elevation="0" color="udxprimary" id="btnApplyContinue">
        <span class="white--text" @click="gotToNextPage()">Apply and Continue</span>
      </v-btn>
      <span
        class="green--text ml-8 pointer"
        @click="gotToPrevPage()"
        id="lblBack"
      >Back to previous step</span>
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import {
  SystemConfigObject,
  DnsNetworkSettings
} from "./../../../../models/system-configuration";

@Component({
  name: "eos-dns-setting"
})
export default class EosDnsSetting extends Vue {
  public resetHostname() {
    this.$data.hostname = "";
  }
  public clearDns() {
    this.$data.ipaddressNode0 = [];
    this.$data.ipaddressNode1 = [];
  }
  public gotToNextPage() {
    this.updateDNSconfig();
    this.$router.push("datetime");
  }
  updateDNSconfig() {
    const queryParams: DnsNetworkSettings = {
      is_external_load_balancer: true,
      fqdn_name: "vlan1.seagate.com",
      hostname: this.$data.hostname,
      nodes: this.$data.ipaddressNode0
    };
    this.$store
      .dispatch("systemConfig/updateDNSSetting", queryParams)
      .then((res: any) => {})
      .catch(() => {
        // tslint:disable-next-line: no-console
        console.error("error");
      });
  }
  public gotToPrevPage() {
    this.$router.push("dataconfig3");
  }
  private addIpAddressNode0(address: string) {
    if (
      this.$data.ipaddressNode0.length < 4 &&
      address !== "" &&
      address !== undefined
    ) {
      this.$data.ipaddressNode0.push(address);
      this.$data.newAddressNode0 = "";
    }
  }
  private addIpAddressNode1(address: string) {
    if (
      this.$data.ipaddressNode1.length < 4 &&
      address !== "" &&
      address !== undefined
    ) {
      this.$data.ipaddressNode1.push(address);
      this.$data.newAddressNode1 = "";
    }
  }
  private deleteIpAddressNode0(address: string) {
    for (
      let addressIndex = 0;
      addressIndex < this.$data.ipaddressNode0.length;
      addressIndex++
    ) {
      if (this.$data.ipaddressNode0[addressIndex] === address) {
        this.$data.ipaddressNode0.splice(addressIndex, 1);
      }
    }
  }
  private deleteIpAddressNode1(address: string) {
    for (
      let addressIndex = 0;
      addressIndex < this.$data.ipaddressNode1.length;
      addressIndex++
    ) {
      if (this.$data.ipaddressNode1[addressIndex] === address) {
        this.$data.ipaddressNode1.splice(addressIndex, 1);
      }
    }
  }
  public mounted() {
    this.managementNetworkGetter();
  }
  public managementNetworkGetter(): any {
    const systemconfig = this.$store.getters["systemConfig/systemconfig"];
    if (systemconfig.dns_network_settings) {
      this.$data.hostname = systemconfig.dns_network_settings.hostname;
      this.$data.ipaddressNode0 =
        systemconfig.dns_network_settings.node0.dns_servers;
      this.$data.ipaddressNode1 =
        systemconfig.dns_network_settings.node0.search_domain;
    }
  }
  private data() {
    return {
      hostname: "",
      source: "manual",
      ipaddressNode0: [],
      ipaddressNode1: [],
      newAddressNode0: "",
      newAddressNode1: ""
    };
  }
}
</script>
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
