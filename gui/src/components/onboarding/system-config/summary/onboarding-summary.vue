<template>
  <v-container class="mt-6 ml-0">
    <div id="app">
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header  class="eos-text-lg">Management Network setting</v-expansion-panel-header>
          <v-expansion-panel-content>
            <div class="row ma-0 mt-3">
              <template v-for="(node, index) in Nodes">
                <div class="col-3 body-2 column node-container mr-5" :key="index">
                  <span class="font-weight-bold" id="lblIpv4Node">{{ node }}</span>
                  <v-divider class="mt-2" />
                  <div class="eos-form-group mt-0 ml-0">
                    <div class="mt-3">
                      <div class="eos-text-lg ">
                        <label>Ip Address:{{managementdata[index].ip_address}}</label>
                      </div>
                    </div>
                    <div class="mt-3">
                     <div class="eos-text-lg ">
                        <label>Hostname:{{managementdata[index].hostname}}</label>
                      </div>
                    </div>
                    <div class="mt-3">
                      <div class="eos-text-lg ">
                        <label>Netmask:{{managementdata[index].gateway}}</label>
                      </div>
                    </div>
                    <div class="mt-3">
                   <div class="eos-text-lg ">
                        <label>Gateway:{{managementdata[index].netmask}}</label>
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
              <template v-for="(node, index) in Nodes">
                <div class="col-3 body-2 column node-container mr-5" :key="index">
                  <span class="font-weight-bold" id="lblIpv4Node">{{ node }}</span>
                  <v-divider class="mt-2" />
                  <div class="eos-form-group mt-0 ml-0">
                    <div class="mt-3">
                      <div class="eos-text-lg ">
                        <label>Ip Address:{{datanetwork[index].ip_address}}</label>
                      </div>
                    </div>
                    <div class="mt-3">
                       <div class="eos-text-lg ">
                        <label>Hostname:{{datanetwork[index].hostname}}</label>
                      </div>
                    </div>
                    <div class="mt-3">
                       <div class="eos-text-lg ">
                        <label>Netmask:{{datanetwork[index].gateway}}</label>
                      </div>
                    </div>
                    <div class="mt-3">
                      <div class="eos-text-lg ">
                        <label>Gateway:{{datanetwork[index].netmask}}</label>
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
              <template v-for="(node, index) in Nodes">
                <div class="col-3 body-2 column node-container mr-5" :key="index">
                  <span class="font-weight-bold" id="lblIpv4Node">{{ node }}</span>
                  <v-divider class="mt-2" />
                  <div class="eos-form-group mt-0 ml-0">
                    <div class="mt-3">
                      <div class="eos-text-lg ">
                        <label>Hostname:{{dnsdata[index].hostname}}</label>
                      </div>
                    </div>
                    <div class="mt-3">
                      <div class="eos-text-lg ">
                        <label>dns_servers:{{dnsdata[index].dns_servers}}</label>
                      </div>
                    </div>
                    <div class="mt-3">
                      <div class="eos-text-lg ">
                        <label>search_domain:{{dnsdata[index].search_domain}}</label>
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
      Nodes: [" VIP", "Node 0", "Node1"]
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
