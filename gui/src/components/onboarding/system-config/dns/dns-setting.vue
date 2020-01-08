<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblDns">
        DNS Network Settings
      </div>
      <div class="mt-4">
        <span class="font-weight-bold black--text" id="lblHostname"
          >Hostname</span
        >
        <div>
          <input
            class="input-text"
            type="text"
            name="hostname"
            v-model="hostname"
            id="txtHostname"
          />
        </div>
      </div>
      <v-divider class="mt-5 pb-0 col-6" />
      <div class="row mt-3">
        <template v-for="node in dnsNodes">
          <div class="col-3 body-2 column" :key="node.id">
            <span class="font-weight-bold" id="lblIpv4Node"
              >Node {{ node.id }}</span
            >
            <v-divider class="mt-2" />
            <div class="mt-4">
              <span class="font-weight-bold" id="lblHostname">Hostname</span>
              <div>
                <input
                  class="input-text"
                  type="text"
                  name="hostname"
                  v-model="node.hostname"
                  :id="node.id + 'txtDnsHostname'"
                />
              </div>
            </div>
            <div class="mt-4">
              <div class="font-weight-bold black--text" id="lblDNsServer">
                DNS Server
              </div>
              <div>
                <textarea
                  id="txtDnsServer"
                  name="dnsname"
                  v-model="dnsServerAddress[node.id]"
                  rows="3"
                  placeholder="Enter semicolon ';' seperated values"
                  class="textarea-text"
                ></textarea>
              </div>
            </div>
            <div class="mt-4">
              <div class="font-weight-bold black--text" id="lblSearchDomains">
                Search Domains
              </div>
              <div>
                <textarea
                  id="txtSearchDomain"
                  name="search-domain"
                  v-model="searchDomainAddress[node.id]"
                  rows="3"
                  placeholder="Enter semicolon ';' seperated values"
                  class="textarea-text"
                ></textarea>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <span class="d-none">{{ isValidForm }}</span>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import {
  SystemConfigObject,
  DnsNetworkSettings
} from "./../../../../models/system-configuration";
import { EVENT_BUS } from "./../../../../main";

@Component({
  name: "eos-dns-setting"
})
export default class EosDnsSetting extends Vue {
  /**
   * splitNodesBySemicolon
   */
  public splitNodesBySemicolon(nodeList: any) {
    // Loop through the nodeList and check dnsServerAddress && searchDomainAddress with node index
    // split with semicolon and filter out "" blank values
    // Assign it back to node
    // if we don't add check for empty value the function throws an error and does not return the list
    const updatedNodes = nodeList.map((node: any, i: number) => {
      node.dns_servers = this.$data.dnsServerAddress[i]
        ? this.$data.dnsServerAddress[i].split(";").filter(Boolean)
        : [];
      node.search_domain = this.$data.searchDomainAddress[i]
        ? this.$data.searchDomainAddress[i].split(";").filter(Boolean)
        : [];
      return node;
    });
    return updatedNodes;
  }
  public updateDNSconfig() {
    // TODO https://xd.adobe.com/view/cf8fc1fc-887f-4784-4373-b0b60a0d4a6a-b9be/screen/500095be-863f-42f2-bb2e-6aaea65ed9df/DNS
    // Check notes
    // Node 1 to show if external load balancer is selected otherwise show a single node
    // Default node selected with 0th index
    this.$data.dnsNodes = this.splitNodesBySemicolon(this.$data.dnsNodes);

    const queryParams: DnsNetworkSettings = {
      is_external_load_balancer: false,
      fqdn_name: "vlan1.seagate.com",
      hostname: this.$data.hostname,
      nodes: this.$data.dnsNodes
    };
    return this.$store.dispatch("systemConfig/updateDNSSetting", queryParams);
  }
  private mounted() {
    this.managementNetworkGetter();
    // WizardHook: Open a listener for onNext event
    // So when wizard footer clicks on the Next Button this component can perform its own workflow
    EVENT_BUS.$on("emitOnNext", (res: any) => {
      this.updateDNSconfig()
        .then(result => {
          res(true);
        })
        .catch(err => {});
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
    EVENT_BUS.$emit("validForm", validate);
    return validate;
  }
  private managementNetworkGetter(): any {
    const systemconfig = this.$store.getters["systemConfig/systemconfig"];
    if (
      systemconfig.dns_network_settings &&
      systemconfig.dns_network_settings.nodes
    ) {
      this.$data.hostname = systemconfig.dns_network_settings.hostname;
      this.$data.dnsNodes = systemconfig.dns_network_settings.nodes.map(
        (node: any, i: number) => {
          this.$data.dnsServerAddress[i] = node.dns_servers.join(";");
          this.$data.searchDomainAddress[i] = node.search_domain.join(";");
          return node;
        }
      );
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
          hostname: "",
          dns_servers: [],
          search_domain: []
        },
        {
          id: 1,
          hostname: "",
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
.textarea-text {
  border-style: solid;
  border-width: 1px;
  border-color: #e3e3e3;
  width: 20em;
  // height: 2.5em;
}
.pointer {
  cursor: pointer;
}
</style>
