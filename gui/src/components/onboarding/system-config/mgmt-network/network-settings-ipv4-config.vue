<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="font-weight-bold mt-6" id="lblIp4Source">
        Source:
        <label class="eos-rdb-container ml-10">
          DHCP
          <input
            type="radio"
            name="DHCP"
            v-model="source"
            value="DHCP"
            id="txtIP4DHCP"
          />
          <span class="eos-rdb-tick" id="lblIp4DHCP"></span>
        </label>
      </div>
      <div class="row ma-0 mt-3">
        <div class="col-1 body-2 column pa-0 node-container">
          <div class="mt-5 font-weight-bold">
            <div class="mt-6">
              <label>VIP*: </label>
            </div>
          </div>
        </div>
        <template v-for="node in $v.ipv4Nodes.$each.$iter">
          <div class="col-3 body-2 column pa-0 node-container" :key="node.id">
            <div class="mt-5">
              <div
                class
                :class="{
                  'eos-form-group--error': node.ip_address.$error
                }"
              >
                <input
                  class="eos-form__input_text"
                  type="text"
                  :id="node.$model.id + 'txtMngmtNetworkIpv4Ipaddress'"
                  :name="node.$model.id + 'ipaddress'"
                  v-model.trim="node.ip_address.$model"
                  @input="node.ip_address.$touch"
                />
                <div class="eos-form-group-label eos-form-group-error-msg">
                  <label
                    v-if="node.ip_address.$dirty && !node.ip_address.required"
                    >IP address is required</label
                  >
                  <label
                    v-else-if="
                      node.ip_address.$dirty && !node.ip_address.ipAddress
                    "
                    >Invalid IP address</label
                  >
                </div>
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
import { Validations } from "vuelidate-property-decorators";
import {
  required,
  helpers,
  sameAs,
  ipAddress,
  requiredIf
} from "vuelidate/lib/validators";
import { mapState } from "vuex";
import {
  SystemConfigObject,
  Ipv4
} from "./../../../../models/system-configuration";
import { EVENT_BUS } from "./../../../../main";

@Component({
  name: "eos-network-settings-ipv4-config"
})
export default class EosNetworkSettingsIpv4Config extends Vue {
  @Validations()
  private validations = {
    ipv4Nodes: {
      $each: {
        ip_address: {
          required,
          ipAddress
        }
      }
    }
  };
  private data() {
    return {
      source: "DHCP",
      systemConfigObject: {} as SystemConfigObject,
      isValid: true,
      ipv4Nodes: [
        {
          id: 2,
          name: "VIP",
          ip_address: "",
          hostname: "",
          netmask: "",
          gateway: ""
        }
      ]
    };
  }

  private mounted() {
    this.managementNetworkGetter();
    // WizardHook: Open a listener for onNext event
    // So when wizard footer clicks on the Next Button this component can perform its own workflow
    EVENT_BUS.$on("emitOnNext", (res: any) => {
      this.updateIpv4Config().then(result => {
        res(true);
      });
    });
  }
  private destroyed() {
    // WizardHook: shut off on exit event listener
    EVENT_BUS.$off("emitOnNext");
  }
  get isValidForm() {
    // WizardHook: Emit event to sibling wizard footer component
    // to send information about data validation to enable/disable wizard footer
    EVENT_BUS.$emit("validForm", !this.$v.$invalid);
    return true;
  }
  private managementNetworkGetter(): any {
    const systemconfig = this.$store.getters["systemConfig/systemconfig"];
    const mngmtNetworkSettings = systemconfig.management_network_settings;
    if (
      mngmtNetworkSettings &&
      mngmtNetworkSettings.ipv4 &&
      mngmtNetworkSettings.ipv4.nodes
    ) {
      this.$data.source =
        mngmtNetworkSettings.ipv4.is_dhcp === true ? "DHCP" : "manual";
      this.$data.ipv4Nodes = mngmtNetworkSettings.ipv4.nodes;
    }
  }
  private updateIpv4Config() {
    const queryParams: Ipv4 = {
      is_dhcp: this.$data.source === "DHCP",
      nodes: this.$data.ipv4Nodes
    };
    return this.$store.dispatch("systemConfig/updateMngmtIpv4", queryParams);
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

.node-container {
  max-width: 25em;
}
</style>
