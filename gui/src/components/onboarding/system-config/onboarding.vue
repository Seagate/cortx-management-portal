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
  <div class="pt-1 onboarding-container">
    <eosWizard :configData="systemConfigData" :sortBy="'sequence'" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import EosWizard from "../../widgets/wizard/wizard.vue";

@Component({
  name: "eos-onboarding",
  components: {
    eosWizard: EosWizard
  }
})
export default class EosOnboarding extends Vue {
  private async mounted() {
    await this.$store.dispatch("systemConfig/getSystemConfigAction");
  }

  get systemConfigData() {
    return this.$store.getters["systemConfig/wizardMetadataObject"];
  }
}
</script>

<style lang="scss" scoped>
.onboarding-container {
  margin-left: 8.75em;
  margin-left: 7.75em;
}
</style>
