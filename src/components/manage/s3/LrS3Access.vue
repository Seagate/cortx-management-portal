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
  <div>
    <SgtDataTable
      ref="lrS3AccessDataTable"
      :headers="s3AccountConst.s3AccessTable.headers"
      :records="accessList"
      :isMultiSelect="s3AccountConst.s3AccessTable.isMultiSelect"
      :itemKey="s3AccountConst.s3AccessTable.itemKey"
      :isPagination="false"
      :headerButton="s3AccountConst.s3AccessTable.headerButton"
      @generate="generateNewKey"
      @delete="deleteKey"
    >
      <template v-slot:statusFlag="{ data }">
        <SgtToggle
          v-if="data"
          :tooltip="accessList[data.rowIdx].statusFlag ? 'Active' : 'Inactive'"
          v-model="accessList[data.rowIdx].statusFlag"
          @change="updateAccessKeyStatus($event)"
        ></SgtToggle>
      </template>
    </SgtDataTable>
    <v-dialog v-model="generatedAccessKeyDialog" max-width="800px" persistent>
      <v-card>
        <v-card-title>
          <div class="title-container">
            <SgtSvgIcon
              icon="green-tick.svg"
              class="title-icon"
              disableClick="true"
            />
            <div class="title-content">Access key created</div>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <div class="content-container">
            <v-container>
              <v-row class="content-title">
                <v-col>
                  <v-icon class="content-title-icon" color="csmwarning"
                    >mdi-alert-circle-outline</v-icon
                  >Save this information, you will not see it again. Download as
                  CSV and close.
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="3">
                  <b>Access Key :</b>
                </v-col>
                <v-col>{{ newAccessKey.access_key_id }}</v-col>
              </v-row>
              <v-row>
                <v-col cols="3">
                  <b>Secret Key :</b>
                </v-col>
                <v-col>{{ newAccessKey.secret_key }}</v-col>
              </v-row>
              <v-row>
                <v-col cols="3">
                  <b>Note :</b>
                </v-col>
                <v-col
                  >This deployment is not configured with Virtual IP. Please
                  check documentation to get IP Address of public data
                  interface</v-col
                >
              </v-row>
            </v-container>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <v-btn color="csmprimary" @click="downloadKey()" dark
            >Save & Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SgtDataTable from "@/lib/components/SgtDataTable/SgtDataTable.vue";
import { lrS3AccountConst } from "./LrS3.constant";
import { Api } from "@/services/Api";
import SgtSvgIcon from "@/lib/components/SgtSvgIcon/SgtSvgIcon.vue";
import SgtDialog from "@/lib/components/SgtDialog/SgtDialog.vue";
import { SgtDialogModel } from "@/lib/components/SgtDialog/SgtDialog.model";
import { create } from "vue-modal-dialogs";
import SgtToggle from "@/lib/components/SgtToggle/SgtToggle.vue";

@Component({
  name: "LrS3Access",
  components: { SgtDataTable, SgtSvgIcon, SgtToggle },
})
export default class LrS3Access extends Vue {
  s3AccountConst: any = JSON.parse(JSON.stringify(lrS3AccountConst));
  accessList = [];
  selectedRecord: any = null;
  newAccessKey = {};
  generatedAccessKeyDialog = false;
  deleteModal = create<SgtDialogModel>(SgtDialog);
  status = "active";

  mounted() {
    this.getAccessKeys();
  }
  getAccessKeys() {
    Api.getData("s3/access_keys", { isDummy: true }).then((resp: any) => {
      this.accessList = resp["access_keys"];
      this.accessList = resp["access_keys"].map((ele: any) => {
        return { ...ele, statusFlag: ele.status == "active" ? true : false };
      });
      if (this.accessList.length > 1) {
        this.s3AccountConst.s3AccessTable.headerButton["disabled"] = true;
        this.s3AccountConst.s3AccessTable.headers[
          this.s3AccountConst.s3AccessTable.headers.length - 1
        ]["actionList"] = ["delete"];
      } else {
        this.s3AccountConst.s3AccessTable.headerButton["disabled"] = false;
        this.s3AccountConst.s3AccessTable.headers[
          this.s3AccountConst.s3AccessTable.headers.length - 1
        ]["actionList"] = [];
      }
    });
  }

  generateNewKey() {
    //code to generate key
    Api.getData("s3/generate_access_keys", { isDummy: true }).then(
      (resp: any) => {
        this.newAccessKey = resp;
        this.generatedAccessKeyDialog = true;
      }
    );
  }

  downloadKey() {
    const headerNames = Object.keys(this.newAccessKey).join(",") + "\n";
    const values = Object.entries(this.newAccessKey)
      .map(([k, v]: [string, any]) => {
        return v.replaceAll(/,/g, " ");
      })
      .join(",");
    const csv = headerNames + values;
    const anchor = document.createElement("a");
    anchor.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    anchor.target = "_blank";
    anchor.download = "credentials.csv";
    anchor.click();
    this.getAccessKeys();
    this.generatedAccessKeyDialog = false;
  }

  async deleteKey(row: any) {
    const result = await this.deleteModal({
      modalTitle: "Confirmation",
      modalContent: `Are you sure you want to delete <b>${row.access_key_id}</b> ?`,
      modalType: "prompt",
      modalContentType: "html",
    }).then((resp) => {
      //code to delete
      console.log(resp);
    });
  }

  updateAccessKeyStatus(toggleStatus: boolean) {
    //code to update
  }
}
</script>
<style lang="scss" scoped>
.title-container {
  width: 100%;
  .close-btn {
    cursor: pointer;
    float: right;
  }
  .title-content {
    display: inline-block;
  }
  .title-icon {
    vertical-align: top;
    padding-right: 0.5rem;
  }
}
.content-container {
  margin-top: 1rem;
  .content-title {
    color: $warning;
    font-size: 1rem;
    .content-title-icon {
      padding-right: 0.5rem;
    }
  }
}
</style>