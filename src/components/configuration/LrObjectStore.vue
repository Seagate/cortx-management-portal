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
  <div class="object-store-container">
    <div>
      <div class="page-title">Object Store</div>
      <v-divider></v-divider>
      <div class="page-sub-title">S3 Config</div>
    </div>
    <v-expansion-panels v-model="panel">
      <v-expansion-panel>
        <v-expansion-panel-header><b> Limits </b></v-expansion-panel-header>
        <v-expansion-panel-content class="panel-content">
          <v-row class="field-row">
            <v-col cols="3"> Max S3 Account </v-col>
            <v-col cols="4">
              <SgtDropdown
                :dropdownOptions="[5, 10, 20, 50, 100]"
                placeholder="select max s3 Account"
                v-model="limit.maxS3Account"
              />
            </v-col>
          </v-row>
          <v-row class="field-row">
            <v-col cols="3"> Max IAM user </v-col>
            <v-col cols="4">
              <SgtDropdown
                :dropdownOptions="[5, 10, 20, 50, 100]"
                placeholder="select max IAM user"
                v-model="limit.maxIAMUser"
              />
            </v-col>
          </v-row>
          <v-row class="field-row">
            <v-col cols="3"> Max Bucket </v-col>
            <v-col cols="4">
              <SgtDropdown
                :dropdownOptions="[5, 10, 20, 50, 100]"
                placeholder="select max bucket"
                v-model="limit.maxBucket"
              />
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row class="field-row">
            <v-col cols="3"></v-col>
            <v-col cols="4" class="button-col">
              <v-btn class="mr-5" color="primary" @click="applyLimit" dark
                >Apply
              </v-btn>
              <v-btn color="csmdisabled" @click="resetLimit" depressed dark
                >Reset</v-btn
              >
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header
          ><b> SSL Config </b>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="panel-content">
          <v-row class="field-row">
            <v-col cols="3">SSL certificate status</v-col>
            <v-col cols="4" style="min-height: 75px">
              {{ SSLConfig.status }}
            </v-col>
          </v-row>
          <v-row class="field-row">
            <v-col cols="3"> SSL certificate upload </v-col>
            <v-col cols="4">
              <SgtDropFile
                :fileName="SSLConfig.SSLCertificateName"
                v-model="SSLFile"
              />
            </v-col>
          </v-row>
          <v-row class="field-row">
            <v-col cols="3"></v-col>
            <v-col cols="4" class="button-col">
              <v-btn
                class="mr-5"
                color="primary"
                @click="installCertificate"
                :dark="SSLFile.length > 0"
                :disabled="SSLFile.length < 1"
                >Install Certificate
              </v-btn>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SgtDropdown from "@/lib/components/SgtDropdown/SgtDropdown.vue";
import SgtDropFile from "@/lib/components/SgtDropFile/SgtDropFile.vue";
import { Api } from "@/services/Api";
import SgtDialog from "@/lib/components/SgtDialog/SgtDialog.vue";
import { SgtDialogModel } from "@/lib/components/SgtDialog/SgtDialog.model";
import { create } from "vue-modal-dialogs";

@Component({
  name: "LrObjectStore",
  components: { SgtDropdown, SgtDropFile },
})
export default class LrObjectStore extends Vue {
  panel = 0;
  limit = {
    maxS3Account: null,
    maxIAMUser: null,
    maxBucket: null,
  };
  SSLConfig = {
    status: null,
    SSLCertificateName: null,
  };
  SSLFile = [];
  SSLModal = create<SgtDialogModel>(SgtDialog);

  mounted() {
    this.getLimit();
    this.getSSLConfig();
  }
  getLimit() {
    Api.getData("config/limit", { isDummy: true }).then((resp: any) => {
      this.limit = resp["limit"];
    });
  }
  getSSLConfig() {
    Api.getData("config/SSLConfig", { isDummy: true }).then((resp: any) => {
      this.SSLConfig = resp["config"];
    });
  }
  applyLimit() {
    //api call
  }
  resetLimit() {
    //api call
  }

  async installCertificate() {
    const result = await this.SSLModal({
      modalTitle: "Confirmation",
      modalContent: `Click Yes to install the SSL certificate. After installing the SSL certificate, you must login again.`,
      modalType: "prompt",
      modalContentType: "html",
    }).then((resp) => {
      //code to install or not
      console.log(resp);
    });
  }
}
</script>
<style lang="scss" scoped>
.object-store-container {
  .page-title {
    font-weight: bolder;
    font-size: 1.2rem;
    padding: 1rem 0;
  }
  .page-sub-title {
    font-weight: bold;
    padding: 1rem 1.5rem;
  }
}
.panel-content {
  border-top: 2px solid $border;
  border-right: 2px solid $border;
  padding-top: 3rem;
  padding-bottom: 1rem;

  .field-row {
    padding: 0 2rem;
  }
  .button-col {
    margin-top: 2rem;
  }
}
</style>
