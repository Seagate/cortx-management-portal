<template>
  <v-container>
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblSSLUpload">
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
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import {
  SystemConfigObject,
  DnsNetworkSettings
} from "./../../../../models/system-configuration";
import { EVENT_BUS } from "./../../../../main";
import { Validations } from "vuelidate-property-decorators";
import {
  required,
  helpers,
  sameAs,
  ipAddress,
  requiredIf
} from "vuelidate/lib/validators";
import EOSUploadSSLConfig from "./upload-ssl-config.vue";

@Component({
  name: "uploade-ssl",
  components: {
    eosUploadSSLConfig: EOSUploadSSLConfig
  }
})
export default class EOSUploadSSL extends Vue {}
</script>
<style lang="scss" scoped></style>
