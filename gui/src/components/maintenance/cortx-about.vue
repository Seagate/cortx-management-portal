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
  <div class="cortx-p-1">
    <div class="cortx-text-lg cortx-text-bold" id="lblAbout">
      {{$t("aboutUs.title")}}
      <a href="https://github.com/Seagate" target="_blank">
        <img id="about-seagte-github" :src="require('@/assets/link-target-blank.svg')" alt="seagate" />
      </a>
    </div>
    <v-divider class="mt-2 mb-2" />
    <div class="body-2"></div>
    <div class="cortx-last-upgrade-info-container cortx-text-md">
      <table>
        <tr>
          <td style="width: 100px;">
            <label class="cortx-text-bold">{{$t("aboutUs.name")}}</label>
          </td>
          <td class="cortx-td">
            <label>{{ versionDetails.NAME }}</label>
          </td>
        </tr>
        <tr>
          <td>
            <label class="cortx-text-bold">{{$t("aboutUs.version")}}</label>
          </td>
          <td class="cortx-td">
            <label>{{ versionDetails.VERSION }}</label>
          </td>
        </tr>
        <tr>
          <td>
            <label class="cortx-text-bold">{{$t("aboutUs.build")}}</label>
          </td>
          <td class="cortx-td">
            <label>{{ versionDetails.BUILD }}</label>
          </td>
        </tr>
        <tr v-if="versionDetails.RELEASE">
          <td>
            <label class="cortx-text-bold">{{$t("aboutUs.release")}}</label>
          </td>
          <td class="cortx-td">
            <label>{{ versionDetails.RELEASE }}</label>
          </td>
        </tr>
         <tr v-if="serialNumber">
          <td>
          <label class="cortx-text-bold">{{$t("aboutUs.SerialNumber")}}</label>
          </td>
          <td class="cortx-td">
             <label>- {{ serialNumber }}</label>
          </td>
        </tr>
      </table>
    </div>
    <v-expansion-panels v-if="versionDetails.COMPONENTS.length" class="mt-2">
      <v-expansion-panel>
        <v-expansion-panel-header
          class="cortx-text-lg font-weight-bold">
        {{$t("aboutUs.COMPONENTS")}}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <ul>
            <li v-for="component in versionDetails.COMPONENTS" :key="component">{{ component }}</li>
          </ul>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import i18n from "./maintenance.json";

@Component({
  name: "cortx-about",
  i18n: {
    messages: i18n
  }
})
export default class Cortxaboutpage extends Vue {
  public data() {
    return {
      versionDetails: {
        NAME: "-" as string,
        VERSION: "-" as string,
        BUILD: "-" as string,
        RELEASE: null,
        COMPONENTS: []
      },
      serialNumber: "-" as string
    };
  }
  public async mounted() {
    await this.getApplianceDetails();
    await this.getVersion();
  }
  public async getVersion() {
     this.$store.dispatch(
        "systemConfig/showLoader",
        "fetching details..."
      );
    const res = await Api.getAll(apiRegister.version);
    this.$data.versionDetails = res.data;
    this.$store.dispatch("systemConfig/hideLoader");
  }
   public async getApplianceDetails() {
    const res = await Api.getAll(apiRegister.appliance_info);
    this.$data.serialNumber = res.data[0].serial_number;
  }
}
</script>
<style lang="scss" scoped>
.cortx-brand-logo {
  padding-top: 20px;
  margin-bottom: 20px;
  &:before {
    left: 0;
  }
  .cortx-td {
    padding-top: 2px;
}
}
</style>