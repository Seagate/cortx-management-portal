/*****************************************************************************
 Filename:          alert-details.vue
 Description:       Alert Details Component

 Creation Date:     10/01/2020
 Author:            Sri Bhargav Metta

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <h1>djhjdjfnjdnfkks</h1>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";
import { Validations } from "vuelidate-property-decorators";
import { required, maxLength } from "vuelidate/lib/validators";
import { Api } from "./../../services/api";
import apiRegister from "./../../services/api-register";
import { AlertEventDetail, AlertExtendedInfo } from "../../models/alert";
import AlertExtendedInfoComp from "./alert-extended-info.vue";
import EosAlertComments from "./alert-comments.vue";
import EosAlertOccurrences from "./alert-occurrences.vue";
import EosAlertRelated from "./alert-related.vue";
import EosTabs, { TabsInfo } from "./../widgets/eos-tabs.vue";
@Component({
  name: "eos-alert-details",
  components: {
    AlertExtendedInfoComp,
    EosAlertComments,
    EosAlertOccurrences,
    EosAlertRelated,
    EosTabs
  }
})
export default class EosAlertHistory extends Vue {
  
}
</script>

<style lang="scss" scoped >
.eos-back-to-alerts-btn {
  display: flex;
  cursor: pointer;
  width: 80px;
  color: #6ebe49;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 22px;
}
.eos-alert-status-chip-disabled {
  color: #b7b7b7;
}
</style>
