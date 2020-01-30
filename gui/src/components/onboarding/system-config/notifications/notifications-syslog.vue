<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblSysNotification">
        Notifications: Syslog
      </div>
      <div class="mt-5">
        <span class="font-weight-bold" id="iblSysIpAddress"
          >Syslog server IP address</span
        >
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
        <span class="font-weight-bold" id="lblSyPortNo"
          >Syslog server port number</span
        >
        <div>
          <input
            class="input-text"
            type="number"
            name="syslogserverport"
            v-model="syslogserverport"
            id="txtSyslogServerPort"
            min="0001"
            max="65535"
          />
        </div>
      </div>
      <v-divider class="my-5" />
      <div>
        <input
          type="checkbox"
          v-model="syslognotify"
          name="syslognotify"
          id="chkSysLogNotify"
        />
        <span class="ml-3 font-weight-bold" id="lblSyssendLog"
          >Send test syslog notification</span
        >
      </div>
      <div class="my-5 font-weight-regular">
        You will receive a test syslog notification when you apply these
        settings. If you do not receive this notification, your settings may be
        incorrect.
      </div>
      <v-divider class="pt-5" />
    </div>
    <span class="d-none">{{ isValidForm }}</span>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Syslog } from "./../../../../models/system-configuration";
import { EVENT_BUS } from "./../../../../main";

@Component({
  name: "eos-data-network-ipv4"
})
export default class EosDataNetworkIpv4 extends Vue {
  public mounted() {
    this.notificationSyslogGetter();
    // WizardHook: Open a listener for onNext event
    // So when wizard footer clicks on the Next Button this component can perform its own workflow
    EVENT_BUS.$on("emitOnNext", (res: any) => {
      this.setSyslogNotificationSettings().then(result => {
        res(true);
      });
    });
  }
  public notificationSyslogGetter() {
    const notificationConfiguration = this.$store.getters[
      "systemConfig/userConfigData"
    ];

    if (
      notificationConfiguration &&
      notificationConfiguration.notifications &&
      notificationConfiguration.notifications.syslog
    ) {
      this.$data.syslogipaddr =
        notificationConfiguration.notifications.syslog.syslog_server;
      this.$data.syslogserverport =
        notificationConfiguration.notifications.syslog.syslog_port;
      this.$data.syslognotify =
        notificationConfiguration.notifications.syslog.send_test_syslog;
    }
  }
  private destroyed() {
    // WizardHook: shut off on exit event listner
    EVENT_BUS.$off("emitOnNext");
  }
  get isValidForm() {
    const validate = true;
    // WizardHook: Emit event to sibling wizard footer component
    // to send information about data validation to enable/disable wizard footer
    EVENT_BUS.$emit("validForm", validate);
    return validate;
  }
  private data() {
    return {
      syslogipaddr: "",
      syslogserverport: 80,
      syslognotify: false,
      isValid: true
    };
  }
  private setSyslogNotificationSettings() {
    const queryParams: Syslog = {
      syslog_server: this.$data.syslogipaddr,
      syslog_port: this.$data.syslogserverport,
      send_test_syslog: this.$data.syslognotify
    };
    return this.$store.dispatch(
      "systemConfig/updateSyslogNotificationUserConfig",
      queryParams
    );
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
