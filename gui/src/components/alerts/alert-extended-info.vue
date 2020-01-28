/*****************************************************************************
 Filename:          alert-extended-info.vue
 Description:       Alert Extended Info Component

 Creation Date:     27/01/2020
 Author:            Sri Bhargav Metta

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <ul>
    <li v-for="(value, name) in alertExtendedInfo" :key="name">
      <div v-if="typeof value === 'object'">
        <div v-if="Array.isArray(value)">
          <label class="eos-key-label eos-text-md eos-text-bold">{{ name }}</label>
          <ul>
            <li v-for="(childItem, childIndex) in value" :key="childIndex">
              <label class="eos-text-md eos-text-bold">[{{ childIndex + 1 }}]</label>
              <eos-alert-extended-info :alertExtendedInfo="childItem" />
            </li>
          </ul>
        </div>
        <div v-else>
            <label class="eos-text-md eos-text-bold">{{ name }}</label>
            <eos-alert-extended-info :alertExtendedInfo="value" />
        </div>
      </div>
      <div v-else>
        <label class="eos-key-label eos-text-md eos-text-bold">{{ name }}</label>
        <label class="eos-text-md">&nbsp;- {{ value }}</label>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "eos-alert-extended-info"
})
export default class EosAlertExtendedInfo extends Vue {
  @Prop({ required: true })
  public alertExtendedInfo: any;
}
</script>

<style lang="scss" scoped >
ul {
  padding-left: 1em;
  line-height: 1.5em;
  list-style-type: dot;
}
.eos-key-label {
    display: inline-block;
}
.eos-key-label::first-letter{
    text-transform: uppercase;
}
</style>
