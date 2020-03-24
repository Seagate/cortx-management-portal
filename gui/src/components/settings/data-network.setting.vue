<template>
  <v-container class="mt-0 ml-0 pt-0">
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblIpv4Dns">Data network settings: IPv4</div>
      <div class="mt-6" id="lblIpv4Msg">Test Data for network setting </div>
      <v-divider class="mt-2" />
      <eosDataNetworkIpv4Config />
      <button
        type="button"
        class="eos-btn-primary eos-float-l ml-3"
        >Apply
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

<style lang="scss" scoped>
</style>
