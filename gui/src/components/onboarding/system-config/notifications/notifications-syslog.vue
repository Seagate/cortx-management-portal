<template>
  <v-container class="mt-6">
    <v-img
      id="alert-img"
      :src="require('./../../../../assets/onboarding-wizard.png')"
      width="780px"
      height="70px"
    ></v-img>
    <v-divider />
    <div class="body-2">
      <div class="title mt-6" id="lblSysNotification">
        Notifications: Syslog
        <v-icon class="green--text" size="20">mdi-help-circle-outline</v-icon>
      </div>
      <div class="mt-5">
        <span class="font-weight-medium" id="iblSysIpAddress">SYSLOG Server IP Address</span>
        <div>
          <input class="input-text" type="text" name="syslogipaddr" v-model="syslogipaddr" id="txtSyslogipadd" />
        </div>
      </div>
      <div class="mt-5">
        <span class="font-weight-medium" id="lblSyPortNo">SYSLOG Server Port Number</span>
        <div>
          <input class="input-text" type="text" name="syslogserverport" v-model="syslogserverport" id="txtSyslogServerPort" />
        </div>
      </div>
      <v-divider class="my-5" />
      <div>
        <input type="checkbox" @change="syslognotify" v-model="syslognotify" name="syslognotify" id="chkSysLogNotify" />
        <span class="ml-3 font-weight-bold" id="lblSyssendLog">Send test SYSLOG notification</span>
      </div>
      <div
        class="my-5 font-weight-regular"
      >You will receive a test SYSLOG notification when you apply these settings. If you do not receive this notification, your settings may be incorrect.</div>
      <v-divider class="pt-5" />
    </div>

    <div class="mt-8">
      <v-btn elevation="0" color="green" id="btnSysApply">
        <span class="white--text" @click="gotToNextPage()">Apply and Continue</span>
      </v-btn>
      <span class="green--text ml-8 pointer" @click="gotToPrevPage()" id="lblSysBack">Back to previous step</span>
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "eos-data-network-ipv4"
})
export default class EosDataNetworkIpv4 extends Vue {
  private gotToNextPage() {
    this.$router.push("interfaceselect");
  }
  private gotToPrevPage() {
    this.$router.push("notificationsemail");
  }
  private data() {
    return {
      syslogipaddr: "",
      syslogserverport: "",
      syslognotify: false
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
