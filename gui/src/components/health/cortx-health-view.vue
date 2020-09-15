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
    <div class="cortx-text-lg cortx-text-bold pr-2">Health View</div>
    <div>
      <div class="cortx-health-summary-container">
        <div class="cortx-text-lg cortx-float-l cortx-text-bold">{{componentName}}</div>
        <div
          class="cortx-summary-chip cortx-float-l cortx-chip-ok ml-2"
          v-if="healthSummary.good && healthSummary.good > 0"
        >
          <div class="summary-count">
            <label
              class="cortx-text-sm"
            >{{ healthSummary.good?healthSummary.good:0 }}</label>
          </div>
        </div>
        <div
          class="cortx-summary-chip cortx-float-l cortx-chip-warning ml-2"
          v-if="healthSummary.warning && healthSummary.warning > 0">
          <div class="summary-count">
            <label
              class="cortx-text-sm"
            >{{ healthSummary.warning?healthSummary.warning:0 }}</label>
          </div>
        </div>
        <div
          class="cortx-summary-chip cortx-float-l cortx-chip-alert ml-2"
          v-if="healthSummary.critical && healthSummary.critical > 0"
        >
          <div class="summary-count">
            <label
              class="cortx-text-sm"
            >{{ healthSummary.critical?healthSummary.critical:0 }}</label>
          </div>
        </div>
      </div>
    </div>

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
            v-for="header in alertTableHeaders"
            :key="header.text"
            :class="[
              'tableheader',
              header.sortable ? 'cortx-cursor-pointer' : ''
            ]"
          >
            <span>{{ header.text }}</span>
          </th>
          <th class="tableheader">Action</th>
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
           <td v-else>NA</td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";
import AlertsMixin from "./../../mixins/alerts";
import { Api } from "./../../services/api";
import apiRegister from "./../../services/api-register";
import { AlertQueryParam, AlertObject } from "./../../models/alert";
import { HealthSummary } from "../../models/system";
@Component({
  name: "cortx-health-view"
})
export default class CortxHealthView extends Vue {
  public alertTableHeaders: any = [
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
  public alertObject: AlertObject = {} as AlertObject;
  public healthComponentData = [];
  public itemsPerPage: number = 100;
  public currentPage: number = 1;
  public healthSummary: HealthSummary = {
    good: 0,
    fault: 0,
    degraded: 0,
    total: 0,
    unrecoverable: 0,
    critical: 0
  };
  public data() {
    return {
      alertStatus: require("./../../common/const-string.json"),
      name: this.$route.query.name
    };
  }
  public async mounted() {
    try {
      this.$store.dispatch("systemConfig/showLoaderMessage", {
        show: true,
        message: "Getting health info..."
      });
      const enclosureName = this.$route.query.name
        ? this.$route.query.name
        : "";
      const res = await Api.getAll(apiRegister.health_components, {
        node_id: enclosureName
      });
      this.$store.dispatch("systemConfig/hideLoader");
      if (res && res.data) {
        this.healthComponentData = res.data[0][Object.keys(res.data[0])[0]].components;
        this.healthSummary =
          res.data[0][Object.keys(res.data[0])[0]].health_summary;
        this.healthComponentData.sort((a: any, b: any) => {
          let result = 0;
          const fa = a.health.toLowerCase();
          const fb = b.health.toLowerCase();

          if (fa < fb) {
            result = -1;
          }
          if (fa > fb) {
            result = 1;
          }
          return result;
        });
      }

    } catch {
      this.$store.dispatch("systemConfig/hideLoader");
    }
  }

  get componentName() {
    return this.$route.query.name ? this.$route.query.name : "";
  }
}
</script>
<style lang="scss" scoped>
.cortx-health-summary-container {
  height: 1.875em;
}
.cortx-health-summary-container {
  height: 1.875em;
}
.cortx-summary-chip {
  display: flex;
  min-height: 16px;
  min-width: 16px;
  border-radius: 2px;
  line-height: 1;
  text-align: center;
  color: #ffffff;
  padding: 3px;
  border-radius: 34px;
  .summary-label {
    padding: 2px 3px 3px 5px;
  }
  .summary-count {
    border: 2px solid #ffffff;
    border-radius: 34px;
    line-height: 1;
    padding: 0 3px 3px 3px;
    //margin-left: 8px;
    min-width: 33px;
  }
}
</style>
