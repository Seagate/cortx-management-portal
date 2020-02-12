<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="eos-text-bold eos-text-lg mt-0 font-weight-bold" id="lblDns">DNS network settings</div>   
    </div>
    <!-- node block -->
    <div class="row ma-0 mt-3">
      <template v-for="node in $v.dnsNodes.$each.$iter">
        <div class="col-3 column node-container mr-5" :key="node.id">
          <span class="font-weight-bold" id="lblIpv4Node">{{ node.$model.name }}</span>
          <v-divider class="mt-2" />
          <div class="eos-form-group mt-0 ml-0">
            <div
              class="mt-3"
              :class="{
                'eos-form-group--error': node.hostname.$error
              }"
            >
              <input
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
            class="mt-3 "
            :class="{
              'eos-form-group--error': node.dnsServerAddress.$error
            }"
          >
            <textarea
              class="eos-form__input_textarea"
              rows="3"
              placeholder="Enter DNS server value as comma ',' seperated"
              v-model.trim="node.dnsServerAddress.$model"
              @input="node.dnsServerAddress.$touch"
              :id="node.$model.id + 'txtDnsServer'"
              :name="node.$model.id + 'dnsname'"
            ></textarea>
            <div class="eos-form-group-label eos-form-group-error-msg">
              <label v-if="node.dnsServerAddress.$dirty && !node.dnsServerAddress.required">DNS address is required</label>
            </div>
          </div>
          <div
            class="mt-3"
            :class="{
              'eos-form-group--error': node.searchDomainAddress.$error
            }"
          >
            <textarea
              class="eos-form__input_textarea"
              :id="node.$model.id + 'txtSearchDomain'"
              :name="node.$model.id + 'search-domain'"
               v-model.trim="node.searchDomainAddress.$model"
               rows="3"
               placeholder="Enter Search domain value  as comma ',' seperated "
               @input="node.searchDomainAddress.$touch"
            ></textarea>
            <div class="eos-form-group-label eos-form-group-error-msg">
                <label v-if="node.searchDomainAddress.$dirty && !node.searchDomainAddress.required">Search domain is required</label>
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
        dnsServerAddress: {
          required
        },
        searchDomainAddress: {
          required
        }
      }
    }
  };

  private data() {
    return {
      hostname: "",
      source: "manual",
      dnsNodes: [
        {
          id: 2,
          name: "VIP",
          hostname: "",
          dnsServerAddress: [],
          searchDomainAddress: []
        },
        {
          id: 0,
          name: "Node 0",
          hostname: "",
          dnsServerAddress: [],
          searchDomainAddress: []
        },
        {
          id: 1,
          name: "Node 1",
          hostname: "",
          dnsServerAddress: [],
          searchDomainAddress: []
        }
        
      ],
      isValid: true
    };
  }

  private splitByComma(str: string) {
    return str.split(",").filter(Boolean);
  }
  private updateDNSconfig() {
    const dnsServers = this.splitByComma(`${this.$data.dnsServerAddress}`);
    const searchDomains = this.splitByComma(
      `${this.$data.searchDomainAddress}`
    );

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
    // const systemconfig = this.$store.getters["systemConfig/systemconfig"];
    // if (
    //   systemconfig.dns_network_settings &&
    //   systemconfig.dns_network_settings.nodes
    // ) {
    //   this.$data.hostname = systemconfig.dns_network_settings.hostname;
    //   this.$data.dnsServerAddress =
    //     systemconfig.dns_network_settings.dns_servers;
    //   this.$data.searchDomainAddress =
    //     systemconfig.dns_network_settings.search_domain;
    //   this.$data.dnsNodes = systemconfig.dns_network_settings.nodes;
    // }
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
.node-container {
  max-width: 25em;
}
</style>
