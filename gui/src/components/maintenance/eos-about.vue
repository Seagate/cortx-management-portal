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
  <div class="eos-p-2">
    <div class="eos-text-lg eos-text-bold" id="lblAbout">About us</div>
    <div style="display: inline-block;">
      <img :src="require(`@/assets/${brandType}.svg/`)" class="ml-2 mb-2 eos-lyve-drive" />
    </div>
    <v-divider class="mt-2 mb-5" />
    <v-container>
      <div class="body-2"></div>
      <div class="mt-3 pa-3 eos-last-upgrade-info-container eos-text-md">
        <table>
          <tr>
            <td style="width: 100px;">
              <label class="eos-text-bold">Name:</label>
            </td>
            <td style="padding-top: 2px;">
              <label>{{ versionDetails.NAME }}</label>
            </td>
          </tr>
          <tr>
            <td>
              <label class="eos-text-bold">Version:</label>
            </td>
            <td style="padding-top: 2px;">
              <label>{{ versionDetails.VERSION }}</label>
            </td>
          </tr>
          <tr>
            <td>
              <label class="eos-text-bold">Build:</label>
            </td>
            <td style="padding-top: 2px;">
              <label>{{ versionDetails.BUILD }}</label>
            </td>
          </tr>
          <tr>
            <td>
              <label class="eos-text-bold">Release:</label>
            </td>
            <td style="padding-top: 2px;">
              <label>{{ versionDetails.RELEASE }}</label>
            </td>
          </tr>
        </table>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";

@Component({
  name: "eos-about",
})
export default class Eosaboutpage extends Vue {
  public versionDetails: any = null;
  public brandType: string = ""; 

  public async mounted() {
    if (process.env.VUE_APP_BRANDNAME === "cortx") {
      this.brandType = "Cortx-logo-GRN";
    } else {
      this.brandType = "lyve-drive-green";
    }
    await this.getVersion();
  }

  public async getVersion() {
    const res = await Api.getAll(apiRegister.version);
    this.versionDetails = res.data;
  }
}
</script>
<style lang="scss" scoped>
img.eos-lyve-drive {
  height: 30px; 
  width: 340px;
  margin-top: 20px;
  margin-left: 20px;
}
</style>
