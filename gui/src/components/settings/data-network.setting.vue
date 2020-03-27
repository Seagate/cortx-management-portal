<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="eos-text-lg mt-0 font-weight-bold" id="lblIpv4DataNetwork">
        Data network settings: IPv4
      </div>
      <div class="mt-6" id="lblIpv4Msg">
        You need to configure a single IP address for management of this system.
      </div>
      <v-divider class="mt-2" />
      <eosDataNetworkIpv4Config />
      <button type="button" class="eos-btn-primary eos-float-l ml-3">
        Apply
      </button>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import EosDataNetworkIpv4Config from "../onboarding/system-config/data-network/data-network-ipv4.config.vue";

@Component({
  name: "eos-data-network-setting",
  components: {
    eosDataNetworkIpv4Config: EosDataNetworkIpv4Config
  }
})
export default class EosDataNetworkSetting extends Vue {}
</script>

<style lang="scss" scoped></style>
