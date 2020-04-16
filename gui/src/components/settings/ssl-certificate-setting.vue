<template>
  <div class="eos-p-2 body-2">
    <div class="eos-text-lg mt-2 font-weight-bold" id="lblSSLUpload">
      SSL certificate upload
    </div>
    <div class="mt-3" id="lblSSLUploadMsg">
      By default, the system uses the SSL certificate provided by Seagate. To
      use a different SSL certificate, click Choose File to browse and select
      the appropriate SSL Certificate file. Click Upload certificate to upload
      the selected SSL certificate.
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
