/*****************************************************************************
 Filename:          eos-firmwareupdate-menu.vue
 Description:       Settings menu component.

 Creation Date:     31/12/2019
 Author:            Sanjeevan Bhave

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <div>
    <div id="auditlog" class="mb-4">
      <label id="auditlog-title" class="eos-text-bold eos-text-lg">Audit log</label>
      <div class="mt-1 eos-text-md">
        <label>You can download "audit logs" for the selected period.</label>
      </div>
    </div>
    <v-divider class="my-4" />

    <div class="col-4 py-0">
      <div class="eos-form-group">
        <label class="eos-form-group-label" for="cmdComponent" id="lblComponent">Component*</label>
        <select
          name="cmdComponent"
          id="cmdComponent"
          class="eos-form__input_text"
          v-model="component"
        >
          <option value="CSM">CSM</option>
          <option value="S3">S3</option>
        </select>

        <label class="eos-form-group-label" for="cmdTimeRange" id="lblTimeRange">Time range*</label>
        <select
          name="cmdTimeRange"
          id="cmdTimeRange"
          class="eos-form__input_text"
          v-model="timerange"
        >
          <option value="1">One day</option>
          <option value="2">Two days</option>
          <option value="3">Three days</option>
          <option value="4">Four days</option>
          <option value="5">Five days</option>
          <option value="6">Six days</option>
          <option value="7">Seven days</option>
        </select>
      </div>
      <div class="mt-8 nav-btn">
        <button type="button" class="eos-btn-primary mr-2" @click="downloadAuditLogs()">Download</button>
        <button type="button" class="eos-btn-primary" @click="showAuditLogs()">Show as HTML</button>
      </div>
    </div>
    <div class="ma-3 mt-5" v-if="showLog">
      <span class="eos-text-bold eos-text-lg">Logs</span>
      <v-divider class="my-2"></v-divider>
      <span class="mb-1 d-block" v-for="(log, index) in showLog" :key="index">
        {{
        log
        }}
      </span>
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
      timerange: "1",
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
}
</script>
<style lang="scss" scoped></style>
