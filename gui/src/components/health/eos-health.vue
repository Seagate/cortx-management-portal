/*****************************************************************************
 Filename:          eos-health.vue
 Description:       Health container component.

 Creation Date:     27/03/2019
 Author:            Piyush Gupte

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <router-view class="eos-p-2"></router-view>
</template>
 <script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "eos-health"
})
export default class EosHealth extends Vue {}
</script>
<style lang="scss" scoped>
</style>