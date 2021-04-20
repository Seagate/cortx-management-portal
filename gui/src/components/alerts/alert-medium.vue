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
  <div id="alertMediumContainer">
    <cortx-health-summary />
    <div style="height: 30px;">
      <div class="cortx-alert-title" id="alert-new-alerts">{{ $t("alerts.newAlerts") }}</div>
      <img
        id="alert-zoom"
        :src="require('@/assets/zoom-in.svg')"
        class="cortx-alert-navigate"
        @click="$router.push('/alerts')"
      />
    </div>
    <div class="mt-1">
      <v-data-table
        calculate-widths
        :items="alertObject.alerts"
        item-key="updated_time"
        :height="tableHeight"
        :items-per-page.sync="itemsPerPage"
        :footer-props="{
          'items-per-page-options': [50, 100, 150, 200]
        }"
        :page.sync="currentPage"
        :update:page="currentPage"
        :server-items-length="alertObject.total_records"
        hide-default-header
        :hide-default-footer="hidePagination"
        @update:items-per-page="onSortPaginate()"
        @update:page="onSortPaginate()"
        id="tblAlertMedium"
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
              @click="onSort(header)"
            >
              <span>{{ header.text }}</span>
              <span v-if="header.value === sortInfo.header">
                <img
                  id="alert-desc"
                  v-if="sortInfo.sort_dir === alertStatus.desc"
                  :src="require('@/assets/widget/table-sort-desc.svg/')"
                  class="d-inline-block"
                  style="vertical-align: bottom; margin-left: -0.3em;"
                  height="20"
                  width="20"
                />
                <img
                  id="alert-asc"
                  v-if="sortInfo.sort_dir === alertStatus.asc"
                  :src="require('@/assets/widget/table-sort-asc.svg/')"
                  class="d-inline-block"
                  style="vertical-align: bottom; margin-left: -0.3em;"
                  height="20"
                  width="20"
                />
              </span>
            </th>
          </tr>
        </template>
        <template v-slot:item="props">
          <tr style="color: #000000;">
            <td style="white-space: nowrap;">
              {{ new Date(props.item.updated_time * 1000) | timeago }}
            </td>
            <td style="white-space: nowrap;">
              <span>{{
                props.item.module_type + " | " + props.item.state
              }}</span>
            </td>
            <td>
              <div
                style="margin: auto;"
                :title="props.item.severity"
                :class="getAlertSeverityStyleClass(props.item.severity)"
              ></div>
            </td>
            <td v-cortx-alert-tbl-description="props.item"></td>
          </tr>
        </template>
      </v-data-table>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";
import AlertsMixin from "./../../mixins/alerts";
import CortxHealthSummary from "../system/health-summary.vue";
import { alertTblDescriptionDirective } from "./alert-description-directive";
import i18n from "./alert.json";
import { EVENT_BUS } from "../../main";

@Component({
  name: "cortx-alert-medium",
  components: { CortxHealthSummary },
  directives: { "cortx-alert-tbl-description": alertTblDescriptionDirective },
  i18n: {
    messages: i18n
  }
})
export default class CortxAlertMedium extends Mixins(AlertsMixin) {

  @Prop({ required: false })
  public parentHeight: number;

  public tableHeight: string = "250";

  public created() {
    EVENT_BUS.$on("windowResized", (parentHeight: number) => {
      this.calculateTableHeight(parentHeight);
    });
  }

  public async mounted() {
    this.calculateTableHeight(this.parentHeight);

    if (this.alertPageFilter !== "new") {
      this.alertPageFilter = "new";
      this.$store.commit("alerts/resetAlertQueryParams");
    }
    // Set Alert table default header options
    this.alertTableHeaders = [
      {
        text: "Updated time",
        value: "updated_time",
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
    // Call action to get all alert data
    await this.onSortPaginate();
  }

  public destroyed() {
    EVENT_BUS.$off("windowResized");
  }

  public calculateTableHeight(parentHeight: number) {
    if (parentHeight) {
      /**
       * Need to subtract health summary component height
       * and title container height from parent height i.e 74px
       * to get exact height of the alert table.
       */
      const calcHeight: number = parentHeight - 74;

      /**
       * If calculated height is less than 250px
       * then set table height to 250px.
       */
      if (calcHeight < 250) {
        this.tableHeight = "250";
      } else {
        this.tableHeight = calcHeight.toString();
      }
    }
  }

  get sortInfo() {
    return this.$store.getters["alerts/getSortInfo"];
  }

  public data() {
    return {
      alertStatus: require("./../../common/const-string.json")
    };
  }
}
</script>
<style lang="scss" scoped>
.cortx-alert-title {
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.87);
  float: left;
}
.cortx-alert-navigate {
  float: right;
  cursor: pointer;
}
</style>
