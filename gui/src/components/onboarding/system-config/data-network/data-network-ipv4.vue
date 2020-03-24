<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblIpv4Dns">Data network settings: IPv4</div>
      <div
        class="mt-6"
        id="lblIpv4Msg"
      >You need to configure a single IP address for management of this system.</div>
      <v-divider class="mt-2" />
      <eosDataNetworkIpv4Config/>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import EosDataNetworkIpv4Config from "./data-network-ipv4.config.vue";

@Component({
  name: "eos-data-network-ipv4",
  components: {
    eosDataNetworkIpv4Config: EosDataNetworkIpv4Config

  }
})

export default class EosDataNetworkIpv4 extends Vue {}
</script>

<style lang="scss" scoped>
</style>
