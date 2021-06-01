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
    <template>
      <div class="ma-3 mt-5" v-if="auditLog && isShowLogs">
        <span class="cortx-text-bold cortx-text-lg" id="s3auditlogtext">{{ $t("maintenance.logs") }}</span>
        <v-divider class="my-2"></v-divider>
        <template v-if="auditLog.logs.length > 0">
          <cortx-data-table
            :headers="auditLogTableHeaderList" 
            :records="auditLog.logs" 
            :onSort="onAuditLogSort"
            :onFilter="onAuditLogFilter" 
            :sortParams="auditLogQueryParams"
            :rowsPerPage="[10, 20, 30, 50, 100, 150, 200]" 
            class="cortx-table"
            id="auditLog-datatable"
            @update:items-per-page="getAuditLogs()"
            @update:page="getAuditLogs()"
          />
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
import CortxDataTable from "../widgets/cortx-data-table.vue";

@Component({
  name: "cortx-auditlog",
  components: { CortxVDataTable },
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
  public auditLogTableHeaderList: any[]= [];
  
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

  public async clearFilters() {
    for (const header of this.auditLogTableHeaderList) {
      delete this.auditLogQueryParams[header.field_id]
    }
  }

  public async onAuditLogFilter(headerFields: string[], value: string) {
    if(value.length > 0) {
      console.log("inside on audit log filter")
      this.clearFilters(); //This call is to clear any previously added filters

      if(headerFields.length > 0) {
        for (const field of headerFields) {
          this.auditLogQueryParams[field] = value; //Adding only selected columns as filters
        }
      } else {
        for (const header of this.auditLogTableHeaderList) {
          this.auditLogQueryParams[header.field_id] = value; //Adding all column headers as filters
        }
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

    //API call to get schema for the headers
    const headerResponse = await Api.getAll(`${apiRegister.auditlogs}/csm-headers`);
    this.auditLogTableHeaderList = headerResponse.data;
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
