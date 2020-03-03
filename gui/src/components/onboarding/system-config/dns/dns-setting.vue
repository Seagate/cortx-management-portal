<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblDns">DNS network settings</div>
    </div>
    <!-- node block -->
    <div class="row ma-0 mt-5">
      <div class="col-1 body-2 column node-container mt-5">
        <div class="mt-10 font-weight-bold">
          <div class="mt-12" v-if="source == 'manual'">
            <label>Hostname*</label>
          </div>
          <div class="mt-12 netmasklabel">
            <label>DNS server*</label>
          </div>
          <div class>
            <label>Search domain*</label>
          </div>
        </div>
      </div>
      <template v-for="node in $v.dnsNodes.$each.$iter">
        <div class="col-2 body-2 column node-container mr-5" :key="node.id">
          <span class="font-weight-bold" id="lblIpv4Node">{{ node.$model.name }}</span>
          <v-divider class="mt-2" />
          <div class="eos-form-group mt-0 ml-0">
            <div
              class
              :class="{
                'eos-form-group--error': node.hostname.$error
              }"
            >
              <input
                v-on:change="setHostname"
                class="eos-form__input_text mt-7"
                type="text"
                v-model.trim="node.hostname.$model"
                @input="node.hostname.$touch"
                :id="node.$model.id + 'txtDnsHostname'"
                :name="node.$model.id + 'hostname'"
                placeholder="Hostname"
              />
              <div class="eos-form-group-label eos-form-group-error-msg">
                <label v-if="node.hostname.$dirty && !node.hostname.required">Hostname is required</label>
              </div>
            </div>
            <div
              class="mt-3"
              :class="{
              'eos-form-group--error': node.dns_servers.$error
            }"
            >
              <textarea
                v-on:change="setdnsServerAddress"
                class="eos-form__input_textarea"
                rows="3"
                placeholder="Enter DNS server value as comma ',' seperated"
                v-model.trim="node.dns_servers.$model"
                @input="node.dns_servers.$touch"
                :id="node.$model.id + 'txtDnsServer'"
                :name="node.$model.id + 'dnsname'"
              ></textarea>
              <div class="eos-form-group-label eos-form-group-error-msg">
                <label
                  v-if="node.dns_servers.$dirty && !node.dns_servers.required"
                >DNS address is required</label>
              </div>
            </div>
            <div
              class="mt-3"
              :class="{
              'eos-form-group--error': node.search_domain.$error
            }"
            >
              <textarea
                v-on:change="setsearchDomainAddress"
                class="eos-form__input_textarea"
                :id="node.$model.id + 'txtSearchDomain'"
                :name="node.$model.id + 'search-domain'"
                v-model.trim="node.search_domain.$model"
                rows="3"
                placeholder="Enter Search domain value  as comma ',' seperated "
                @input="node.search_domain.$touch"
              ></textarea>
              <div class="eos-form-group-label eos-form-group-error-msg">
                <label
                  v-if="node.search_domain.$dirty && !node.search_domain.required"
                >Search domain is required</label>
              </div>
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
  DnsNetworkSettings
} from "./../../../../models/system-configuration";
import { EVENT_BUS } from "./../../../../main";
import { Validations } from "vuelidate-property-decorators";
import {
  required,
  helpers,
  sameAs,
  ipAddress,
  requiredIf
} from "vuelidate/lib/validators";
@Component({
  name: "eos-dns-setting"
})
export default class EosDnsSetting extends Vue {
  @Validations()
  private validations = {
    dnsNodes: {
      $each: {
        hostname: {
          required
        },
        dns_servers: {
          required
        },
        search_domain: {
          required
        }
      }
    }
  };

  private setHostname(e: any) {
    if (this.$v.dnsNodes.$model[1].hostname === "") {
      this.$v.dnsNodes.$model[1].hostname = e.target.value;
    }
    if (this.$v.dnsNodes.$model[2].hostname === "") {
      this.$v.dnsNodes.$model[2].hostname = e.target.value;
    }
  }
  private setdnsServerAddress(e: any) {
    if (this.$v.dnsNodes.$model[1].dns_servers === "") {
      this.$v.dnsNodes.$model[1].dns_servers = e.target.value;
    }
    if (this.$v.dnsNodes.$model[2].dns_servers === "") {
      this.$v.dnsNodes.$model[2].dns_servers = e.target.value;
    }
  }
  private setsearchDomainAddress(e: any) {
    if (this.$v.dnsNodes.$model[1].search_domain === "") {
      this.$v.dnsNodes.$model[1].search_domain = e.target.value;
    }
    if (this.$v.dnsNodes.$model[2].search_domain === "") {
      this.$v.dnsNodes.$model[2].search_domain = e.target.value;
    }
  }
  private data() {
    return {
      source: "manual",
      dnsNodes: [
        {
          id: 2,
          name: "VIP",
          hostname: "",
          dns_servers: "",
          search_domain: ""
        },
        {
          id: 0,
          name: "Node 0",
          hostname: "",
          dns_servers: "",
          search_domain: ""
        },
        {
          id: 1,
          name: "Node 1",
          hostname: "",
          dns_servers: "",
          search_domain: ""
        }
      ],
      isValid: true
    };
  }

  private splitByComma(str: string) {
    return str.split(",").filter(Boolean);
  }
  private updateDNSconfig() {
    this.$data.dnsNodes = this.$data.dnsNodes.map((e: any) => {
      e.dns_servers = this.splitByComma(`${e.dns_servers}`);
      e.search_domain = this.splitByComma(`${e.search_domain}`);
      return e;
    });
    const queryParams: DnsNetworkSettings = {
      nodes: this.$data.dnsNodes
    };
    return this.$store.dispatch("systemConfig/updateDNSSetting", queryParams);
  }
  private mounted() {
    this.managementNetworkGetter();
    // WizardHook: Open a listener for onNext event
    // So when wizard footer clicks on the Next Button this component can perform its own workflow
    EVENT_BUS.$on("emitOnNext", (res: any) => {
      this.updateDNSconfig().then(result => {
        res(true);
      });
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
    EVENT_BUS.$emit("validForm", !this.$v.$invalid);
    return validate;
  }
  private managementNetworkGetter(): any {
    const systemconfig = this.$store.getters["systemConfig/systemconfig"];
    if (
      systemconfig.dns_network_settings &&
      systemconfig.dns_network_settings.nodes
    ) {
      this.$data.dnsNodes = systemconfig.dns_network_settings.nodes;
    }
  }
}
</script>
<style lang="scss" scoped>
.node-container {
  max-width: 25em;
}
.netmasklabel {
  height: 130px;
}
</style>
