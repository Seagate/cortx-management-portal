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
  <div class="eos-p-2" v-if="alert">
    <div class="eos-back-to-alerts-btn" @click="$router.push('/alerts')">
      <img :src="require('@/assets/arrow-left.svg')" />
      <span class="mt-1">Alerts</span>
    </div>
    <div style="border-bottom: 1px solid rgba(0, 0, 0, 0.12);" class="mt-4 mb-3">
      <div style="height: 30px;">
        <div class="eos-float-l" v-if="alert && alertExtendedInfo">
          <label class="eos-text-lg eos-text-bold">Id:&nbsp;</label>
          <label>{{ alertExtendedInfo.resource_id }}</label>
          <label class="eos-text-lg eos-text-bold">&nbsp;| Name:&nbsp;</label>
          <label>{{ alert.module_type }}</label>
        </div>
      </div>
      <div class="eos-text-md eos-text-bold">
        <div>
          <label>Cluster {{ alertExtendedInfo.cluster_id }}</label>
          <label>&nbsp;| Site {{ alertExtendedInfo.site_id }}</label>
          <label>&nbsp;| Rack {{ alertExtendedInfo.rack_id }}</label>
          <label>&nbsp;| Node {{ alertExtendedInfo.node_id }}</label>
        </div>
        <div>
          <label>Resource type: {{ alertExtendedInfo.resource_type }}</label>
          <label>&nbsp;| State: {{ alert.state }}</label>
        </div>
        <div>
          <span
            v-if="alert.module_type === 'logical_volume'"
          >Volume group: {{ alert.volume_group }} | Volume name: {{ alert.name }}</span>
          <span
            v-else-if="alert.module_type === 'system'"
          >Version: {{ alert.version }} | Nodename: {{ alert.name }}</span>
          <span
            v-else-if="alert.module_type === 'volume'"
          >Size: {{ alert.volume_size }} | Total size: {{ alert.volume_total_size }}</span>
          <span v-else-if="alert.module_type === 'current'">Sensor name: {{ alert.name }}</span>
          <span v-else-if="alert.module_name === 'enclosure:fru:psu'">Location: {{ alert.location }}</span>
          <span
            v-else-if="alert.module_name === 'enclosure:fru:fan' || alert.module_name === 'enclosure:fru:sideplane'"
          >Name: {{ alert.name }} | Location: {{ alert.location }}</span>
          <span
            v-else-if="alert.module_name === 'enclosure:fru:disk'"
          >Serial number: {{ alert.serial_number }} | Size: {{ alert.volume_size }}</span>
          <span
            v-else-if="alert.module_type === 'controller'"
          >Serial number: {{ alert.serial_number }}</span>
        </div>
      </div>
      <div class="mt-3">
        <label v-if="alert">{{ new Date(alert.created_time*1000) | timeago }}</label>
      </div>
      <div style="height: 30px;" class="mt-2">
        <div class="eos-float-l">
          <img
           id="alert-resolved-icon"
            v-if="alert.resolved"
            class="eos-float-l"
            :src="require('@/assets/resolved-filled-default.svg')"
          />
          <img v-else class="eos-float-l" :src="require('@/assets/resolved-filled-disabled.svg')" />
          <label
            :class="alert.resolved ? '' : 'eos-alert-status-chip-disabled'"
            style="float: left;"
          >Resolved |</label>
          <img
            id="alert-acknowledge-icon"
            v-if="alert.acknowledged"
            class="eos-float-l"
            :src="require('@/assets/acknowledge-default.svg')"
          />
          <img v-else class="eos-float-l" :src="require('@/assets/acknowledge-disabled.svg')"  id="alert-acknowledge-disabled-icon"/>
          <label
            :class="alert.acknowledged ? '' : 'eos-alert-status-chip-disabled'"
            style="float: left;"
          >Acknowledged</label>
        </div>
        <div class="eos-float-r">
          <label id="alert-details"
            @click="showAlertDetailsDialog = true"
            class="eos-text-md eos-cursor-pointer"
            style="color: #6EBE49;"
          >Details</label>
        </div>
      </div>
    </div>
    <template v-if="alertEventDetails.length > 0">
      <div v-for="(event_detail, i) in alertEventDetails" v-bind:key="'event_detail_' + i">
        <div class="mb-2" style="border: 1px solid #E8E8E8;" v-if="event_detail.event_reason">
          <div class="pa-2" style="background: #E8E8E8;">
            <label>Name:&nbsp;</label>
            <label>{{ event_detail.name }}</label>
          </div>
          <div class="pa-2">
            <label>Reason: {{ event_detail.event_reason }}</label>
            <span id="alert-recommentation"
              v-if="event_detail.event_recommendation.length > 0"
              @click="event_detail.showRecommendation = !event_detail.showRecommendation"
              style="color: #6EBE49;cursor: pointer;font-size: 12px;"
            >Recommendations</span>
          </div>
          <div class="pa-2" v-if="event_detail.showRecommendation">
            <label>Recommendations:</label>
            <div>
              <ul
                v-for="(recommendation, index) in event_detail.event_recommendation"
                v-bind:key="index"
              >
                <li v-if="recommendation">{{ recommendation }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-if="showAlertDetailsDialog">
      <div class="eos-modal-container">
        <div class="eos-modal" style="width: 56.250em;">
          <div class="eos-modal-header">
            <label>Alert Details</label>
            <img id="alert-showalert-details-dialogbox"
              class="eos-modal-close"
              :src="require('@/assets/close-green.svg')"
              @click="showAlertDetailsDialog = false"
            />
          </div>
          <div class="eos-modal-body" style="height: 21.875em;overflow: auto;">
            <AlertExtendedInfoComp :alertExtendedInfo="alertDetails" />
          </div>
        </div>
      </div>
    </template>
    <eos-alert-comments v-model="isShowCommentsDialog" :alertId="alertId" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";
import { Validations } from "vuelidate-property-decorators";
import { required, maxLength } from "vuelidate/lib/validators";
import { Api } from "./../../services/api";
import apiRegister from "./../../services/api-register";
import { AlertEventDetail, AlertExtendedInfo } from "../../models/alert";
import AlertExtendedInfoComp from "./alert-extended-info.vue";
import EosAlertComments from "./alert-comments.vue";
import EosAlertOccurrences from "./alert-occurrences.vue";
import EosAlertRelated from "./alert-related.vue";
import EosTabs, { TabsInfo } from "./../widgets/eos-tabs.vue";

@Component({
  name: "alert-history",
  components: {
    AlertExtendedInfoComp,
    EosAlertComments,
    EosAlertOccurrences,
    EosAlertRelated,
    EosTabs
  }
})
export default class EosAlertHistory extends Vue {
  public alertId: string = "";
  public alert: any = null;
  public alertEventDetails: AlertEventDetail[] = [];
  public alertExtendedInfo: AlertExtendedInfo = {};
  public alertDetails: any = {};
  public showAlertDetailsDialog: boolean = false;
  public isShowCommentsDialog: boolean = false;
  public addCommentForm = {
    comment_text: ""
  };

  @Validations()
  public validations = {
    addCommentForm: {
      comment_text: { required, maxLength: maxLength(250) }
    }
  };

  public async mounted() {
    this.alertId = this.$route.params.alert_id;

    this.$store.dispatch("systemConfig/showLoaderMessage", {
      show: true,
      message: "Fetching alert details..."
    });
    const res = await Api.getAll(
      apiRegister.alerts_history + "/" + this.alertId
    );
    if (res.data) {
      this.alert = res.data;
      try {
        if (this.alert.extended_info) {
          /**
           * The string in alert.extended_info is not a valid JSON string (as designed by backend).
           * To make it a valid JSON string and convert to JSON object, we need to replace single quote
           * with double quote. The below statement does that.
           */
          const tempAlertExtendedInfoJSONString = this.alert.extended_info
            .split("'")
            .join("\"");  // Do not change this to "'"
          this.alertDetails = JSON.parse(tempAlertExtendedInfoJSONString);
          this.alertExtendedInfo = this.alertDetails.info;
        }

        let tempAlertEventDetails = [];
        if (this.alert.event_details) {
          /**
           * The string in alert.event_details is not a valid JSON string (as designed by backend).
           * To make it a valid JSON string and convert to JSON object, we need to replace single quote
           * with double quote. The below statement does that.
           */
          const tempAlertEventDetailsJSONString = this.alert.event_details
            .split("'")
            .join("\"");  // Do not change this to "'"
          tempAlertEventDetails = JSON.parse(tempAlertEventDetailsJSONString);
        }
        if (tempAlertEventDetails.length > 0) {
          tempAlertEventDetails.forEach((event_detail: any) => {
            const alertEventDetail: AlertEventDetail = {
              name: event_detail.name,
              event_reason: event_detail.event_reason,
              event_recommendation: event_detail.event_recommendation.split(
                "-"
              ),
              showRecommendation: false
            };
            this.alertEventDetails.push(alertEventDetail);
          });
        } else {
          this.alertEventDetails.push({
            name: this.alertExtendedInfo.resource_id
              ? this.alertExtendedInfo.resource_id
              : "",
            event_reason: this.alert.description,
            event_recommendation: this.alert.health_recommendation
              ? this.alert.health_recommendation.split("-")
              : [],
            showRecommendation: false
          });
        }
      } catch (e) {
        // tslint:disable-next-line: no-console
        console.log(e);
      }
    }
    this.$store.dispatch("systemConfig/showLoaderMessage", {
      show: false,
      message: ""
    });
  }

  public async acknowledgeAlert() {
    let tempAlertAcknowledged: boolean = true;
    let loaderMessage: string = "Acknowledging alert...";
    if (this.alert.acknowledged) {
      tempAlertAcknowledged = false;
      loaderMessage = "Unacknowledging alert...";
    }
    this.$store.dispatch("systemConfig/showLoaderMessage", {
      show: true,
      message: loaderMessage
    });
    try {
      await Api.patch(
        apiRegister.all_alerts,
        { acknowledged: tempAlertAcknowledged },
        this.alertId
      );
      this.alert.acknowledged = tempAlertAcknowledged;
      this.$store.dispatch("alertDataAction");
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.log(e);
    }
    this.$store.dispatch("systemConfig/showLoaderMessage", {
      show: false,
      message: ""
    });
  }
}
</script>

<style lang="scss" scoped >
.eos-back-to-alerts-btn {
  display: flex;
  cursor: pointer;
  width: 80px;
  color: #6ebe49;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 22px;
}
.eos-alert-status-chip-disabled {
  color: #b7b7b7;
}
</style>
