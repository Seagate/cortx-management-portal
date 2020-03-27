<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="eos-text-lg mt-0 font-weight-bold" id="lblDns">
        DNS network settings
      </div>
    </div>
    <eosDnsSettingConfig />
    <button type="button" class="eos-btn-primary eos-float-l ml-3">
      Apply
    </button>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import EosDnsSettingConfig from "../onboarding/system-config/dns/dns-setting-config.vue";

@Component({
  name: "eos-dns-data-setting",
  components: {
    eosDnsSettingConfig: EosDnsSettingConfig
  }
})
export default class EosDnsDataSetting extends Vue {}
</script>
<style lang="scss" scoped></style>
