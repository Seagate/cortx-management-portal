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
  <div class="cortx-p-1 body-2">
    <div class="cortx-text-lg mt-2 font-weight-bold" id="lblIpv4DataNetwork">
      {{ $t("settings.dataNetworkIPv4") }}
    </div>
    <div class="mt-3" id="lblIpv4Msg">
      {{ $t("settings.forManualOption") }}
    </div>
    <div class="mt-3" id="lblMandatoryMsg">
      {{ $t("settings.mandatoryField") }}
    </div>
    <v-divider class="mt-2" />
    <cortxDataNetworkIpv4Config @apply-settings="applySettingsConfirmation" />
    <cortx-confirmation-dialog
      :show="showConfirmDialog"
      message="Are you sure you want to apply the settings?"
      severity="warning"
      @closeDialog="applySettings"
      confirmButtonText="Apply"
    ></cortx-confirmation-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import CortxDataNetworkIpv4Config from "../onboarding/system-config/data-network/data-network-ipv4-config.vue";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import i18n from "../../i18n";

@Component({
  name: "cortx-data-network-setting",
  components: {
    cortxDataNetworkIpv4Config: CortxDataNetworkIpv4Config
  }
})
export default class CortxDataNetworkSetting extends Vue {
  private data() {
    return {
      sysconfigData: {},
      newConfigData: {},
      showConfirmDialog: false
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
    this.$data.showConfirmDialog = true;
    this.$data.newConfigData = data;
  }
  private async applySettings(confirmation: string) {
    this.$store.dispatch("systemConfig/showLoader", "Applying settings...");
    this.$data.showConfirmDialog = false;
    if (confirmation) {
      const res = await Api.patch(
        apiRegister.sysconfig,
        { data_network_settings: { ipv4: this.$data.newConfigData } },
        this.$data.sysconfigData.config_id,
        {
          params: {
            config_type: "data_network_settings"
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
