<template>
  <v-container>
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblIpv4Dns">SSL Upload</div>
      <div
        class="mt-6"
        id="lblIpv4Msg"
      >You need to upload ssl and key certificate here</div>
      <eosUploadSSLConfig/>
      <button
        type="button"
        class="eos-btn-primary eos-float-l ml-3"
        >Apply
      </button>
    </div>
   </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import EOSUploadSSLConfig from "../onboarding/system-config/ssl-certificate/upload-ssl-config.vue";

@Component({
  name: "uploade-ssl-setting",
  components: {
    eosUploadSSLConfig: EOSUploadSSLConfig
  }
})

export default class EOSUploadSSLSetting extends Vue {
}

</script>
<style lang="scss" scoped>
</style>
