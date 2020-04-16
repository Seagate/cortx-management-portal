<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblNetworkIP4">
        Management network settings: IPv4
      </div>
      <div class="mt-3" id="lblNetworkMsg">
        Configure the Virtual IP address for managing this system.
      </div>
       <div class="mt-3" id="lblMandatoryMsg">
        Fields marked with * are mandatory.
      </div>
      <v-divider class="mt-2" />
      <eosNetworkSettingsIpv4 />
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import EosNetworkSettingsIpv4Config from "./network-settings-ipv4-config.vue";

@Component({
  name: "eos-network-settings-ipv4",
  components: {
    eosNetworkSettingsIpv4: EosNetworkSettingsIpv4Config
  }
})
export default class EosNetworkSettingsIpv4 extends Vue {}
</script>

<style lang="scss" scoped></style>
