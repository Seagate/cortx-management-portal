<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div
        class="eos-text-lg mt-0 font-weight-bold"
        id="lblNetworkIP4"
      >Management network settings: IPv4</div>
      <div
        class="mt-6"
        id="lblNetworkMsg"
      >Test Data for Management settings .</div>
      <v-divider class="mt-2" />
      <eosNetworkSettingsIpv4/>
      <button 
        type="button" 
        class="eos-btn-primary eos-float-l ml-3">
        Apply
    </button>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import EosNetworkSettingsIpv4Config from "../onboarding/system-config/mgmt-network/network-settings-ipv4-config.vue";

@Component({
  name: "eos-mgmt-settings",
  components: {
    eosNetworkSettingsIpv4: EosNetworkSettingsIpv4Config
  }
})

export default class EosMangementSetting extends Vue {}
</script>

<style lang="scss" scoped>
</style>
