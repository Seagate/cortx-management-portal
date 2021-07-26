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
  <div v-feature="unsupportedFeatures.auditlog">
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

    <div class="py-0 d-flex align-center audit-options">
      <cortx-dropdown
        id="auditlog-component"
        width="200px"
        @update:selectedOption="handleComponentDropdownSelect"
        :options="componentList"
        :title="component ? component : $t('maintenance.component')"
      ></cortx-dropdown>

      <v-menu
        offset-y
        :close-on-content-click="false"
        nudge-bottom="5"
      >
        <template v-slot:activator="{ on, attrs }">
          <div
          id="auditlog-timeperiod"
          v-bind="attrs"
          v-on="on"
          :class="{'invalid-range': dates.length === 1}"
          >
            {{timePeriod}}
            <img class="dropdown-icon" :src="require('@/assets/caret-down.svg')"/>
          </div>
        </template>

        <v-date-picker
        v-model="dates" 
        :range="true" 
        color="#6ebe49"
        :max="new Date().toISOString().slice(0,10)"
        ></v-date-picker>
      </v-menu>
      
      <div class="nav-btn">
        <button
          type="button"
          class="cortx-btn-primary mr-3"
          @click="showAuditLogs()"
          id="auditlog-viewbtn"
          :disabled="disableCTA"
        >{{ $t("maintenance.view") }}</button>
        <button
          type="button"
          class="cortx-btn-primary"
          @click="downloadAuditLogs()"
          id="auditlog-downlodbtn"
          :disabled="disableCTA"
        >{{ $t("maintenance.download") }}</button>
      </div>
    </div>
    <template>
      <div class="mr-3 mb-3" v-if="auditLog && isShowLogs">
          <cortx-data-table
            :headers="auditLogTableHeaderList" 
            :records="auditLog.logs" 
            :onSort="onAuditLogSort"
            :sortParams="auditLogQueryParams"
            :onFilter="onAuditLogFilter" 
            :rowsPerPage="rowsPerPage" 
            :onPaginate="onAuditLogPaginate" 
            :totalRecords="auditLog.total_records"
          />
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";
import { AuditLogQueryParam } from "../../models/download";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import moment from "moment";
import i18n from "./maintenance.json";
import { unsupportedFeatures } from "../../common/unsupported-feature";
import CortxDataTable from "../widgets/cortx-data-table.vue";
import { errorHandler } from "../../common/error-handler";

@Component({
  name: "cortx-auditlog",
  components: { CortxDataTable },
  i18n: {
    messages: i18n
  }
})
export default class CortxAuditLog extends Vue {
  public unsupportedFeatures = unsupportedFeatures;
  public dates: string[] = [];
  public showDatePicker: boolean = false;
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
  
  public dateRange = {
      startDate: 0,
      endDate: 0
  }
  public isShowLogs: boolean = false;
  public rowsPerPage: number[] = [10, 20, 30, 50, 100, 150, 200];
  public auditLogQueryParams: AuditLogQueryParam = {} as AuditLogQueryParam;
  public auditLogTableHeaderList: any[]= [];
  
  public auditLog: any = {
    logs: [],
    total_records: 1000
  };

  @Watch("dates") 
  public async printDates() {
    if(this.dates.length === 2) {
      if (this.dates[0] > this.dates[1]) {
        this.dateRange.startDate = moment(moment(this.dates[1]).toDate()).unix();
        this.dateRange.endDate = moment(moment(this.dates[0]).toDate()).unix() + 86399;
        } else {
          this.dateRange.startDate = moment(moment(this.dates[0]).toDate()).unix();
          this.dateRange.endDate = moment(moment(this.dates[1]).toDate()).unix() + 86399;
      }
    }
  }

  get timePeriod() {
    let timePeriod = "";
    if (this.dates.length === 1) {
      timePeriod = this.dates[0]
    } else if (this.dates.length === 2) {
      timePeriod = this.dates[0] > this.dates[1] ? this.dates.reverse().join(" ~ ") : this.dates.join(" ~ ");
    } else {
      timePeriod = "Time Period"
    }
    return timePeriod
  }

  get disableCTA() {
    if (this.dates.length !== 2 || !this.component) {
      return true;
    }
    return false;
  }

  public async showAuditLogs() {
    this.auditLogQueryParams = {
      component: this.component,
      start_date: this.dateRange.startDate,
      end_date: this.dateRange.endDate,
      sortby: "timestamp",
      dir: "asc",
      offset: 1,
      limit: this.rowsPerPage[0],
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

  public async onAuditLogPaginate(page: number, noOfRecords: number) {
    this.auditLogQueryParams.offset = page;
    this.auditLogQueryParams.limit = noOfRecords;

    await this.getAuditLogs();
  }

  public getFilterableHeaders() {
    return this.auditLogTableHeaderList.filter(header => header.filterable).map(header => header.field_id);
  }

  public setFilterParams(headers: string[], value: string) {
    this.auditLogQueryParams["filter"] = "";
    for (let i = 0;i < headers.length;i++) {
      this.auditLogQueryParams["filter"] += `${i > 0 ? " OR " : ""}${headers[i]}=${value}`;
    }
    this.auditLogQueryParams["filter"] = `{${this.auditLogQueryParams["filter"]}}`;
  }

  public async onAuditLogFilter(headerFields: string[], value: string, clearFilters?: boolean) {
        delete this.auditLogQueryParams.filter;

        if(value) {
          if(headerFields.length > 0) {
            this.setFilterParams(headerFields, value); //Adding only selected columns as filters
          } else if (this.getFilterableHeaders().length > 0) {
            this.setFilterParams(this.getFilterableHeaders(), value); //Adding all column headers that are filterable as filters
          } 
        }

        await this.getAuditLogs();
  }

  

  public async getAuditLogs() {
    this.$store.dispatch("systemConfig/showLoader", "Logs in progress...");
    try {
      const res = await Api.getAll(
        `${apiRegister.auditlogs}/show/${this.auditLogQueryParams.component.toLowerCase()}`,
        this.auditLogQueryParams
      );
      this.auditLog = res.data;  
      this.isShowLogs = true;
    } catch (error) {
      errorHandler(error);
    }
    
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
        start_date: this.dateRange.startDate,
        end_date: this.dateRange.endDate,
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
  
  private async handleComponentDropdownSelect(selected: any) {
    this.isShowLogs = false;
    this.component = selected.value;
    const headerResponse = await Api.getAll(`${apiRegister.auditlogs}/schema_info/${this.component.toLowerCase()}`);
    this.auditLogTableHeaderList = headerResponse.data;
  }
}
</script>
<style lang="scss" scoped>
.audit-options > *{
  margin-right: 12px;
}
#auditlog-timeperiod.invalid-range {
  border-color: red;
}
.nav-btn {
  margin-top: 4px;
}
#auditlog-timeperiod {
  height: 45px;
  min-width: 200px;
  border: 1px solid #b7b7b7;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
  padding: 0.5em 0.625em 0.375em 1em;
}
.dropdown-icon.active {
  transform: rotate(180deg)
}
</style>
