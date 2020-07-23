/*****************************************************************************
 Filename:          eos-health-view.vue
 Description:       Health view component

 Creation Date:     14/03/2020
 Author:            Piyush Gupte

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <div class="pa-5">
    <div class="eos-text-lg eos-text-bold pr-2">Health View</div>
    <div>
      <div class="eos-health-summary-container">
        <div class="eos-text-lg eos-float-l eos-text-bold">{{componentName}}</div>
        <div
          class="eos-summary-chip eos-float-l eos-chip-ok ml-2"
          v-if="healthSummary.good && healthSummary.good > 0"
        >
          <div class="summary-count">
            <label
              class="eos-text-sm"
            >{{ healthSummary.good?healthSummary.good:0 }}</label>
          </div>
        </div>
        <div
          class="eos-summary-chip eos-float-l eos-chip-warning ml-2"
          v-if="healthSummary.warning && healthSummary.warning > 0">
          <div class="summary-count">
            <label
              class="eos-text-sm"
            >{{ healthSummary.warning?healthSummary.warning:0 }}</label>
          </div>
        </div>
        <div
          class="eos-summary-chip eos-float-l eos-chip-alert ml-2"
          v-if="healthSummary.critical && healthSummary.critical > 0"
        >
          <div class="summary-count">
            <label
              class="eos-text-sm"
            >{{ healthSummary.critical?healthSummary.critical:0 }}</label>
          </div>
        </div>
      </div>
    </div>

    <v-data-table
      calculate-widths
      :items="healthComponentData"
      item-key="component_id"
      class="eos-table"
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
              header.sortable ? 'eos-cursor-pointer' : ''
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
               props.item.health === 'OK' || props.item.health === 'NA' &&
                props.item.component_info.severity !== alertStatus.warning
              "
              class="eos-status-chip eos-chip-ok"
              v-bind:title="props.item.health"
            ></div>
            <div
              v-if="
                props.item.component_info.severity === alertStatus.critical ||
                  props.item.component_info.severity === alertStatus.error
              "
              class="eos-status-chip eos-chip-alert"
              v-bind:title="props.item.component_info.severity"
            ></div>
            <div
              v-if="props.item.component_info.severity === alertStatus.warning"
              class="eos-status-chip eos-chip-warning"
              title="warning"
            ></div>
            <div
              v-else-if="props.item.component_info.severity === alertStatus.informational"
              class="eos-status-chip eos-chip-information"
              title="info"
            ></div>

          </td>
          <td v-if="props.item.alert_uuid !== 'NA' && props.item.health !== 'OK' && props.item.health !== 'NA'">
            <img
              :src="require('@/assets/zoom-in.svg')"
              class="eos-cursor-pointer"
              @click="$router.push({ path: `healthview/${props.item.alert_uuid}`, query: { nodeId: componentName, source: 'healthView'}})"
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
  name: "eos-health-view"
})
export default class EosHealthView extends Vue {
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
.eos-health-summary-container {
  height: 1.875em;
}
.eos-health-summary-container {
  height: 1.875em;
}
.eos-summary-chip {
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
