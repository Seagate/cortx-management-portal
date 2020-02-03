<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblDns">
        DNS network settings
      </div>
      <div class="row mt-4">
        <div class="col-4 column node-container py-0">
          <div
            class="eos-form-group"
            :class="{
              'eos-form-group--error': $v.hostname.$error
            }"
          >
            <label class="eos-form-group-label" for="Hostname">Hostname*</label>
            <input
              class="eos-form__input_text"
              type="text"
              id="txtHostname"
              name="hostname"
              v-model.trim="hostname"
              @input="$v.hostname.$touch"
            />
            <div class="eos-form-group-label eos-form-group-error-msg">
              <label v-if="$v.hostname.$dirty && !$v.hostname.required"
                >Hostname is required</label
              >
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-4 column node-container py-0">
          <div
            class="eos-form-group"
            :class="{
              'eos-form-group--error': $v.dnsServerAddress.$error
            }"
          >
            <label class="eos-form-group-label" for="accountName"
              >DNS server*</label
            >
            <textarea
              class="eos-form__input_textarea"
              id="txtDnsServer"
              name="dnsname"
              v-model="dnsServerAddress"
              rows="3"
              placeholder="Enter comma ',' seperated values"
              @input="$v.dnsServerAddress.$touch"
            ></textarea>
            <div class="eos-form-group-label eos-form-group-error-msg">
              <label
                v-if="
                  $v.dnsServerAddress.$dirty && !$v.dnsServerAddress.required
                "
                >DNS address is required</label
              >
            </div>
          </div>
        </div>
        <div class="col-4 column node-container py-0">
          <div
            class="eos-form-group"
            :class="{
              'eos-form-group--error': $v.searchDomainAddress.$error
            }"
          >
            <label class="eos-form-group-label" for="accountName"
              >Search domain*</label
            >
            <textarea
              class="eos-form__input_textarea"
              id="txtSearchDomain"
              name="search-domain"
              v-model="searchDomainAddress"
              rows="3"
              placeholder="Enter comma ',' seperated values"
              @input="$v.searchDomainAddress.$touch"
            ></textarea>
            <div class="eos-form-group-label eos-form-group-error-msg">
              <label
                v-if="
                  $v.searchDomainAddress.$dirty &&
                    !$v.searchDomainAddress.required
                "
                >Search domain is required</label
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- node block -->
    <div class="row ma-0 mt-3">
      <template v-for="node in $v.dnsNodes.$each.$iter">
        <div class="col-3 body-1 column node-container" :key="node.id">
          <span class="font-weight-bold" id="lblIpv4Node"
            >Node {{ node.$model.id }}</span
          >
          <v-divider class="mt-2" />
          <div class="eos-form-group mt-0">
            <div
              class="eos-form-group"
              :class="{
                'eos-form-group--error': node.hostname.$error
              }"
            >
              <label
                class="eos-form-group-label"
                :id="node.$model.id + 'lblDNS4Hostname'"
                :for="node.$model.id + 'txtDNSHostname'"
                >Hostname*</label
              >
              <input
                class="eos-form__input_text"
                type="text"
                v-model.trim="node.hostname.$model"
                @input="node.hostname.$touch"
                :id="node.$model.id + 'txtDnsHostname'"
                :name="node.$model.id + 'hostname'"
              />
              <div class="eos-form-group-label eos-form-group-error-msg">
                <label v-if="node.hostname.$dirty && !node.hostname.required"
                  >Hostname is required</label
                >
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
    hostname: {
      required
    },
    dnsServerAddress: {
      required
    },
    searchDomainAddress: {
      required
    },
    dnsNodes: {
      $each: {
        hostname: {
          required
        }
      }
    }
  };

  private data() {
    return {
      hostname: "",
      source: "manual",
      dnsServerAddress: [],
      searchDomainAddress: [],
      dnsNodes: [
        {
          id: 0,
          hostname: ""
        },
        {
          id: 1,
          hostname: ""
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
      hostname: this.$data.hostname,
      nodes: this.$data.dnsNodes,
      dns_servers: dnsServers,
      search_domain: searchDomains
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
      this.$data.hostname = systemconfig.dns_network_settings.hostname;
      this.$data.dnsServerAddress =
        systemconfig.dns_network_settings.dns_servers;
      this.$data.searchDomainAddress =
        systemconfig.dns_network_settings.search_domain;
      this.$data.dnsNodes = systemconfig.dns_network_settings.nodes;
    }
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
