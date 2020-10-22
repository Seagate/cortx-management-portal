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
  <v-container class="mt-6 body-2">
    <v-img
      id="alert-img"
      :src="require('./../../assets/onboarding-wizard.png')"
      width="780px"
      height="70px"
    ></v-img>
    <v-divider />
    <div>
      <div class="title mt-6 csmprimary--text">{{ $t("s3.s3ConfigSummary") }}</div>
    </div>
    <div class="mt-4">
      <div
        class="font-weight-regular black--text"
      >{{ $t("s3.summaryOfInitialConfig") }}</div>
      <v-divider class="mt-5" />
      <v-row v-for="item in Account" :key="item.name">
        <v-col class="pl-5 col-3">{{item.user}}</v-col>
        <v-col class="pl-5 col-9">{{item.accountname}}</v-col>
      </v-row>
    </div>
    <v-divider class="mt-8" />
    <div class="mt-3">
      <v-dialog v-model="dialog" width="700">
        <template v-slot:activator="{ on }">
          <v-btn elevation="0" color="csmprimary" @click="gotToNextPage()" v-on="on">
            <span class="white--text">{{ $t("s3.finishConfiguration") }}</span>
          </v-btn>
        </template>
        <v-card height="500">
          <v-card-title class="headline grey lighten-2" primary-title></v-card-title>
          <div class="ml-10">
            <v-card-text>
              <div class="title mt-6 csmprimary--text">
                <v-icon class="csmprimary--text" size="20">mdi-check-circle-outline</v-icon>
                <span>{{ $t("s3.successInProgress") }}</span>
              </div>
              <v-divider class="mt-3 mb-10" />
              <div class="font-weight-regular black--text mb-10">{{ $t("s3.msgAboutHappening") }}</div>
              <v-btn tile large width="10em" levation="0" color="csmprimary">
                <span class="white--text">{{ $t("common.ok-text") }}</span>
              </v-btn>
            </v-card-text>
          </div>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import i18n from "../../i18n";

@Component({
  name: "cortx-bucketconfigsummary"
})
export default class CortxConfigurationSummary extends Vue {
  private data() {
    return {
      Account: [
        {
          user: "S3 ACCOUNT CREATED",
          accountname: "ACCOUNT NO159"
        },
        {
          user: "IMA USER CREATEDS",
          accountname: "USER NAME 237"
        },
        {
          user: "BUCKET CREATED",
          accountname: " BUCKET NAME 62"
        }
      ]
    };
  }
}
</script>

<style lang="scss" scoped>
table {
  font-size: 12px;
}
td {
  border: none;
  text-align: left;
  padding: 11px;
}
</style>
