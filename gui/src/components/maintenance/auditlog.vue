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
  <div>
    <div id="auditlog" class="mb-4">
      <label
        id="auditlog-title"
        class="cortx-text-bold cortx-text-lg"
      >{{ $t("maintenance.auditLog") }}</label>
      <div class="mt-1 cortx-text-md">
        <label id="auditlogtextlbl">{{ $t("maintenance.downloadOrView") }}</label>
      </div>
    </div>
    <v-divider class="my-4" />

    <div class="col-4 py-0">
      <div class="cortx-form-group">
        <label
          class="cortx-form-group-label"
          for="cmdComponent"
          id="lblComponent"
        >{{ $t("maintenance.component") }}*</label>
        <cortx-dropdown
          id="auditlog-component"
          @update:selectedOption="handleComponentDropdownSelect"
          :options="componentList"
          :title="component ? component : undefined"
        ></cortx-dropdown>

        <label
          class="cortx-form-group-label"
          for="cmdTimeRange"
          id="lblTimeRange"
        >{{ $t("maintenance.timePeriod") }}*</label>
        <cortx-dropdown
          id="auditlog-timeperiod"
          @update:selectedOption="handleTimerangeDropdownSelect"
          :options="timerangeList"
          :title="timerangeLabel ? timerangeLabel : undefined"
        ></cortx-dropdown>
      </div>
      <div class="mt-8 nav-btn">
        <button
          type="button"
          class="cortx-btn-primary mr-2"
          @click="downloadAuditLogs()"
          id="auditlog-downlodbtn"
          :disabled="!component||!timerangeLabel"
        >{{ $t("maintenance.download") }}</button>
        <button
          type="button"
          class="cortx-btn-primary"
          @click="showAuditLogs()"
          id="auditlog-viewbtn"
          :disabled="!component||!timerangeLabel"
        >{{ $t("maintenance.view") }}</button>
      </div>
    </div>
    <template v-if="component === 'CSM'">
      <div class="ma-3 mt-5" v-if="auditLog && isShowLogs">
        <span class="cortx-text-bold cortx-text-lg" id="csmauditlogtext">{{ $t("maintenance.logs") }}</span>
        <v-divider class="my-2"></v-divider>
        <CortxTable :headers="auditLogTableHeaderList" :records="records" :footer-props="{'items-per-page-options': [10, 20, 30, 50]}" >
          <template #header="{}">
            <tr>
              <th
                style="background-color: gold"
                v-for="header in auditLogTableHeaderList"
                :key="header.text"
              >
                {{ header.text }}
              </th>
            </tr>
          </template>
          <template v-slot:item="{ item }">
            <tr>
              <td
                style="background-color: lightblue"
                v-for="value in Object.values(item)"
                :key="value"
              >
                {{ value }}
              </td>
            </tr>
          </template>
        </CortxTable>
        <!-- <v-data-table
          calculate-widths
          :headers="auditLogTableHeaderList"
          :items="auditLog.logs"
          :items-per-page.sync="auditLogQueryParams.limit"
          :footer-props="{
            'items-per-page-options': [50, 100, 150, 200]
          }"
          :page.sync="auditLogQueryParams.offset"
          :update:page="auditLogQueryParams.offset"
          :server-items-length="auditLog.total_records"
          class="cortx-table"
          id="auditLog-datatable"
          :hide-default-header="true"
          @update:items-per-page="getAuditLogs()"
          @update:page="getAuditLogs()"
        >
          <template v-slot:header="{}">
            <tr>
              <th
                v-for="header in auditLogTableHeaderList"
                :key="header.text"
                :class="[
                  'tableheader',
                  header.sortable ? 'cortx-cursor-pointer' : ''
                ]"
                @click="onAuditLogSort(header)"
              >
                <span>{{ header.text }}</span>
                <span v-if="header.value === auditLogQueryParams.sortby">
                  <img
                    id="audit-log-desc-icon"
                    v-if="auditLogQueryParams.dir === 'desc'"
                    :src="require('@/assets/widget/table-sort-desc.svg/')"
                    class="d-inline-block"
                    style="vertical-align: bottom; margin-left: -0.3em;"
                    height="20"
                    width="20"
                  />
                  <img
                    id="audit-log-asc-icon"
                    v-if="auditLogQueryParams.dir === 'asc'"
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
          <template v-slot:item.timestamp="props">
            {{ props.item.timestamp | timeago }}
          </template>
        </v-data-table> -->
      </div>
    </template>
    <template v-else-if="component === 'S3'">
      <div class="ma-3 mt-5" v-if="auditLog && isShowLogs">
        <span class="cortx-text-bold cortx-text-lg" id="s3auditlogtext">{{ $t("maintenance.logs") }}</span>
        <v-divider class="my-2"></v-divider>
        <template v-if="auditLog.logs.length > 0">
          <span
            class="mb-1 d-block"
            v-for="(log, index) in auditLog.logs"
            :key="index"
            id="auditlog-data"
          >{{ log }}</span>
        </template>
        <template v-else>
          <span
            class="mb-1 d-block"
            id="auditlog-data"
          >No logs</span>
        </template>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";
import { AuditLogQueryParam } from "../../models/download";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import moment from "moment";
import i18n from "./maintenance.json";
import CortxTable from "../widgets/cortx-table.vue";

@Component({
  name: "cortx-auditlog",
  components: { CortxTable },
  i18n: {
    messages: i18n
  }
})
export default class CortxAuditLog extends Vue {
  public component: string = "";
  public componentList: any[] = [
    {
      label: "CSM",
      value: "CSM"
    },
    {
      label: "S3",
      value: "S3"
    }
  ];
  public timerange: string = "1";
  public timerangeLabel: string = "";
  public timerangeList: any[] = [
    {
      label: "One day",
      value: "1"
    },
    {
      label: "Two days",
      value: "2"
    },
    {
      label: "Three days",
      value: "3"
    },
    {
      label: "Four days",
      value: "4"
    },
    {
      label: "Five days",
      value: "5"
    },
    {
      label: "Six days",
      value: "6"
    },
    {
      label: "Seven days",
      value: "7"
    }
  ];
  public to: number = moment().unix();
  public isShowLogs: boolean = false;
  public auditLogQueryParams: AuditLogQueryParam = {} as AuditLogQueryParam;
  public auditLogTableHeaderList: any[] = [
    {
      text: "Timestamp",
      value: "timestamp",
      sortable: true
    },
    {
      text: "User",
      value: "user",
      sortable: false
    },
    {
      text: "Remote IP",
      value: "remote_ip",
      sortable: false
    },
    {
      text: "Forwarded For IP",
      value: "forwarded_for_ip",
      sortable: false
    },
    {
      text: "Method",
      value: "method",
      sortable: false
    },
    {
      text: "Path",
      value: "path",
      sortable: false
    },
    {
      text: "User Agent",
      value: "user_agent",
      sortable: false
    },
    {
      text: "Response Code",
      value: "response_code",
      sortable: false
    }
  ];
  public records: any = [
    {
      timestamp: "Aug 2, 2020 16:15:15",
      user: "admin",
      "remote_ip": "10.24.69.58",
      "forwared_for_ip": "21.24.78.54",
      method: "GET",
      path: "/api/v2/stats",
      "user_agent": "Mozilla",
      "response_code": "200"
    },
    {
      timestamp: "Aug 2, 2020 16:15:15",
      user: "admin",
      "remote_ip": "10.24.69.58",
      "forwared_for_ip": "21.24.78.54",
      method: "GET",
      path: "/api/v2/stats",
      "user_agent": "Mozilla",
      "response_code": "200"
    },
    {
      timestamp: "Aug 2, 2020 16:15:15",
      user: "admin",
      "remote_ip": "10.24.69.58",
      "forwared_for_ip": "21.24.78.54",
      method: "GET",
      path: "/api/v2/stats",
      "user_agent": "Mozilla",
      "response_code": "200"
    },
    {
      timestamp: "Aug 2, 2020 16:15:15",
      user: "admin",
      "remote_ip": "10.24.69.58",
      "forwared_for_ip": "21.24.78.54",
      method: "GET",
      path: "/api/v2/stats",
      "user_agent": "Mozilla",
      "response_code": "200"
    },
  ]
  public auditLog: any = {
    logs: [],
    total_records: 1000
  };

  public async showAuditLogs() {
    this.auditLogQueryParams = {
      component: this.component,
      timerange: this.timerange,
      start_date: moment(
        moment()
          .subtract(this.timerange, "days")
          .toDate()
      ).unix(),
      end_date: moment(moment().toDate()).unix(),
      offset: 1,
      limit: 50
    };

    await this.getAuditLogs();
  }

  public async onAuditLogSort(header: any) {
    if (header.sortable) {
      if (this.auditLogQueryParams.sortby && this.auditLogQueryParams.sortby === header.value) {
        this.auditLogQueryParams.dir = this.auditLogQueryParams.dir === "asc" ? "desc" : "asc";
      } else {
        this.auditLogQueryParams.sortby = header.value;
        this.auditLogQueryParams.dir = "asc";
      }

      await this.getAuditLogs();
    }
  }

  public async getAuditLogs() {
    this.$store.dispatch("systemConfig/showLoader", "Logs in progress...");
    const res = await Api.getAll(
      `${apiRegister.auditlogs}/show/${this.auditLogQueryParams.component.toLowerCase()}`,
      this.auditLogQueryParams
    );
    this.auditLog = res.data;
    this.isShowLogs = true;
    this.$store.dispatch("systemConfig/hideLoader");
  }

  private downloadAuditLogs() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      "Download log in progress..."
    );
    this.$store
      .dispatch("download/downloadLogs", {
        component: this.component,
        timerange: this.timerange,
        start_date: moment(
          moment()
            .subtract(this.timerange, "days")
            .toDate()
        ).unix(),
        end_date: moment(moment().toDate()).unix()
      })
      .then(response => {
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: "application/x-tar" })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          // tslint:disable-next-line
          response.headers["content-disposition"].split('"')[1]
        );
        document.body.appendChild(link);
        link.click();
        this.$store.dispatch("systemConfig/hideLoader");
      })
      .catch(() => {
        // tslint:disable-next-line: no-console
        console.error("download failed");
        this.$store.dispatch("systemConfig/hideLoader");
      });
  }
  private handleTimerangeDropdownSelect(selected: any) {
    this.timerange = selected.value;
    this.timerangeLabel = selected.label;
  }
  private handleComponentDropdownSelect(selected: any) {
    this.component = selected.value;
  }
}
</script>
<style lang="scss" scoped></style>
