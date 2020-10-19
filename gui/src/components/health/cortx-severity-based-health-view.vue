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
  <div class="pa-5">
    <div
      class="cortx-back-btn"
      @click="$router.go(-1)"
    >
      <img :src="require('@/assets/arrow-left.svg')" />
      <span class="mt-1">{{ $t("common.back") }}</span>
    </div>
    <div class="cortx-text-lg cortx-text-bold">{{ $t("dashboard.healthViewSeverity") }}: {{ severity }})</div>
    <div class="cortx-text-md cortx-text-bold" v-if="componentLabel">{{ componentLabel }}</div>

    <v-data-table
      calculate-widths
      :items="healthComponentData"
      item-key="component_id"
      class="cortx-table"
      hide-default-header
      id="tblHealthLarge"
      height="400"
      :items-per-page.sync="itemsPerPage"
      :footer-props="{
        'items-per-page-options': [50, 100, 150, 200]
      }"
    >
      <template v-slot:header="{}">
        <tr>
          <th
            v-for="header in healthTableHeaders"
            :key="header.text"
            :class="[
              'tableheader',
              header.sortable ? 'cortx-cursor-pointer' : ''
            ]"
          >
            <span>{{ header.text }}</span>
          </th>
          <th class="tableheader">{{ $t("dashboard.action") }}</th>
        </tr>
      </template>
      <template v-slot:item="props">
        <tr style="color: #000000;">
          <td>{{props.item.component_id}}</td>
          <td>
            <div
              v-if="
               props.item.health === 'OK' || props.item.health === 'NA'
              "
              class="cortx-status-chip cortx-chip-ok"
              v-bind:title="props.item.health"
            ></div>
            <div
              v-else-if="
                props.item.severity === alertStatus.informational ||
                  props.item.severity === 'NA' || props.item.severity === ''
              "
              class="cortx-status-chip cortx-chip-warning"
              title="warning"
            ></div>
            <div
              v-else-if="
                props.item.severity === alertStatus.critical ||
                  props.item.severity === alertStatus.error
              "
              class="cortx-status-chip cortx-chip-alert"
              v-bind:title="props.item.severity"
            ></div>
            <div
              v-else-if="props.item.severity === alertStatus.warning"
              class="cortx-status-chip cortx-chip-warning"
              v-bind:title="props.item.severity"
            ></div>

          </td>
          <td v-if="props.item.alert_uuid !== 'NA' && props.item.health !== 'OK' && props.item.health !== 'NA'">
            <img
             id="healthview-zoomicon"
              :src="require('@/assets/zoom-in.svg')"
              class="cortx-cursor-pointer"
              @click="$router.push(`/alerts/${props.item.alert_uuid}`)"
            />
           </td>
           <td v-else>{{ $t("dashboard.NA") }}</td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";
import { Api } from "./../../services/api";
import apiRegister from "./../../services/api-register";
import i18n from "../../i18n";

@Component({
  name: "cortx-severity-based-health-view"
})
export default class CortxSeverityBasedHealthView extends Vue {
  public severity: string = "";
  public componentLabel: any = "";
  public healthTableHeaders: any = [
    {
      text: "Component Id",
      value: "component_id",
      sortable: true
    },
    {
      text: "Health",
      value: "health",
      sortable: true
    }
  ];
  public healthComponentData = [];
  public itemsPerPage: number = 100;

  public data() {
    return {
      alertStatus: require("./../../common/const-string.json")
    };
  }

  public async mounted() {
    this.severity = this.$route.params.severity;
    const query_params: any = {
      severity: this.severity
    };
    if (this.$route.query.component_id) {
      query_params.component_id = this.$route.query.component_id;
      this.componentLabel = this.$route.query.component_id === "storage_encl"
                            ? i18n.t("health.storage_encl")
                            : this.$route.query.component_id;
    }
    this.$store.dispatch("systemConfig/showLoaderMessage", {
      show: true,
      message: "Getting health info..."
    });
    const res = await Api.getAll(apiRegister.health_resources, query_params);
    if (res && res.data) {
      this.healthComponentData = res.data.resources;
    }
    this.$store.dispatch("systemConfig/hideLoader");
  }
}
</script>
<style lang="scss" scoped>
.cortx-back-btn {
  display: flex;
  cursor: pointer;
  width: 80px;
  color: #6ebe49;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 22px;
}
</style>
