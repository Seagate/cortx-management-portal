<!--
* CORTX-CSM: CORTX Management web.
* Copyright (c) 2022 Seagate Technology LLC and/or its Affiliates
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
* please email opensource@seagate.com.
-->
<template>
  <div class="maintenance-update-software-page">
    <div class="top-section">
      <div class="page-title">
        Update Software
        <SgtTooltipIcon
          ><span>
            Update the software. Upload the software bundle file (.iso) received
            from Seagate. Click Start update once the bundle file is uploaded
            successfully. After the software update, you must login again.
          </span></SgtTooltipIcon
        >
      </div>
    </div>

    <div class="current-release-card">
      <LrDashboardInfoCard
        imgUrl="current-software.svg"
        title="Current Release"
        description="LR 2.5"
      />
    </div>

    <div class="available-releases-section">
      <SgtDataTable
        title="Available releases"
        :headers="availableSoftwareConfig.availableSoftwareTable.headers"
        :records="availableSoftwareData"
        :headerButton="{ name: 'upload', label: 'Upload' }"
        @upload="uploadHandler"
        @update="updateHandler"
        @zoom="releaseInfoHandler"
      />
    </div>

    <div class="software-update-status-section">
      <div class="section-title">Last Update Status</div>
      <SgtDataTable
        :headers="softwareUpdateStatusConfig.softwareUpdateStatusTable.headers"
        :records="softwareUpdateStatusData"
        @zoom="updateStatusInfoHandler"
      >
        <template v-slot:actionColumn="{ data }">
          <div class="action-icons-wrapper">
            <div class="all-icons-container">
              <div class="action-icons-container">
                <template v-if="getActionIcon(data.status) === 'resume'">
                  <SgtSvgIcon
                    icon="play-default-icon.svg"
                    hoverIcon="play-hover-icon.svg"
                    tooltip="Resume"
                    @click="actionIconHandler('resume', data)"
                  />
                </template>
                <template v-else-if="getActionIcon(data.status) === 'pause'">
                  <SgtSvgIcon
                    icon="pause-default-icon.svg"
                    hoverIcon="pause-hover-icon.svg"
                    tooltip="Pause"
                    @click="actionIconHandler('pause', data)"
                  />
                </template>
              </div>
            </div>
          </div>
        </template>
      </SgtDataTable>
    </div>

    <v-dialog
      :value="showUploadModel"
      @input="$emit('input', showUploadModel)"
      persistent
      max-width="590"
      class="upload-software-dialog"
    >
      <v-card class="upload-software-card">
        <v-card-title class="title-section">
          <span>Upload</span>
          <SgtSvgIcon
            icon="close-green.svg"
            @click="cancelOperation"
            class="close-btn"
            tooltip="Close"
          />
        </v-card-title>
        <v-divider />
        <v-card-text>
          <label for="software-file-upload">
            <v-btn class="mr-2 white--text" color="csmprimary">Browse</v-btn>
          </label>
          <input id="software-file-upload" type="file" />
        </v-card-text>
        <v-divider />
        <v-card-actions class="action-button-container">
          <v-btn
            class="mr-2 white--text"
            color="csmprimary"
            @click="fileUploadHandler()"
            >Upload</v-btn
          >
          <v-btn color="csmborder" @click="cancelOperation" dark>Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { create } from "vue-modal-dialogs";
import SgtDataTable from "@/lib/components/SgtDataTable/SgtDataTable.vue";
import SgtTooltipIcon from "@/lib/components/SgtTooltipIcon/SgtTooltipIcon.vue";
import LrDashboardInfoCard from "@/components/dashboard/LrDashboardInfoCard.vue";
import {
  lrMaintenanceAvailableSoftwareConst,
  lrMaintenanceSoftwareUpdateStatusConst,
} from "./LrMaintenance.constant";
import { Api } from "../../services/Api";
import SgtDialog from "@/lib/components/SgtDialog/SgtDialog.vue";
import { SgtDialogModel } from "@/lib/components/SgtDialog/SgtDialog.model";
import SgtSvgIcon from "@/lib/components/SgtSvgIcon/SgtSvgIcon.vue";

@Component({
  name: "LrMaintenanceUpdate",
  components: {
    SgtDataTable,
    SgtTooltipIcon,
    LrDashboardInfoCard,
    SgtSvgIcon,
  },
})
export default class LrMaintenanceUpdate extends Vue {
  availableSoftwareConfig = lrMaintenanceAvailableSoftwareConst;
  availableSoftwareData = [];
  softwareUpdateStatusConfig = lrMaintenanceSoftwareUpdateStatusConst;
  softwareUpdateStatusData = [];
  moreInfoModel = create<SgtDialogModel>(SgtDialog);
  showUploadModel = false;
  value = "";
  rowHoverIndex = -1;

  async mounted() {
    const availableSoftwareRes: any = await Api.getData(
      "maintenance/available-softwares",
      {
        isDummy: true,
      }
    );
    this.availableSoftwareData = availableSoftwareRes.data;

    const softwareUpdateStatusRes: any = await Api.getData(
      "maintenance/software-update-status",
      {
        isDummy: true,
      }
    );
    this.softwareUpdateStatusData = softwareUpdateStatusRes.data;
  }

  async uploadHandler(data: any) {
    this.showUploadModel = true;
  }

  async fileUploadHandler() {
    //
  }

  cancelOperation() {
    this.showUploadModel = false;
  }

  async updateHandler(data: any) {
    const result = await this.moreInfoModel({
      modalTitle: "Update",
      modalContent: `
        <b>Update for release ${data.releaseName} has started.</b>
      `,
      modalType: "message",
      modalContentType: "html",
      okButtonLabel: "Close",
    });
  }

  async releaseInfoHandler(data: any) {
    const result = await this.moreInfoModel({
      modalTitle: "Available Release",
      modalContent: `
        <b>Release Name:</b> ${data.releaseName}<br><br>
        <b>Release Date:</b> ${data.releaseDate}<br><br>
        <b>Release Notes</b><br><br>
        ${data.releaseNotes}
      `,
      modalType: "message",
      modalContentType: "html",
      okButtonLabel: "Close",
    });
  }

  async updateStatusInfoHandler(data: any) {
    const result = await this.moreInfoModel({
      modalTitle: "Last update status",
      modalContent: `
        <b>Release Name:</b> ${data.releaseName}<br><br>
        <b>Release Date:</b> ${data.releaseDate}<br><br>
        <b>Status:</b> ${data.status}<br><br>
        <b>Progress:</b> ${data.progress}%<br><br>
      `,
      modalType: "message",
      modalContentType: "html",
      okButtonLabel: "Close",
    });
  }

  getActionIcon(status: any) {
    switch (status) {
      case "In progress":
        return "pause";
      case "Fetching":
        return "pause";
      case "Failed":
        return "resume";
      case "Paused":
        return "resume";
    }
  }

  actionIconHandler(action: "resume" | "pause", data: any) {
    //API call to pause or resume the operation.
  }
}
</script>
<style lang="scss" scoped>
.maintenance-update-software-page {
  .page-title {
    font-weight: bold;
  }

  .info-card-container {
    max-width: 300px;
    font-weight: bold;
    box-shadow: 0px 2px 0px 0px #e5e5e5;
    margin-top: 1em;
    cursor: default;
  }

  .available-releases-section,
  .software-update-status-section {
    .section-title {
      font-weight: bold;
      margin: 1em 0 0.5em;
    }
  }

  ::v-deep .software-update-status-section {
    .sgt-data-table {
      .search-container {
        display: none !important;
      }
    }
  }

  .action-icons-wrapper {
    display: flex;
    justify-content: flex-end;
    .all-icons-container {
      position: relative;

      .action-icons-container {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 10px;
        position: absolute;
        right: -65px;
        top: -15px;
        z-index: 5;
      }
    }
  }
}
.upload-software-card .title-section {
  .close-btn {
    color: $primary;
    float: right;
  }
}
</style>
