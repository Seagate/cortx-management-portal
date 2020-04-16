<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblDns">
        DNS resolver settings
      </div>
      <div class="mt-3" id="lblMandatoryMsg">
        Fields marked with * are mandatory.
      </div>
    </div>
    <v-divider class="mt-2" />
    <eosDnsSettingConfig />
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import EosDnsSettingConfig from "./dns-setting-config.vue";

@Component({
  name: "eos-dns-setting",
  components: {
    eosDnsSettingConfig: EosDnsSettingConfig
  }
})
export default class EosDnsSetting extends Vue {}
</script>
<style lang="scss" scoped></style>
