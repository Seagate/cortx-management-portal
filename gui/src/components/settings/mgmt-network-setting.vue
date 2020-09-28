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
  <div class="cortx-p-2 body-2">
    <div class="cortx-text-lg mt-2 font-weight-bold" id="lblNetworkIP4">
      {{ $t("settings.managementSettingIPv4") }}
    </div>
    <div class="mt-3" id="lblNetworkMsg">
      {{ $t("settings.managementSettingIPv4Msg") }}
    </div>
    <div class="mt-3" id="lblMandatoryMsg">
      {{ $t("settings.mandatoryField") }}
    </div>
    <v-divider class="mt-2" />
    <cortxNetworkSettingsIpv4 @apply-settings="applySettingsConfirmation" />
    <cortx-confirmation-dialog
      :show="showConfirmDialog"
      :message="
        `<span>You are moving on new IP address <a href='${newUrl}' target='_blank'>${newUrl}</a></span>`
      "
      severity="warning"
      submessage="Applying the changes will restart the system and the system will be moved to the new IP address."
      @closeDialog="applySettings"
      confirmButtonText="Apply"
      isMessageInHTML="true"
    ></cortx-confirmation-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import CortxNetworkSettingsIpv4Config from "../onboarding/system-config/mgmt-network/network-settings-ipv4-config.vue";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import i18n from "../../i18n";

@Component({
  name: "cortx-mgmt-settings",
  components: {
    cortxNetworkSettingsIpv4: CortxNetworkSettingsIpv4Config
  }
})
export default class CortxMangementSetting extends Vue {
  private data() {
    return {
      sysconfigData: {},
      newConfigData: {},
      showConfirmDialog: false,
      newUrl: ""
    };
  }
  private async mounted() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      "Fetching system configuration..."
    );
    this.$data.sysconfigData = await this.$store.dispatch(
      "systemConfig/getSystemConfigAction"
    );
    if (!this.$data.sysconfigData) {
      const errorMessage = `No configurations found. Please complete the onboarding process`;
      throw {
        error: {
          message: errorMessage
        }
      };
    }
    this.$store.dispatch("systemConfig/hideLoader");
  }
  private async applySettingsConfirmation(data: any) {
    let redirectUrl;
    if (data.nodes && data.nodes.length) {
      redirectUrl = data.nodes[0].ip_address;
    }
    const protocol = window.location.protocol;
    const defaultUrl = window.location.hostname;
    const port = window.location.port;
    this.$data.newUrl = `${protocol}//${
      redirectUrl ? redirectUrl : defaultUrl
    }:${port}`;
    this.$data.showConfirmDialog = true;
    this.$data.newConfigData = data;
  }
  private async applySettings(confirmation: string) {
    this.$store.dispatch("systemConfig/showLoader", "Applying settings...");
    this.$data.showConfirmDialog = false;
    if (confirmation) {
      const res = await Api.patch(
        apiRegister.sysconfig,
        { management_network_settings: { ipv4: this.$data.newConfigData } },
        this.$data.sysconfigData.config_id,
        {
          params: {
            config_type: "management_network_settings"
          },
          timeout: -1
        }
      );
    }
    this.$store.dispatch("systemConfig/hideLoader");
  }
}
</script>

<style lang="scss" scoped></style>
