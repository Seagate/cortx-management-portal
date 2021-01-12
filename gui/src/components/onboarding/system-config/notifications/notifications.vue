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
      <div class="title mt-0 font-weight-bold" id="lblNotification">
        {{ $t("onBoarding.notificationSettings") }}
      </div>
      <div class="mt-3">
        <div class="font-weight-regular black--text" id="lblNotificationMsg">
          {{ $t("onBoarding.notificationSettingsMsg") }}
        </div>

        <v-divider class="mt-3" />
        <div class="mt-6">
          <label class="cortx-ckb-container" for="chkNotificationEmail">
            {{ $t("common.email") }}
            
            <input
              type="checkbox"
              v-model="isEmailSettingsStatus"
              name="email"
              :disabled="isSkip"
              id="chkNotificationEmail"
            />
            <span class="cortx-ckb-tick"></span>
          </label>
          <div
            class="mt-2 font-weight-regular black--text"
            id="lblNotificationConfig"
          >
            {{ $t("onBoarding.notificationConfig") }}
          </div>
        </div>
        <div class="mt-5">
          <label class="cortx-ckb-container" for="chkNotificationSkip">
            {{ $t("onBoarding.skipStep") }}
            <input
              type="checkbox"
              v-model="isSkip"
              name="skip"
              :disabled="isEmailSettingsStatus || isSysLogSettingsStatus"
              id="chkNotificationSkip"
            />
            <span class="cortx-ckb-tick"></span>
          </label>
          <div class="mt-2 font-weight-regular black--text">
            {{ $t("onBoarding.configLater") }}
          </div>
        </div>
      </div>
    </div>
    <span class="d-none">{{ isValidForm }}</span>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { EVENT_BUS } from "./../../../../main";
import i18n from "../../onboarding.json";

@Component({
  name: "cortx-notifications",
  i18n: {
    messages: i18n
  }
})
export default class CortxNotifications extends Vue {
  public data() {
    return {
      isSkip: false
    };
  }
  public mounted() {
    // WizardHook: Open a listener for onNext event
    // So when wizard footer clicks on the Next Button this component can perform its own workflow
    EVENT_BUS.$on("emitOnNext", (res: any) => {
      res(true);
    });
  }
  public destroyed() {
    // WizardHook: shut off on exit event listener
    EVENT_BUS.$off("emitOnNext");
  }
  get isValidForm() {
    // WizardHook: Emit event to sibling wizard footer component
    // to send information about data validation to enable/disable wizard footer
    EVENT_BUS.$emit(
      "validForm",
      this.isEmailSettingsStatus ||
        this.isSysLogSettingsStatus ||
        this.$data.isSkip
    );
    return true;
  }
  public get isEmailSettingsStatus(): any {
    return this.$store.getters["systemConfig/isEmailSettingsStatus"];
  }
  public set isEmailSettingsStatus(status: any) {
    this.$store.commit("systemConfig/setNotificationsType", {
      type: "email",
      flag: status
    });
  }

  public get isSysLogSettingsStatus(): any {
    return this.$store.getters["systemConfig/isSysLogSettingsStatus"];
  }

  public set isSysLogSettingsStatus(status: any) {
    this.$store.commit("systemConfig/setNotificationsType", {
      type: "syslog",
      flag: status
    });
  }

  public get isNotificationSettingSkipStatus(): any {
    return this.$store.getters["systemConfig/isNotificationSettingSkipStatus"];
  }

  public set isNotificationSettingSkipStatus(status: any) {
    this.$store.commit("systemConfig/setNotificationsType", {
      type: "skip",
      flag: status
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
