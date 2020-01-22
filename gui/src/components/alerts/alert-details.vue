/*****************************************************************************
 Filename:          alert-details.vue
 Description:       Alert Details Component

 Creation Date:     10/01/2020
 Author:            Sri Bhargav Metta

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
<template>
  <div class="mt-5" v-if="alert">
    <div class="eos-back-to-alerts-btn" @click="$router.push('/alerts')">
      <img :src="require('@/assets/arrow-left.svg')" />
      <span class="mt-1">Alerts</span>
    </div>
    <div style="border-bottom: 1px solid rgba(0, 0, 0, 0.12);" class="mt-5 mb-3">
      <div style="height: 30px;">
        <div style="float: left;">
          <label class="eos-alert-detail-title" v-if="alert && alertExtendedInfo">{{ alertExtendedInfo.resource_id }} | {{ alertExtendedInfo.node_id }} | {{ alert.module_type }}</label>
        </div>
        <div style="float: right;">
          <div class="eos-icon-btn eos-comment-filled-icon"></div>
          <div class="eos-icon-btn eos-acknowledge-icon"></div>
          <div class="eos-icon-btn eos-resolved-filled-icon"></div>
        </div>
      </div>
      <div class="mt-3">
        <label v-if="alert">{{ new Date(alert.updated_time*1000) | timeago }}</label>
      </div>
      <div style="height: 30px;" class="mt-2">
        <img v-if="alert.resolved" style="float: left;" :src="require('@/assets/resolved-filled-default.svg')" />
        <img v-else style="float: left;" :src="require('@/assets/resolved-filled-disabled.svg')" />
        <label :class="alert.resolved ? '' : 'eos-alert-status-chip-disabled'" style="float: left;">Resolved | </label>
        <img v-if="alert.acknowledged" style="float: left;" :src="require('@/assets/acknowledge-default.svg')" />
        <img v-else style="float: left;" :src="require('@/assets/acknowledge-disabled.svg')" />
        <label :class="alert.acknowledged ? '' : 'eos-alert-status-chip-disabled'" style="float: left;">Acknowledged</label>
      </div>
    </div>
    <template v-if="alertEventDetails.length > 0">
      <div v-for="(event_detail, i) in alertEventDetails" v-bind:key="'event_detail_' + i" class="mb-2" style="border: 1px solid #E8E8E8;">
        <div class="pa-2" style="background: #E8E8E8;">
          <label>Name: </label><label>{{ event_detail.name }}</label>
        </div>
        <div class="pa-2">
          <label>Reason: </label><label>{{ event_detail.event_reason }} </label><span @click="event_detail.showRecommendation = !event_detail.showRecommendation" style="color: #6EBE49;cursor: pointer;font-size: 12px;">Recommendations</span>
        </div>
        <div class="pa-2" v-if="event_detail.showRecommendation">
          <label>Recommendations: </label>
          <div>
            <ul v-for="(recommendation, index) in event_detail.event_recommendation" v-bind:key="index">
              <li v-if="recommendation">{{ recommendation }}</li>
            </ul>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Api } from "./../../services/api";
import apiRegister from "./../../services/api-register";
import { AlertEventDetail, AlertExtendedInfo } from "../../models/alert";

@Component({
  name: "eos-alert-details"
})
export default class EosAlertDetails extends Vue {
  public alert: any = null;
  public alertEventDetails: AlertEventDetail[] = [];
  public alertExtendedInfo: AlertExtendedInfo = {};

  public async mounted(){
    this.$store.dispatch("systemConfig/showLoaderMessage", {show: true, message: "Fetching Alert details..."});
    try {
        const res = await Api.getAll(apiRegister.all_alerts + "/" + this.$route.params["alert_id"]);
        this.alert = res.data;
        if(this.alert["event_details"]){
          const tempAlertEventDetailsJSONString = this.alert["event_details"].split("'").join("\"");
          const tempAlertEventDetails = JSON.parse(tempAlertEventDetailsJSONString);
          tempAlertEventDetails.forEach((event_detail: any)=> {
            const alertEventDetail: AlertEventDetail = {
              name: event_detail.name,
              event_reason: event_detail.event_reason,
              event_recommendation: event_detail.event_recommendation.split('-'),
              showRecommendation: false
            };
            this.alertEventDetails.push(alertEventDetail);
          });
        }
        if(this.alert["extended_info"]){
          const tempAlertExtendedInfoJSONString = this.alert["extended_info"].split("'").join("\"");
          const tempAlertExtendedInfo = JSON.parse(tempAlertExtendedInfoJSONString);
          this.alertExtendedInfo = tempAlertExtendedInfo["info"];
        }
    } catch (e) {}
    this.$store.dispatch("systemConfig/showLoaderMessage", {show: false, message: ""});
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
.eos-alert-detail-title {
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 26px;
  color: rgba(0, 0, 0, 0.87);
}
.eos-alert-status-chip-disabled {
  color: #B7B7B7;
}
</style>
