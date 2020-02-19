<template>
  <v-container class="mt-6 ml-0">
    <div id="app">
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header class="eos-text-lg">Management Network setting</v-expansion-panel-header>
          <v-expansion-panel-content>
            <div class="row ma-0 mt-3">
              <template v-for="(node, index) in nodes">
                <div class="col-3 body-2 column node-container mr-5" :key="index">
                  <span class="font-weight-bold" id="lblIpv4Node">{{ node }}</span>
                  <v-divider class="mt-2" />
                  <div class="eos-form-group mt-0 ml-0">
                    <div class="mt-3">
                      <div class="eos-text-lg">
                        <label>Ip Address</label>
                        <span class="ml-9">{{managementdata[index].ip_address}}</span>
                      </div>
                    </div>
                    <div class="mt-3">
                      <div class="eos-text-lg">
                        <label>Hostname</label>
                        <span class="ml-10">{{managementdata[index].hostname}}</span>
                      </div>
                    </div>
                    <div class="mt-3">
                      <div class="eos-text-lg">
                        <label>Netmask</label>
                        <span class="ml-12">{{managementdata[index].gateway}}</span>
                      </div>
                    </div>
                    <div class="mt-3">
                      <div class="eos-text-lg">
                        <label>Gateway</label>
                        <span class="ml-12">{{managementdata[index].netmask}}</span>
                      </div>
                    </div>
                  </div>
                  <!--/div-->
                </div>
              </template>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="eos-text-lg">Data Network setting</v-expansion-panel-header>
          <v-expansion-panel-content>
            <div class="row ma-0 mt-3">
              <template v-for="(node, index) in nodes">
                <div class="col-3 body-2 column node-container mr-5" :key="index">
                  <span class="font-weight-bold" id="lblIpv4Node">{{ node }}</span>
                  <v-divider class="mt-2" />
                  <div class="eos-form-group mt-0 ml-0">
                    <div class="mt-3">
                      <div class="eos-text-lg">
                        <label>Ip Address</label>
                        <span class="ml-9">{{datanetwork[index].ip_address}}</span>
                      </div>
                    </div>
                    <div class="mt-3">
                      <div class="eos-text-lg">
                        <label>Hostname</label>
                        <span class="ml-10">{{datanetwork[index].hostname}}</span>
                      </div>
                    </div>
                    <div class="mt-3">
                      <div class="eos-text-lg">
                        <label>Netmask</label>
                        <span class="ml-12">{{datanetwork[index].gateway}}</span>
                      </div>
                    </div>
                    <div class="mt-3">
                      <div class="eos-text-lg">
                        <label>Gateway</label>
                        <span class="ml-12">{{datanetwork[index].netmask}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="eos-text-lg">DNS Setting</v-expansion-panel-header>
          <v-expansion-panel-content>
            <div class="row ma-0 mt-3">
              <template v-for="(node, index) in nodes">
                <div class="col-3 body-2 column node-container mr-5" :key="index">
                  <span class="font-weight-bold" id="lblIpv4Node">{{ node }}</span>
                  <v-divider class="mt-2" />
                  <div class="eos-form-group mt-0 ml-0">
                    <div class="mt-3">
                      <div class="eos-text-lg">
                        <label>Hostname</label>
                        <span class="ml-12">{{dnsdata[index].hostname}}</span>
                      </div>
                    </div>
                    <div class="mt-3">
                      <div class="eos-text-lg">
                        <label>dnsServers</label>
                        <span class="ml-10">{{dnsdata[index].dns_servers}}</span>
                      </div>
                    </div>
                    <div class="mt-3">
                      <div class="eos-text-lg">
                        <label>searchDomain</label>
                        <span class="ml-5">{{dnsdata[index].search_domain}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { EVENT_BUS } from "./../../../../main";
import {
  SystemConfigObject,
  DnsNetworkSettings
} from "./../../../../models/system-configuration";
@Component({
  name: "eos-onboarding-summary"
})
export default class EosOnboardingSummary extends Vue {
  private data() {
    return {
      managementdata: [],
      datanetwork: [],
      dnsdata: [],
      nodes: [" VIP", "Node 0", "Node1"]
    };
  }
  private mounted() {
    this.managementNetworkGetter();
    EVENT_BUS.$on("emitOnNext", (res: any) => {
      res(true);
    });
  }
  private destroyed() {
    // WizardHook: shut off on exit event listner
    EVENT_BUS.$off("emitOnNext");
  }
  private managementNetworkGetter(): any {
    const systemconfig = this.$store.getters["systemConfig/systemconfig"];
    this.$data.managementdata =
      systemconfig.management_network_settings.ipv4.nodes;
    this.$data.datanetwork = systemconfig.data_network_settings.ipv4.nodes;
    this.$data.dnsdata = systemconfig.dns_network_settings.nodes;
  }
}
</script>
<style lang="scss" scoped>
</style>
