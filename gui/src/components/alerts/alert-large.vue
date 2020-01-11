/*****************************************************************************
 Filename:          alert-large.vue
 Description:       Alert Large Component

 Creation Date:     30/08/2019
 Author:            Piyush Gupte

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <div class="pa-0 col-12">
    <eos-tabs class="mt-2" :tabsInfo="tabsInfo" />
    <v-data-table
      calculate-widths
      :items="alertData"
      :single-expand="singleExpand"
      item-key="created_time"
      show-expand
      class="mt-2 eos-table"
      :items-per-page.sync="itemsPerPage"
      :footer-props="{
        'items-per-page-options': [5, 10, 15]
        }"
      :page.sync="page"
      :update:page="page"
      :server-items-length="totalRecordsCount"
      hide-default-header
      @update:items-per-page="onSortPaginate('', null, page, itemsPerPage)"
      @update:page="onSortPaginate('', null, page, itemsPerPage)"
    >
      <template v-slot:header="{props}">
        <tr>
          <th
            v-for="header in alertHeader"
            :key="header.text"
            class="tableheader"
            @click="onSortPaginate(header.value, header, props.options.page, props.options.itemsPerPage)"
          >
            <span
              class="headerText"
              :class="(header.value === sortColumnName && isSortActive) ? 'active' : ''"
            >{{ header.text }}</span>
            <span
              :class="(header.value === sortColumnName && isSortActive) ? 'active' : 'notActive'"
            >
              <img
                v-if="header.sortable && header.sortDir === alertStatus.desc"
                :src="require('@/assets/widget/table-sort-desc.svg/')"
                class="d-inline-block"
                style="vertical-align: bottom; margin-left: -0.3em;"
                height="20"
                width="20"
              />
              <img
                v-if="header.sortable && header.sortDir === alertStatus.asc"
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
        <tr
          class="font-weight-small"
          style="cursor: pointer;"
          @click="$router.push('/alerts/' + props.item.alert_uuid)"
        >
          <td style="width: 10%">{{ new Date(props.item.created_time*1000) | timeago }}</td>
          <td style="width: 35%">
            <div v-if="props.item.location">Location: {{props.item.location}}</div>
            <div>
              <label v-if="props.item.state">State: {{props.item.state}}</label>
              <label v-if="props.item.state && props.item.module_name">,&nbsp;</label>
              <label v-if="props.item.module_name">Resource Type: {{props.item.module_name}}</label>
            </div>
          </td>
          <td style="width: 5%">
            <div
              style="margin: auto;"
              v-if="props.item.severity === alertStatus.warning"
              class="eos-status-chip eos-chip-offline"
            ></div>
            <div
              style="margin: auto;"
              v-else-if="props.item.severity ===alertStatus.critical || props.item.severity === alertStatus.error"
              class="eos-status-chip eos-chip-alert"
            ></div>
            <div
              style="margin: auto;"
              v-else-if="props.item.severity ===alertStatus.warning"
              class="eos-status-chip eos-chip-warning"
            ></div>
            <div
              style="margin: auto;"
              v-if="props.item.severity === alertStatus.informational"
              class="eos-status-chip eos-chip-ok"
            ></div>
          </td>
          <td style="width: 50%">{{props.item.description}}</td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";
import AlertsMixin from "./../../mixins/alerts";
import EosTabs, { TabsInfo } from "./../widgets/eos-tabs.vue";

@Component({
  name: "eos-alert-large",
  components: { EosTabs }
})
export default class EosAlertLarge extends Mixins(AlertsMixin) {
  public alertPageFilter: "new" | "active" = "new";

  public tabsInfo: TabsInfo = {
    tabs: [{ id: 1, label: "New Alerts" }, { id: 2, label: "Active Alerts" }],
    selectedTab: 1
  };

  @Watch("tabsInfo.selectedTab")
  public onPropertyChanged(value: number, oldValue: number) {
    this.alertPageFilter = value === 1 ? "new" : "active";
    this.onSortPaginate("", null, this.page, this.itemsPerPage);
  }

  public mounted() {
    // Call action to get all alert data
    this.onSortPaginate("", null, this.page, this.itemsPerPage);
    this.$store.commit("alerts/setOnboardingFlag", true);
    // Set Alert table default header options
    const headers = [
      {
        text: "Time",
        value: "created_time",
        sortable: true,
        sortDir: "desc"
      },
      {
        text: "Alert Target",
        value: "alertTarget",
        sortable: false
      },
      {
        text: "Status",
        value: "severity",
        sortable: false
      },
      {
        text: "Event",
        value: "description",
        sortable: false
      }
    ];
    // Mutate header data in store
    this.$store.commit("alerts/alertHeaderMutation", headers);
  }
  public data() {
    return {
      isColaps: false,
      singleExpand: false, // Expande single row property
      isSortActive: false, // Set table column sorting flag to default inactive
      sortColumnName: "", // Set sorting column name to none
      alertStatus: require("./../../common/const-string.json")
    };
  }

  public updateAlert(value: any) {
    this.$store.dispatch("alerts/updateAlert", value);
  }
  public clearComment(item: any) {
    item.comment = "";
  }
  public onExpand(props: any) {
    if (props.isExpanded === false) {
      props.expand(props.item);
    } else {
      props.expand(false);
    }
  }
}
</script>

<style lang="scss" scoped >
.actbtn {
  position: absolute;
  float: left;
}
#clear {
  font-size: 14px;
  color: var(--v-csmprimary-base);
  float: right;
}
#title {
  color: black;
}
.active {
  display: inline-block;
  color: var(--v-csmprimary-base) !important;
}
.notActive {
  opacity: 0;
}
.headerText {
  color: black;
}
.backoverview {
  position: relative;
  top: 0em;
  cursor: pointer;
}
.backoverviewimg {
  position: relative;
  display: inline-block;
}
.backoverviewtxt {
  position: relative;
  top: -0.3em;
}
.tableheader:hover {
  .notActive {
    opacity: 1;
  }
}
.largeAlert {
  border: 2px solid #e3e3e3;
}
tbody tr:active {
  border-top: 2px solid darkgray !important;
  border-bottom: 2px solid darkgray !important;
}
.tooltip-content {
  word-wrap: break-word;
}
</style>
