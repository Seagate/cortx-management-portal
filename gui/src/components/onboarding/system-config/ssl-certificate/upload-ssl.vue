<template>
  <v-container>
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblIpv4Dns">SSL Upload</div>
      <div
        class="mt-6"
        id="lblIpv4Msg"
      >You need to upload ssl and key certificate here</div>
      <eosUploadSSLConfig/>
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

export default class EOSUploadSSL extends Vue {
}

</script>
<style lang="scss" scoped>
</style>
