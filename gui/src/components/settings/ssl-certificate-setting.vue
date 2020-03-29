<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="eos-text-lg mt-0 font-weight-bold" id="lblIpv4Dns">
        SSL Upload
      </div>
      <div class="mt-6" id="lblIpv4Msg">
        You need to upload ssl and key certificate here
      </div>
      <eosUploadSSLConfig />
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import EOSUploadSSLConfig from "../onboarding/system-config/ssl-certificate/upload-ssl-config.vue";

@Component({
  name: "upload-ssl-setting",
  components: {
    eosUploadSSLConfig: EOSUploadSSLConfig
  }
})
export default class EOSUploadSSLSetting extends Vue {}
</script>
<style lang="scss" scoped></style>
