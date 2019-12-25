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
      <div class="title mt-6" id="lblDns">DNS Network Settings</div>
    </div>
    <div class="mt-5">
      <span class="font-weight-bold" id="lblFqdnName">FQDN Name:</span>
      <span class="font-weight-regular" id="lblId">vlan1.seagate.com</span>
    </div>
    <div class="mt-4">
      <span class="font-weight-medium black--text" id="lblHostname">Hostname</span>
      <div>
        <input class="input-text" type="text" name="hostname" v-model="hostname" id="txtHostname" />
      </div>
      <v-btn elevation="0" class="mt-5" color="csmprimary" @click="resetHostname()">
        <span class="white--text" id="btnResetHost">Reset Hostname</span>
      </v-btn>
    </div>
    <v-divider class="mt-5 col-3" />
    <v-row v-for="(value, i) in dnsServerAddress" :key="'dns' + value + i" class="mt-2">
      <v-col cols="6">{{ value }}</v-col>
      <v-col cols="3">
        <v-img
          @click="deleteDnsServerAddress(value)"
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
          v-model="newDnsServerAddress"
          id="txtDnsServer"
        />
      </div>
      <div
        :class="[$data.searchDomainAddress.length < 3 ? 'csmprimary--text' : 'grey--text lighten-1', 'pointer', 'mt-5']"
        @click="addDnsServerAddress(newDnsServerAddress)"
      >+ Add another static address (maximum of 3)</div>
    </div>
    <v-divider class="mt-5 col-3" />
    <v-row v-for="(value, i) in searchDomainAddress" :key="'sda' + value + i" class="mt-2">
      <v-col cols="6">{{ value }}</v-col>
      <v-col cols="3">
        <v-img
          @click="deleteSearchDomainAddress(value)"
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
          v-model="newSearchDomainAddress"
          id="txtSearchDomain"
        />
      </div>
      <div
        :class="[$data.searchDomainAddress.length < 3 ? 'csmprimary--text' : 'grey--text lighten-1', 'pointer', 'mt-5']"
        @click="addSearchDomainAddress(newSearchDomainAddress)"
      >+ Add Search Domain</div>
      <v-btn elevation="0" color="csmprimary" class="mt-3">
        <span class="white--text" @click="clearDns()" id="btnClearDns">Clear DNS</span>
      </v-btn>
    </div>
    <v-divider class="mt-8" />
    <div class="mt-8">
      <p
        v-if="!isValid"
        class="red--text error-message"
      >Please enter valid values.</p>
      <v-btn elevation="0" color="csmprimary" @click="gotToNextPage()" id="btnApplyContinue">
        <span class="white--text">Apply and Continue</span>
      </v-btn>
      <span
        class="csmprimary--text ml-8 pointer"
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
    this.$data.dnsServerAddress = [];
    this.$data.searchDomainAddress = [];
  }
  public gotToNextPage() {
    this.updateDNSconfig().then((res: any) => {
      if (res) {
          this.$router.push("datetime");
        } else {
          this.$data.isValid = false;
        } 
    })
    .catch(() => {
      // tslint:disable-next-line: no-console
      console.error("error");
    });    
  }
  public updateDNSconfig() {
    // TODO https://xd.adobe.com/view/cf8fc1fc-887f-4784-4373-b0b60a0d4a6a-b9be/screen/500095be-863f-42f2-bb2e-6aaea65ed9df/DNS
    // Check notes
    // Node 1 to show if external load balancer is selected otherwise show a single node
    // Default node selected with 0th index
    this.$data.dnsNodes[0].dns_servers = this.$data.dnsServerAddress;
    this.$data.dnsNodes[0].search_domain = this.$data.searchDomainAddress;

    const queryParams: DnsNetworkSettings = {
      is_external_load_balancer: true,
      fqdn_name: "vlan1.seagate.com",
      hostname: this.$data.hostname,
      nodes: this.$data.dnsNodes
    };
    return this.$store.dispatch("systemConfig/updateDNSSetting", queryParams);
  }
  public gotToPrevPage() {
    if (this.$store.getters["systemConfig/isDataipV6Status"] === true) {
      this.$router.push("dataconfig3");
    } else if (this.$store.getters["systemConfig/isDataipV4Status"] === true) {
      this.$router.push("dataconfig2");
    } else if (
      this.$store.getters["systemConfig/isDataipV6Status"] === false &&
      this.$store.getters["systemConfig/isDataipV4Status"] === false
    ) {
      this.$router.push("dataconfig1");
    }
  }
  private addDnsServerAddress(address: string) {
    if (this.$data.dnsServerAddress.length < 4 && address) {
      this.$data.dnsServerAddress.push(address);
      this.$data.newDnsServerAddress = "";
    }
  }
  private addSearchDomainAddress(address: string) {
    if (this.$data.searchDomainAddress.length < 4 && address) {
      this.$data.searchDomainAddress.push(address);
      this.$data.newSearchDomainAddress = "";
    }
  }
  private deleteDnsServerAddress(address: string) {
    for (
      let addressIndex = 0;
      addressIndex < this.$data.dnsServerAddress.length;
      addressIndex++
    ) {
      if (this.$data.dnsServerAddress[addressIndex] === address) {
        this.$data.dnsServerAddress.splice(addressIndex, 1);
      }
    }
  }
  private deleteSearchDomainAddress(address: string) {
    for (
      let addressIndex = 0;
      addressIndex < this.$data.searchDomainAddress.length;
      addressIndex++
    ) {
      if (this.$data.searchDomainAddress[addressIndex] === address) {
        this.$data.searchDomainAddress.splice(addressIndex, 1);
      }
    }
  }
  public mounted() {
    this.managementNetworkGetter();
  }
  public managementNetworkGetter(): any {
    const systemconfig = this.$store.getters["systemConfig/systemconfig"];
    if (
      systemconfig.dns_network_settings &&
      systemconfig.dns_network_settings.nodes
    ) {
      this.$data.hostname = systemconfig.dns_network_settings.hostname;
      this.$data.dnsServerAddress =
        systemconfig.dns_network_settings.nodes[0].dns_servers;
      this.$data.searchDomainAddress =
        systemconfig.dns_network_settings.nodes[0].search_domain;
    }
  }
  private data() {
    return {
      hostname: "",
      source: "manual",
      dnsServerAddress: [],
      searchDomainAddress: [],
      dnsNodes: [
        {
          id: 0,
          dns_servers: [],
          search_domain: []
        },
        {
          id: 1,
          dns_servers: [],
          search_domain: []
        }
      ],
      newDnsServerAddress: "",
      newSearchDomainAddress: "",
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
