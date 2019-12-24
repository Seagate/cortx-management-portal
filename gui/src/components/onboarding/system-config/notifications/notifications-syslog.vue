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
      <div class="title mt-6" id="lblSysNotification">Notifications: Syslog</div>
      <div class="mt-5">
        <span class="font-weight-medium" id="iblSysIpAddress">SYSLOG Server IP Address</span>
        <div>
          <input
            class="input-text"
            type="text"
            name="syslogipaddr"
            v-model="syslogipaddr"
            id="txtSyslogipadd"
          />
        </div>
      </div>
      <div class="mt-5">
        <span class="font-weight-medium" id="lblSyPortNo">SYSLOG Server Port Number</span>
        <div>
          <input class="input-text" type="number" name="syslogserverport" v-model="syslogserverport" id="txtSyslogServerPort" min=0001 max=65535/>
        </div>
      </div>
      <v-divider class="my-5" />
      <div>
        <input type="checkbox" v-model="syslognotify" name="syslognotify" id="chkSysLogNotify" />
        <span class="ml-3 font-weight-bold" id="lblSyssendLog">Send test SYSLOG notification</span>
      </div>
      <div class="my-5 font-weight-regular">
        You will receive a test SYSLOG notification when you apply these settings. If you do not receive this
        notification, your settings may be incorrect.
      </div>
      <v-divider class="pt-5" />
    </div>

    <div class="mt-8">
      <v-btn elevation="0" color="csmprimary" @click="gotToNextPage()" id="btnSysApply">
        <span class="white--text">Apply and Continue</span>
      </v-btn>
      <span
        class="csmprimary--text ml-8 pointer"
        @click="gotToPrevPage()"
        id="lblSysBack"
      >Back to previous step</span>
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Syslog } from "./../../../../models/user-config";

@Component({
  name: "eos-data-network-ipv4"
})
export default class EosDataNetworkIpv4 extends Vue {
  public mounted(){
    const notificationConfiguration = this.$store.getters["userConfig/userConfigData"];
    console.log("TCL: EosUserSettingLdap -> mounted -> notificationConfiguration", notificationConfiguration)
    if(notificationConfiguration && notificationConfiguration.notifications && notificationConfiguration.notifications.syslog){
      this.$data.syslogipaddr = notificationConfiguration.notifications.syslog.syslog_server;
      this.$data.syslogserverport = notificationConfiguration.notifications.syslog.syslog_port;
      this.$data.syslognotify = notificationConfiguration.notifications.syslog.send_test_syslog;      
    }
  }
  private gotToNextPage() {
    this.setSyslogNotificationSettings();
    this.$router.push("interfaceselect");
  }
  private gotToPrevPage() {
    if (this.$store.getters["userConfig/isEmailSettingsStatus"] === true) {
      this.$router.push("notificationsemail");
    } else {
      this.$router.push("notifications");
    }
  }
  private data() {
    return {
      syslogipaddr: "",
      syslogserverport: 80,
      syslognotify: false
    };
  }
  private setSyslogNotificationSettings() {
    const queryParams: Syslog = {
      syslog_server: this.$data.syslogipaddr,
      syslog_port: this.$data.syslogserverport,
      send_test_syslog: this.$data.syslognotify
    };
    this.$store
      .dispatch("userConfig/updateSyslogNotificationUserConfig", queryParams)
      .then((res: any) => {
        console.log("TCL: EosDataNetworkIpv4 -> setSyslogNotificationSettings -> res", res);        
      })
      .catch(() => {
        console.error("Save Email Notifications settings Failed");
      });    
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
