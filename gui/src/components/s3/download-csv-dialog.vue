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
  <v-dialog v-model="show" persistent max-width="790">
    <v-card>
      <v-system-bar color="greay lighten-3">
        <v-spacer></v-spacer>
        <v-icon
          id="download-csv-dialog-cancel-btn"
          @click="closeAccountDetailsDialog()"
          class="eos-cursor-pointer"
          >mdi-close</v-icon
        >
      </v-system-bar>
      <v-card-title class="title mt-6 ml-3">
        <img class="mr-2" :src="require('@/assets/resolved-default.svg')" />
        <span>{{ title }}</span>
      </v-card-title>
      <v-divider />

      <div class="mt-2 pl-7 dialog-message-container">
        <img
          class="eos-float-l mr-1"
          :src="require('@/assets/actions/warning-orange.svg')"
        />
        <span
          class="eos-float-l eos-text-md eos-text-bold eos-text-warning mt-1"
          >{{ $t("s3.download-csv-dialog.message") }}</span
        >
      </div>

      <table class="mt-2 ml-7 eos-text-md">
        <template v-for="[item, value] in Object.entries(tableContent)">
          <tr :key="item">
            <td class="py-2 eos-text-bold credentials-item-label">
              {{ item }}
            </td>
            <td class="py-2">{{ value }}</td>
          </tr>
        </template>
      </table>

      <v-card-actions>
        <a
          id="download-csv-dialog-btn"
          class="ma-5 eos-btn-primary eos-download-csv-link"
          :href="credentialsFileContent"
          download="credentials.csv"
          @click="isCredentialsFileDownloaded = true"
          >{{ $t("s3.download-csv-dialog.btn") }}</a
        >
        <button
          id="download-csv-dialog-ok-btn"
          :disabled="!isCredentialsFileDownloaded"
          type="button"
          class="ma-5 eos-btn-primary"
          @click="closeAccountDetailsDialog()"
        >
          Ok
        </button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import i18n from "./../../i18n";

@Component({
  name: "cortx-download-csv-dialog"
})
export default class CortxDownloadCsvDialog extends Vue {
  private isCredentialsFileDownloaded: boolean = false;
  private credentialsFileContent: string = "";
  @Prop({ required: true, default: false })
  private show!: boolean;

  @Prop({ required: true, default: {} })
  private tableContent!: object;

  @Prop({ required: false })
  private title!: string;

  constructor() {
    super();
  }

  @Watch("tableContent", { deep: true })
  public async onTableContentChange() {
    this.isCredentialsFileDownloaded = false;
    this.credentialsFileContent =
      "data:text/plain;charset=utf-8," +
      encodeURIComponent(this.getCredentialsFileContent());
  }

  public getCredentialsFileContent(): string {
    const headerNames = Object.keys(this.tableContent).join(",") + "\n";
    const values = Object.entries(this.tableContent)
      .map(([k, v]) => v)
      .join(",");
    return headerNames + values;
  }

  public async closeAccountDetailsDialog() {
    this.$emit("closeDialog", true);
    this.isCredentialsFileDownloaded = false;
    this.credentialsFileContent = "";
  }
}
</script>
<style lang="scss" scoped>
.dialog-message-container {
  height: 30px;
}
tr {
  border-style: solid !important;
  border-width: 1px !important;
  border-color: #e3e3e3 !important;
}
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
.tableheader:hover {
  .notActive {
    opacity: 1;
  }
}
tbody tr:active {
  border-top: 2px solid darkgray !important;
  border-bottom: 2px solid darkgray !important;
}
.delete-account-confirmation-msg {
  color: #000;
  font-size: 16px;
}
.eos-download-csv-link {
  text-decoration: none;
  display: inline-block;
  padding-top: 10px;
  color: #ffffff;
}
.credentials-item-label {
  width: 10rem;
}
</style>
