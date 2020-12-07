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
  <div>
    <div class="udx-page-title">
      <label class="cortx-text-lg cortx-text-bold">{{ $t("settings.UDX") }}</label>
    </div>
    <div class="mt-2">
      <div id="udx-device-details-container" v-if="udx">
        <table id="udx-device-details" class="mt-4 cortx-text-md">
          <tr>
            <td class="py-2 cortx-text-bold udx-device-detail-item-label">{{ $t("settings.name") }}</td>
            <td class="py-2">{{ udx.name }}</td>
          </tr>
          <tr>
            <td class="py-2 cortx-text-bold udx-device-detail-item-label">{{ $t("settings.productID") }}</td>
            <td class="py-2">{{ udx.productID }}</td>
          </tr>
          <tr>
            <td class="py-2 cortx-text-bold udx-device-detail-item-label">{{ $t("settings.serialNumber") }}</td>
            <td class="py-2">{{ udx.serialNumber }}</td>
          </tr>
          <tr>
            <td class="py-2 cortx-text-bold udx-device-detail-item-label">{{ $t("settings.type") }}</td>
            <td class="py-2">{{ udx.type }}</td>
          </tr>
          <tr>
            <td class="py-2 cortx-text-bold udx-device-detail-item-label">{{ $t("settings.UUID") }}</td>
            <td class="py-2">{{ udx.uuid }}</td>
          </tr>
          <tr>
            <td class="py-2 cortx-text-bold udx-device-detail-item-label">{{ $t("settings.vendorID") }}</td>
            <td class="py-2">{{ udx.vendorID }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { UDX } from "../../models/udx";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import i18n from "../../i18n";

@Component({
  name: "cortx-udx-details"
})
export default class CortxUDXDetails extends Vue {
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
