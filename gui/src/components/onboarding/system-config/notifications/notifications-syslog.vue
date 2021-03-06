/*
* CORTX-CSM: CORTX Management web and CLI interface.
* Copyright (c) 2020 Seagate Technology LLC and/or its Affiliates
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU Affero General Public License for more details.
* You should have received a copy of the GNU Affero General Public License
* along with this program. If not, see <https://www.gnu.org/licenses/>.
* For any questions about this software or licensing,
* please email opensource@seagate.com or cortx-questions@seagate.com.
*/
<template>
  <v-container class="mt-0 ml-0">
    <div class="pl-4 body-2">
      <div class="title mt-0 font-weight-bold" id="lblSysNotification">
        {{ $t("onBoarding.notificationSysLog") }}
      </div>
      <div class="mt-5">
        <span class="font-weight-bold" id="iblSysIpAddress">{{ $t("onBoarding.sysLogServerIp") }}</span>
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
          >{{ $t("onBoarding.sysLogServerPortNum") }}</span
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
      <v-divider class="pt-5" />
    </div>
    <span class="d-none" id="notification-syslogbtn">{{ isValidForm }}</span>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Syslog } from "./../../../../models/system-configuration";
import { EVENT_BUS } from "./../../../../main";
import i18n from "../../onboarding.json";

@Component({
  name: "cortx-data-network-ipv4",
  i18n: {
    messages: i18n
  }
})
export default class CortxDataNetworkIpv4 extends Vue {
  private data() {
    return {
      syslogipaddr: "",
      syslogserverport: 80,
      isValid: true
    };
  }

  private mounted() {
    this.notificationSyslogGetter();
    // WizardHook: Open a listener for onNext event
    // So when wizard footer clicks on the Next Button this component can perform its own workflow
    EVENT_BUS.$on("emitOnNext", (res: any) => {
      this.setSyslogNotificationSettings().then(result => {
        res(true);
      });
    });
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
  private notificationSyslogGetter() {
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
    }
  }
  private setSyslogNotificationSettings() {
    const queryParams: Syslog = {
      syslog_server: this.$data.syslogipaddr,
      syslog_port: this.$data.syslogserverport
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
