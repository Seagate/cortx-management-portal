/*****************************************************************************
 Filename:          eos-health-alert-details.vue
 Description:       Health alerts details component.

 Creation Date:     27/03/2020
 Author:            Piyush Gupte

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <eos-alert-details />
</template>
 <script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Api } from "./../../services/api";
import apiRegister from "./../../services/api-register";
import { AlertObject } from "../../models/alert";
import EosAlertDetails from "./../alerts/alert-details.vue";

@Component({
  name: "eos-health-alert-details",
  components: { EosAlertDetails }
})
export default class EosHealthAlertDetails extends Vue {}
</script>
<style lang="scss" scoped>
</style>
