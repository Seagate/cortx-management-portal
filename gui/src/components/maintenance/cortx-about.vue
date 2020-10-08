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
          <td style="padding-top: 2px;">
            <label>{{ versionDetails.NAME }}</label>
          </td>
        </tr>
        <tr>
          <td>
            <label class="cortx-text-bold">{{$t("aboutUs.version")}}</label>
          </td>
          <td style="padding-top: 2px;">
            <label>{{ versionDetails.VERSION }}</label>
          </td>
        </tr>
        <tr>
          <td>
            <label class="cortx-text-bold">{{$t("aboutUs.build")}}</label>
          </td>
          <td style="padding-top: 2px;">
            <label>{{ versionDetails.BUILD }}</label>
          </td>
        </tr>
        <tr v-if="versionDetails.RELEASE">
          <td>
            <label class="cortx-text-bold">{{$t("aboutUs.release")}}</label>
          </td>
          <td style="padding-top: 2px;">
            <label>{{ versionDetails.RELEASE }}</label>
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
import i18n from "./../../i18n";

@Component({
  name: "cortx-about"
})
export default class Cortxaboutpage extends Vue {
  public data() {
    return {
      versionDetails: {
        NAME: '-' as string,
        VERSION: '-' as string,
        BUILD: '-' as string,
        RELEASE: null,
        COMPONENTS: []
      }
    };
  }

  public async mounted() {
    await this.getVersion();
  }

  public async getVersion() {
    const res = await Api.getAll(apiRegister.version);
    this.$data.versionDetails = res.data;
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
}
</style>
