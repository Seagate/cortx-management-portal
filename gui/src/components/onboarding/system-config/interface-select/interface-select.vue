<template>
  <v-container class="mt-6 body-2">
    <v-img
      id="alert-img"
      :src="require('./../../../../assets/onboarding-wizard.png')"
      width="780px"
      height="70px"
    ></v-img>
    <v-divider />
    <div>
      <div class="title mt-6 csmprimary--text" id="lblInterface">Interface Selection</div>
    </div>
    <div class="mt-4">
      <div class="font-weight-regular black--text" id="lblInterfaceMsg">
        Select an Object-Based Interface (S3) or a Network File System (NFS), or both.
      </div>

      <div class="mt-5 font-weight-regular black--text" id="lblInterfaceMsgChoose">
        Choose which interface(s) you'd like to establish. You must pick at least one of these.
      </div>
      <v-divider class="mt-5" />
      <div class="mt-5">
        <input type="checkbox" @change="s3" v-model="s3" name="s3" id="chkInterfaceS3" />
        <span class="ml-3 font-weight-medium csmprimary--text" id="lblInterfaceChooseStorage"
          >Object-Based Storage (S3)</span
        >
        <div class="mt-5 font-weight-regular black--text" id="lblInterfaceConfig">
          Start configuration for Object-Based Storage (S3).
        </div>
      </div>
      <div class="mt-5">
        <input type="checkbox" @change="nfs" v-model="nfs" name="nfs" id="txtInterfaceNfs" />
        <span class="ml-3 font-weight-medium csmprimary--text" id="lblInterfaceNFS">Network File System (NFS)</span>
        <div class="mt-5 font-weight-regular black--text">Start configuration for Network File System (NFS).</div>
      </div>
    </div>
    <v-divider class="mt-8" />
    <div class="mt-3">
      <v-btn elevation="0" color="csmprimary" @click="gotToNextPage()" id="btnInterfaceContinue">
        <span class="white--text">Continue</span>
      </v-btn>
      <span class="csmprimary--text ml-8 pointer" @click="gotToPrevPage()" id="lblInterfaceBack"
        >Back to previous step</span
      >
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "eos-interface-select"
})
export default class EosInterfaceSelect extends Vue {
  public gotToNextPage() {
    // this.$router.push("notificationsemail");
  }
  public gotToPrevPage() {
    if(this.$store.getters["systemConfig/isSysLogSettingsStatus"] === true) {
      this.$router.push("notificationssyslog");
    } else if (this.$store.getters["systemConfig/isEmailSettingsStatus"] === true) {
      this.$router.push("notificationsemail");
    } else {
      this.$router.push("notifications");
    }    
  }
  private data() {
    return {
      s3: false,
      nfs: false
    };
  }
}
</script>
<style lang="scss" scoped>
.input-text {
  border-style: solid;
  border-width: 1px;
  border-color: #e3e3e3;
  width: 20em;
  height: 2.5em;
}
.pointer {
  cursor: pointer;
}
</style>
