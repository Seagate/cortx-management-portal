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
      <label id="auditlog-title" class="eos-text-bold eos-text-lg">Audit log</label>
      <div class="mt-1 eos-text-md">
        <label>Download or view audit logs for the selected time period.</label>
      </div>
    </div>
    <v-divider class="my-4" />

    <div class="col-4 py-0">
      <div class="eos-form-group">
        <label class="eos-form-group-label" for="cmdComponent" id="lblComponent">Component*</label>
        <eos-dropdown
          @update:selectedOption="handleComponentDropdownSelect"
          :options="componentList"
          :title="component ? component : undefined"
        ></eos-dropdown>

        <label class="eos-form-group-label" for="cmdTimeRange" id="lblTimeRange">Time period*</label>
        <eos-dropdown
          @update:selectedOption="handleTimerangeDropdownSelect"
          :options="timerangeList"
          :title="timerangeLabel ? timerangeLabel : undefined"
        ></eos-dropdown>
      </div>
      <div class="mt-8 nav-btn">
        <button type="button" class="eos-btn-primary mr-2" @click="downloadAuditLogs()">Download</button>
        <button type="button" class="eos-btn-primary" @click="showAuditLogs()">View</button>
      </div>
    </div>
    <div class="ma-3 mt-5" v-if="showLog">
      <span class="eos-text-bold eos-text-lg">Logs</span>
      <v-divider class="my-2"></v-divider>
      <span class="mb-1 d-block" v-for="(log, index) in showLog" :key="index">{{ log }}</span>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";
import moment from "moment";

@Component({
  name: "eos-auditlog"
})
export default class EosAuditLog extends Vue {
  private data() {
    return {
      component: "CSM",
      componentList: [
        {
          label: "CSM",
          value: "CSM"
        },
        {
          label: "S3",
          value: "S3"
        }
      ],
      timerange: "1",
      timerangeLabel: "One day",
      timerangeList: [
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
      ],
      to: moment().unix(),
      showLog: ""
    };
  }
  private showAuditLogs() {
    const that = this;
    this.$store.dispatch("systemConfig/showLoader", "Logs in progress...");
    this.$store
      .dispatch("download/showAuditLogs", {
        component: this.$data.component,
        timerange: this.$data.timerange,
        from: moment(
          moment()
            .subtract(this.$data.timerange, "days")
            .toDate()
        ).unix(),
        to: moment(moment().toDate()).unix()
      })
      .then(response => {
        this.$data.showLog = response.data;
      })
      .catch(() => {
        // tslint:disable-next-line: no-console
        console.error("Show audit log failed");
      });
    this.$store.dispatch("systemConfig/hideLoader");
  }
  private downloadAuditLogs() {
    this.$store.dispatch(
      "systemConfig/showLoader",
      "Download log in progress..."
    );
    this.$store
      .dispatch("download/downloadLogs", {
        component: this.$data.component,
        timerange: this.$data.timerange,
        from: moment(
          moment()
            .subtract(this.$data.timerange, "days")
            .toDate()
        ).unix(),
        to: moment(moment().toDate()).unix()
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
      })
      .catch(() => {
        // tslint:disable-next-line: no-console
        console.error("download failed");
      });
    this.$store.dispatch("systemConfig/hideLoader");
  }
  private handleTimerangeDropdownSelect(selected: any) {
    this.$data.timerange = selected.value;
    this.$data.timerangeLabel = selected.label;
  }
  private handleComponentDropdownSelect(selected: any) {
    this.$data.component = selected.value;
  }
}
</script>
<style lang="scss" scoped></style>
