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
      {{ $t("aboutUs.title") }}
      <a href="https://github.com/Seagate" target="_blank">
        <img
          id="about-seagte-github"
          :src="require('@/assets/link-target-blank.svg')"
          alt="seagate"
        />
      </a>
    </div>
    <v-divider class="mt-2 mb-2" />
    <div class="body-2"></div>
    <div class="cortx-last-upgrade-info-container cortx-text-md">
      <table>
        <tr>
          <td style="width: 100px;">
            <label class="cortx-text-bold">{{ $t("aboutUs.name") }}</label>
          </td>
          <td class="cortx-td">
            <label>{{ versionDetails.NAME }}</label>
          </td>
        </tr>
        <tr>
          <td>
            <label class="cortx-text-bold">{{ $t("aboutUs.version") }}</label>
          </td>
          <td class="cortx-td">
            <label>{{ versionDetails.VERSION }}</label>
          </td>
        </tr>
        <tr>
          <td>
            <label class="cortx-text-bold">{{ $t("aboutUs.build") }}</label>
          </td>
          <td class="cortx-td">
            <label>{{ versionDetails.BUILD }}</label>
          </td>
        </tr>
        <tr v-if="versionDetails.RELEASE">
          <td>
            <label class="cortx-text-bold">{{ $t("aboutUs.release") }}</label>
          </td>
          <td class="cortx-td">
            <label>{{ versionDetails.RELEASE }}</label>
          </td>
        </tr>
        <tr v-if="serialNumber">
          <td>
            <label class="cortx-text-bold">{{
              $t("aboutUs.SerialNumber")
            }}</label>
          </td>
          <td class="cortx-td">
            <label>{{ serialNumber }}</label>
          </td>
        </tr>
      </table>
    </div>
    <div class="mt-4">
      <cortx-tabs :tabsInfo="tabsInfo" class="cortx-text-lg cortx-text-bold" />
      <div v-if="showComponentTab">
        <div v-if="versionDetails.COMPONENTS.length" class="mt-2">
          <ul>
            <li v-for="component in versionDetails.COMPONENTS" :key="component">
              {{ component }}
            </li>
          </ul>
        </div>
      </div>

      <div
        v-if="showIssuerTab"
        class="cortx-last-upgrade-info-container cortx-text-md"
        id="ssl-issuer-details"
      >
        <table class="mt-2">
          <tr>
            <td style="width: 150px;">
              <label class="cortx-text-bold" id="issuer_common_name_lbl">{{
                $t("aboutUs.common_name")
              }}</label>
            </td>
            <td class="cortx-td">
              <label id="issuer_common_name_value">{{
                issuerDetails.commonName
              }}</label>
            </td>
          </tr>
          <tr>
            <td>
              <label class="cortx-text-bold" id="issuer-country_name_lbl">{{
                $t("aboutUs.country_name")
              }}</label>
            </td>
            <td class="cortx-td">
              <label id="issuer_country_name_value">{{
                issuerDetails.countryName
              }}</label>
            </td>
          </tr>
          <tr>
            <td>
              <label class="cortx-text-bold" id="issuer_locality_name_lbl">{{
                $t("aboutUs.locality_name")
              }}</label>
            </td>
            <td class="cortx-td">
              <label id="issuer_locality_name_value">{{
                issuerDetails.localityName
              }}</label>
            </td>
          </tr>
          <tr>
            <td>
              <label
                class="cortx-text-bold"
                id="issuer_organization_name_lbl"
                >{{ $t("aboutUs.organization_name") }}</label
              >
            </td>
            <td class="cortx-td">
              <label id="issuer_organization_name_value">{{
                issuerDetails.organizationName
              }}</label>
            </td>
          </tr>
        </table>
      </div>
      <div
        v-if="showSubjectTab"
        class="cortx-last-upgrade-info-container cortx-text-md"
        id="ssl-subject-details"
      >
        <table class="mt-2">
          <tr>
            <td style="width: 150px;">
              <label class="cortx-text-bold" id="subject_common_name_lbl">{{
                $t("aboutUs.common_name")
              }}</label>
            </td>
            <td class="cortx-td">
              <label id="subject_common_name_value">{{
                subject.commonName
              }}</label>
            </td>
          </tr>
          <tr>
            <td>
              <label class="cortx-text-bold" id="subject_country_name_lbl">{{
                $t("aboutUs.country_name")
              }}</label>
            </td>
            <td class="cortx-td">
              <label id="subject-country_name_value">{{
                subject.countryName
              }}</label>
            </td>
          </tr>
          <tr>
            <td>
              <label class="cortx-text-bold" id="subject_locality_name_lbl">{{
                $t("aboutUs.locality_name")
              }}</label>
            </td>
            <td class="cortx-td">
              <label id="subject_locality_name_value">{{
                subject.localityName
              }}</label>
            </td>
          </tr>
          <tr>
            <td>
              <label
                class="cortx-text-bold"
                id="subject_organization_name_lbl"
                >{{ $t("aboutUs.organization_name") }}</label
              >
            </td>
            <td class="cortx-td">
              <label id="subject_organization_name_value">{{
                subject.organizationName
              }}</label>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import i18n from "./maintenance.json";
import CortxTabs, { TabsInfo } from "../widgets/cortx-tabs.vue";

@Component({
  components: {
    CortxTabs
  },
  name: "cortx-about",
  i18n: {
    messages: i18n
  }
})
export default class Cortxaboutpage extends Vue {
  public tabsInfo: TabsInfo = {
    tabs: [
      {
        id: 1,
        label: "Component Details",
        show: true,
        requiredAccess: "Component"
      },
      {
        id: 2,
        label: "Issuer SSL Details",
        show: true,
        requiredAccess: "Issuer"
      },
      {
        id: 3,
        label: "Subject SSL Details",
        show: true,
        requiredAccess: "Subject"
      }
    ],
    selectedTab: 1
  };
  public issuerDetails: any;
  public subject: any;
  private showComponentTab: boolean = true;
  private showIssuerTab: boolean = false;
  private showSubjectTab: boolean = false;
  @Watch("tabsInfo.selectedTab")
  public onPropertyChanged(value: number, oldValue: number) {
    switch (value) {
      case 1:
        this.showComponentTab = true;
        this.showIssuerTab = false;
        this.showSubjectTab = false;
        break;
      case 2:
        this.showComponentTab = false;
        this.showIssuerTab = true;
        this.showSubjectTab = false;
        break;
      case 3:
        this.showComponentTab = false;
        this.showIssuerTab = false;
        this.showSubjectTab = true;
        break;
    }
  }
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
    await Promise.all([
      this.getSSLDetails(),
      this.getApplianceDetails(),
      this.getVersion()
    ]);
  }

  public async getVersion() {
    this.$store.dispatch("systemConfig/showLoader", "fetching details...");
    const res = await Api.getAll(apiRegister.version);
    this.$data.versionDetails = res.data;
    this.$store.dispatch("systemConfig/hideLoader");
  }
  public async getApplianceDetails() {
    const res = await Api.getAll(apiRegister.appliance_info);
    this.$data.serialNumber = res.data[0].serial_number;
  }
  public async getSSLDetails() {
    this.$store.dispatch("systemConfig/showLoader", "Fetching SSL details...");
    const res = await Api.getAll(apiRegister.ssl_details);
    if (res && res.data !== null) {
      this.issuerDetails = res.data.cert_details.issuer;
      this.subject = res.data.cert_details.subject;
    }
    this.$store.dispatch("systemConfig/hideLoader");
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
