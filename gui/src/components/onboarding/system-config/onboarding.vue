/*****************************************************************************
 Filename:          onboarding.vue
 Description:       Onboarding component to show Wizard Component

 Creation Date:     10/12/2019
 Author:            Sanjeevan Bhave

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
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
  private mounted() {
    this.$store.dispatch("systemConfig/getSystemConfigAction");
  }

  get systemConfigData() {
    return this.$store.getters["systemConfig/wizardMetadataObject"];
  }
}
</script>

<style lang="scss" scoped>
.onboarding-container {
  margin-left: 7.75em;
}
</style>
