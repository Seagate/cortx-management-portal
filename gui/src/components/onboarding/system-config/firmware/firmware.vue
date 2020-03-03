/*****************************************************************************
 Filename:          firmware.vue
 Description:       Update firmware file component

 Creation Date:     05/02/2019
 Author:            Sanjeevan Bhave

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblUpdateFirmware">Update firmware</div>
      <div class="mt-6" id="lblUpdateFirmwareMsg">
        <span class="eos-text-bold">It is important that you are using the firmware for your system.</span>
        Use the link below to see if there's a newer version.
        <br />If a newer version is available, download it to your device and then install the file using button below.
      </div>
      <div class="mt-6" id="lblVersion">
        <span class="eos-text-bold">Your firmware version:</span> Seagate storage complete 10.2 (Jan 2019 release).
      </div>
      <v-divider class="mt-2 mb-5" />
      <input type="file" id="file" ref="file" v-on:change="handleFileUpload($event.target.files)" />
      <v-divider class="mt-5 mb-2" />
      <div class="mt-8">
        <button
          id="btnInstallFirmware"
          type="button"
          class="eos-btn-primary"
          @click="uploadFirmware()"
        >Install new firmware file</button>
      </div>
    </div>
    <span class="d-none">{{ isValidForm }}</span>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "eos-firmware"
})
export default class EosFirmware extends Vue {
  public data() {
    return {
      file: File
    };
  }

  private handleFileUpload(fileList: FileList) {
    this.$data.file = fileList[0];
  }
  private uploadFirmware() {
    const formData = new FormData();
    formData.append("file", this.$data.file);
    this.$store.dispatch("firmware/uploadFirmware", formData);
  }
}
</script>

<style lang="scss" scoped>
</style>
