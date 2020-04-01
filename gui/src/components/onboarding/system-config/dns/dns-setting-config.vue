<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="row ma-0">
        <div class="col-1 body-2 column node-container">
          <div class="mt-5 font-weight-bold">
            <div class="mt-6 dns-label">
              <label>DNS server*:</label>
            </div>
            <div class>
              <label>Search domain*:</label>
            </div>
          </div>
        </div>
        <template v-for="node in $v.dnsNodes.$each.$iter">
          <div
            class="col-3 body-2 column node-container mr-5"
            v-if="node.$model.id === 0"
            :key="node.id"
          >
            <div class="mt-0 ml-0">
              <div
                class="eos-form-group eos-form-group-custom mt-3"
                :class="{
                  'eos-form-group--error': node.dns_servers.$error
                }"
              >
                <textarea
                  class="eos-form__input_textarea eos-form__input_textarea-custom"
                  rows="3"
                  placeholder="Enter DNS server value as comma ',' separated"
                  v-model.trim="node.dns_servers.$model"
                  @input="node.dns_servers.$touch"
                  :id="node.$model.id + 'txtDnsServer'"
                  :name="node.$model.id + 'dnsname'"
                ></textarea>
                <div class="eos-form-group-label eos-form-group-error-msg">
                  <label
                    v-if="node.dns_servers.$dirty && !node.dns_servers.required"
                    >DNS address is required</label
                  >
                </div>
              </div>
              <div
                class="eos-form-group eos-form-group-custom mt-3"
                :class="{
                  'eos-form-group--error': node.search_domain.$error
                }"
              >
                <textarea
                  class="eos-form__input_textarea eos-form__input_textarea-custom"
                  :id="node.$model.id + 'txtSearchDomain'"
                  :name="node.$model.id + 'search-domain'"
                  v-model.trim="node.search_domain.$model"
                  rows="3"
                  placeholder="Enter search domain value as comma ',' separated"
                  @input="node.search_domain.$touch"
                ></textarea>
                <div class="eos-form-group-label eos-form-group-error-msg">
                  <label
                    v-if="
                      node.search_domain.$dirty && !node.search_domain.required
                    "
                    >Search domain is required</label
                  >
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <span class="d-none">{{ isValidForm }}{{ managementNetworkGetter }}</span>
    <button
      type="button"
      v-if="$route.path !== '/onboarding'"
      :disabled="$v.$invalid"
      @click="applySettings()"
      class="eos-btn-primary eos-float-l my-10"
    >
      Apply
    </button>
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
  name: "eos-dns-setting-config"
})
export default class EosDnsSettingConfig extends Vue {
  @Validations()
  private validations = {
    dnsNodes: {
      $each: {
        dns_servers: {
          required
        },
        search_domain: {
          required
        }
      }
    }
  };

  private data() {
    return {
      source: "manual",
      dnsNodes: [
        {
          id: 0,
          name: "Node 0",
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
  get managementNetworkGetter(): any {
    const systemconfig = this.$store.getters["systemConfig/systemconfig"];
    if (
      systemconfig.dns_network_settings &&
      systemconfig.dns_network_settings.nodes &&
      systemconfig.dns_network_settings.nodes[0]
    ) {
      this.$data.dnsNodes = systemconfig.dns_network_settings.nodes;
    }
    return true;
  }
  private applySettings() {
    const nodes = this.$data.dnsNodes.map((e: any) => {
      e.dns_servers = this.splitByComma(`${e.dns_servers}`);
      e.search_domain = this.splitByComma(`${e.search_domain}`);
      return e;
    });
    const queryParams: DnsNetworkSettings = {
      nodes
    };
    this.$emit("apply-settings", queryParams);
  }
}
</script>
<style lang="scss" scoped>
.node-container {
  max-width: 25em;
}
.dns-label {
  height: 95px;
}
</style>
