/*****************************************************************************
 Filename:          setting.vue
 Description:       Setting Component

 Creation Date:     23/11/2019
 Author:            Jayshree More

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <eosUserSetting :buttonsShow="false" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import EosUserSetting from "./../components/onboarding/system-config/user-settings/user-setting-local.vue";

@Component({
  name: "eos-setting",
  components: {
    eosUserSetting: EosUserSetting
  }
})
export default class Setting extends Vue {}
</script>
<style lang="scss" scoped>
.page {
  position: relative;
}
</style>

