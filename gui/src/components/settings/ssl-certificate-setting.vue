<template>
  <div class="eos-p-2 body-2">
    <div class="eos-text-lg mt-2 font-weight-bold" id="lblSSLUpload">
      SSL upload
    </div>
    <div class="mt-3" id="lblSSLUploadMsg">
      You need to upload ssl and key certificate here
    </div>
    <v-divider class="mt-2" />
    <eosUploadSSLConfig />
  </div>
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
