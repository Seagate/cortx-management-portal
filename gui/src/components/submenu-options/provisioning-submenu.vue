/*****************************************************************************
 Filename:          provisioning-submenu.vue
 Description:       Provisioning Submenu

 Creation Date:     22/11/2019
 Author:            Vaibhav Bhavsar

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <div>
    <div class="tile pa-5">
      <div style="float: left;">
        <label class="title font-weight-bold">S3</label>
      </div>
      <div style="float: right;margin-top: 2px;">
        <v-btn :to="'/s3'" class="text-capitalize" text small color="green">Manage</v-btn>
      </div>
    </div>

    <div class="mt-3 tile pa-5">
      <div style="float: left;">
        <label class="title font-weight-bold">NFS</label>
      </div>
      <div style="float: right;margin-top: 2px;">
        <v-btn class="text-capitalize" disabled text small color="green">Manage</v-btn>
      </div>
    </div>
  </div>
</template>
 <script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "eos-provisioning-submenu"
})
export default class EosProvisioningSubmenu extends Vue {}
</script>
<style lang="scss" scoped>
.tile {
  background: #ffffff;
  border: 1px solid #e8e8e8;
  box-sizing: border-box;
  border-radius: 4px;
  height: 100px;
  width: 700px;
}
</style>