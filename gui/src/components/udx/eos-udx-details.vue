/*****************************************************************************
 Filename:          eos-udx-details.vue
 Description:       UDX Details Component

 Creation Date:     06/03/2020
 Author:            Sri Bhargav Metta

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <div>
    <div class="udx-page-title">
      <label class="eos-text-lg eos-text-bold">UDX</label>
    </div>
    <div class="mt-2">
      <div id="udx-device-details-container" v-if="udx">
        <table id="udx-device-details" class="mt-4 eos-text-md">
          <tr>
            <td class="py-2 eos-text-bold udx-device-detail-item-label">Name</td>
            <td class="py-2">{{ udx.name }}</td>
          </tr>
          <tr>
            <td class="py-2 eos-text-bold udx-device-detail-item-label">Product ID</td>
            <td class="py-2">{{ udx.productID }}</td>
          </tr>
          <tr>
            <td class="py-2 eos-text-bold udx-device-detail-item-label">Serial number</td>
            <td class="py-2">{{ udx.serialNumber }}</td>
          </tr>
          <tr>
            <td class="py-2 eos-text-bold udx-device-detail-item-label">Type</td>
            <td class="py-2">{{ udx.type }}</td>
          </tr>
          <tr>
            <td class="py-2 eos-text-bold udx-device-detail-item-label">UUID</td>
            <td class="py-2">{{ udx.uuid }}</td>
          </tr>
          <tr>
            <td class="py-2 eos-text-bold udx-device-detail-item-label">Vendor ID</td>
            <td class="py-2">{{ udx.vendorID }}</td>
          </tr>
        </table>
      </div>
      <button v-else type="button" class="eos-btn-primary" @click="$router.push('/udx/registration')">Register UDX</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { UDX } from "../../models/udx";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";

@Component({
  name: "eos-udx-details"
})
export default class EosUDXDetails extends Vue {
  @Prop({ required: true })
  public udx: UDX;
}
</script>
<style lang="scss" scoped>
.udx-page-title {
  height: 46px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.udx-device-detail-item-label {
  width: 13rem;
}
</style>
