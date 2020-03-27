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
    <div class="eos-text-lg eos-text-bold">Health View</div>
    <v-row>
      <v-col cols="4">
        <div class="eos-text-lg eos-text-bold">{{componentName}}</div>
      </v-col>
      <v-col cols="8">
        <div class="eos-float-r">
          <div class="eos-summary-chip eos-chip-ok eos-float-l ml-2">
            <div class="summary-label">
              <label class="eos-text-md">Healthy</label>
            </div>
            <div class="summary-count">
              <label class="eos-text-sm">{{healthSummary.good?healthSummary.good:0}}</label>
            </div>
          </div>
          <div class="eos-summary-chip eos-chip-warning eos-float-l ml-2">
            <div class="summary-label">
              <label class="eos-text-md">Degraded</label>
            </div>
            <div class="summary-count">
              <label class="eos-text-sm">{{healthSummary.degraded?healthSummary.degraded:0}}</label>
            </div>
          </div>
          <div class="eos-summary-chip eos-chip-alert eos-float-l ml-2">
            <div class="summary-label">
              <label class="eos-text-md">Faulty</label>
            </div>
            <div class="summary-count">
              <label class="eos-text-sm">{{healthSummary.fault?healthSummary.fault:0}}</label>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-data-table
      calculate-widths
      :items="alertObject.alerts"
      item-key="created_time"
      class="eos-table"
      hide-default-header
      :hide-default-footer="true"
      id="tblHealthLarge"
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
          <th class="tableheader"></th>
        </tr>
      </template>
      <template v-slot:item="props">
        <tr style="color: #000000;">
          <td style="white-space: nowrap;">{{ new Date(props.item.created_time * 1000) | timeago }}</td>
          <td>
            <div>
              <span>
                Resource type: {{ props.item.module_name }} | State:
                {{ props.item.state }}
              </span>
            </div>
            <div>
              <span v-if="props.item.module_type === 'logical_volume'">
                Volume group: {{ props.item.volume_group }} | Volume name:
                {{ props.item.name }}
              </span>
              <span v-else-if="props.item.module_type === 'system'">
                Version: {{ props.item.version }} | Nodename:
                {{ props.item.name }}
              </span>
              <span v-else-if="props.item.module_type === 'volume'">
                Size: {{ props.item.volume_size }} | Total size:
                {{ props.item.volume_total_size }}
              </span>
              <span
                v-else-if="props.item.module_type === 'current'"
              >Sensor name: {{ props.item.name }}</span>
              <span
                v-else-if="props.item.module_name === 'enclosure:fru:psu'"
              >Location: {{ props.item.location }}</span>
              <span
                v-else-if="
                  props.item.module_name === 'enclosure:fru:fan' ||
                    props.item.module_type === 'enclosure:fru:sideplane'
                "
              >
                Name: {{ props.item.name }} | Location:
                {{ props.item.location }}
              </span>
              <span v-else-if="props.item.module_name === 'enclosure:fru:disk'">
                Serial number: {{ props.item.serial_number }} | Size:
                {{ props.item.volume_size }}
              </span>
              <span
                v-else-if="props.item.module_type === 'controller'"
              >Serial number: {{ props.item.serial_number }}</span>
            </div>
          </td>
          <td>
            <div
              style="margin: auto;"
              v-if="
                props.item.severity === alertStatus.critical ||
                  props.item.severity === alertStatus.error
              "
              class="eos-status-chip eos-chip-alert"
            ></div>
            <div
              style="margin: auto;"
              v-else-if="props.item.severity === alertStatus.warning"
              class="eos-status-chip eos-chip-warning"
            ></div>
            <div
              style="margin: auto;"
              v-if="props.item.severity === alertStatus.informational"
              class="eos-status-chip eos-chip-information"
            ></div>
          </td>
          <td>{{ props.item.description ? props.item.description : "--" }}</td>
          <td>
            <img
              :src="require('@/assets/zoom-in.svg')"
              class="eos-cursor-pointer"
              @click="$router.push({ path: `healthview/${props.item.alert_uuid}`, query: { nodeId: componentName, source: 'healthView'}})"
            />
            <img v-if="props.item.acknowledged" :src="require('@/assets/acknowledge-default.svg')" />
            <img v-if="props.item.resolved" :src="require('@/assets/resolved-filled-default.svg')" />
          </td>
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
      text: "Time",
      value: "created_time",
      sortable: true,
      sortDir: "desc"
    },
    {
      text: "Alert target",
      value: "alertTarget",
      sortable: false
    },
    {
      text: "Severity",
      value: "severity",
      sortable: true
    },
    {
      text: "Description",
      value: "description",
      sortable: false
    }
  ];
  public alertObject: AlertObject = {} as AlertObject;
  public healthSummary: HealthSummary = {
    good: 0,
    fault: 0,
    degraded: 0
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
        message: "Getting node alerts..."
      });
      const enclosureName = this.$route.query.name
        ? this.$route.query.name
        : "";
      const res = await Api.getAll(apiRegister.health_view, {
        node_id: enclosureName
      });
      this.$store.dispatch("systemConfig/hideLoader");
      if (res && res.data) {
        this.alertObject = res.data[0][Object.keys(res.data[0])[0]];
        this.healthSummary =
          res.data[0][Object.keys(res.data[0])[0]].health_summary;
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
    margin-left: 8px;
    min-width: 22px;
  }
}
</style>
