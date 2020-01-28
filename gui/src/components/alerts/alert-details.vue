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
  <div class="eos-p-2" v-if="alert">
    <div class="eos-back-to-alerts-btn" @click="$router.push('/alerts')">
      <img :src="require('@/assets/arrow-left.svg')" />
      <span class="mt-1">Alerts</span>
    </div>
    <div style="border-bottom: 1px solid rgba(0, 0, 0, 0.12);" class="mt-4 mb-3">
      <div style="height: 30px;">
        <div style="float: left;" v-if="alert && alertExtendedInfo">
          <label class="eos-alert-detail-title">Id: </label>
          <label>{{ alertExtendedInfo.resource_id }}</label>
          <label class="eos-alert-detail-title"> | Name: </label>
          <label>{{ alert.module_type }}</label>
        </div>
        <div style="float: right;">
          <div class="eos-icon-btn eos-comment-icon"></div>
          <div class="eos-icon-btn eos-acknowledge-icon ml-5" @click="acknowledgeAlert()"></div>
          <div class="eos-icon-btn eos-resolved-icon ml-5"></div>
        </div>
      </div>
      <div style="font-size: 14px;font-weight: bold;">
        <div>
          <label>Cluster {{ alertExtendedInfo.cluster_id }}</label>
          <label> | Site {{ alertExtendedInfo.site_id }}</label>
          <label> | Rack {{ alertExtendedInfo.rack_id }}</label>
          <label> | Node {{ alertExtendedInfo.node_id }}</label>
        </div>
        <div>
          <label>Resource Type: {{ alertExtendedInfo.resource_type }}</label>
          <label> | State: {{ alert.state }}</label>
        </div>
        <div>
          <span
            v-if="alert.module_type === 'logical_volume'"
          >Volume Group: {{ alert.volume_group }} | Volume Name: {{ alert.name }}</span>
          <span
            v-else-if="alert.module_type === 'system'"
          >Version: {{ alert.version }} | Nodename: {{ alert.name }}</span>
          <span
            v-else-if="alert.module_type === 'volume'"
          >Size: {{ alert.volume_size }} | Total Size: {{ alert.volume_total_size }}</span>
          <span v-else-if="alert.module_type === 'current'">Sensor Name: {{ alert.name }}</span>
          <span v-else-if="alert.module_type === 'psu'">Location: {{ alert.location }}</span>
          <span
            v-else-if="alert.module_type === 'fan' || alert.module_type === 'sideplane'"
          >Name: {{ alert.name }} | Location: {{ alert.location }}</span>
          <span
            v-else-if="alert.module_type === 'disk'"
          >Serial Number: {{ alert.serial_number }} | Size: {{ alert.volume_size }}</span>
          <span
            v-else-if="alert.module_type === 'controller'"
          >Serial Number: {{ alert.serial_number }}</span>
        </div>
      </div>
      <div class="mt-3">
        <label v-if="alert">{{ new Date(alert.created_time*1000) | timeago }}</label>
      </div>
      <div style="height: 30px;" class="mt-2">
        <div class="eos-float-l">
          <img
            v-if="alert.resolved"
            style="float: left;"
            :src="require('@/assets/resolved-filled-default.svg')"
          />
          <img v-else style="float: left;" :src="require('@/assets/resolved-filled-disabled.svg')" />
          <label
            :class="alert.resolved ? '' : 'eos-alert-status-chip-disabled'"
            style="float: left;"
          >Resolved |</label>
          <img
            v-if="alert.acknowledged"
            style="float: left;"
            :src="require('@/assets/acknowledge-default.svg')"
          />
          <img v-else style="float: left;" :src="require('@/assets/acknowledge-disabled.svg')" />
          <label
            :class="alert.acknowledged ? '' : 'eos-alert-status-chip-disabled'"
            style="float: left;"
          >Acknowledged</label>
        </div>
        <div class="eos-float-r">
          <label
            @click="showAlertDetailsDialog = true"
            class="eos-text-md eos-cursor-pointer"
            style="color: #6EBE49;"
          >Details</label>
        </div>
      </div>
    </div>
    <template v-if="alertEventDetails.length > 0">
      <div
        v-for="(event_detail, i) in alertEventDetails"
        v-bind:key="'event_detail_' + i"
        class="mb-2"
        style="border: 1px solid #E8E8E8;"
      >
        <div class="pa-2" style="background: #E8E8E8;">
          <label>Name:</label>
          <label>{{ event_detail.name }}</label>
        </div>
        <div class="pa-2">
          <label>Reason:</label>
          <label>{{ event_detail.event_reason }}</label>
          <span
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
    </template>
    <template v-if="showAlertDetailsDialog">
      <div class="eos-modal-container">
        <div class="eos-modal" style="width: 56.250em;">
          <div class="eos-modal-header">
            <label>Alert Details</label>
            <img
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Api } from "./../../services/api";
import apiRegister from "./../../services/api-register";
import { AlertEventDetail, AlertExtendedInfo } from "../../models/alert";
import AlertExtendedInfoComp from "./alert-extended-info.vue";

@Component({
  name: "eos-alert-details",
  components: { AlertExtendedInfoComp }
})
export default class EosAlertDetails extends Vue {
  public alert: any = null;
  public alertEventDetails: AlertEventDetail[] = [];
  public alertExtendedInfo: AlertExtendedInfo = {};
  public alertDetails: any = {};
  public showAlertDetailsDialog: boolean = false;

  public async mounted() {
    this.$store.dispatch("systemConfig/showLoaderMessage", {
      show: true,
      message: "Fetching Alert details..."
    });
    try {
      const res = await Api.getAll(
        apiRegister.all_alerts + "/" + this.$route.params["alert_id"]
      );
      this.alert = res.data;
      if (this.alert["event_details"]) {
        const tempAlertEventDetailsJSONString = this.alert["event_details"]
          .split("'")
          .join('"');
        const tempAlertEventDetails = JSON.parse(
          tempAlertEventDetailsJSONString
        );
        tempAlertEventDetails.forEach((event_detail: any) => {
          const alertEventDetail: AlertEventDetail = {
            name: event_detail.name,
            event_reason: event_detail.event_reason,
            event_recommendation: event_detail.event_recommendation.split("-"),
            showRecommendation: false
          };
          this.alertEventDetails.push(alertEventDetail);
        });
      }
      if (this.alert["extended_info"]) {
        const tempAlertExtendedInfoJSONString = this.alert["extended_info"]
          .split("'")
          .join('"');
        this.alertDetails = JSON.parse(tempAlertExtendedInfoJSONString);
        this.alertExtendedInfo = this.alertDetails["info"];
      }
    } catch (e) {}
    this.$store.dispatch("systemConfig/showLoaderMessage", {
      show: false,
      message: ""
    });
  }

  public async acknowledgeAlert() {
    if (!this.alert.acknowledged) {
      this.$store.dispatch("systemConfig/showLoaderMessage", {
        show: true,
        message: "Acknowledging Alert..."
      });
      try {
        await Api.patch(
          apiRegister.all_alerts,
          { acknowledged: true },
          this.$route.params["alert_id"]
        );
        this.alert.acknowledged = true;
      } catch (e) {}
      this.$store.dispatch("systemConfig/showLoaderMessage", {
        show: false,
        message: ""
      });
    }
  }

  public async resolveAlert() {
    if (!this.alert.resolved) {
      this.$store.dispatch("systemConfig/showLoaderMessage", {
        show: true,
        message: "Resolving Alert..."
      });
      try {
        await Api.patch(
          apiRegister.all_alerts,
          { resolved: true },
          this.$route.params["alert_id"]
        );
        this.alert.resolved = true;
      } catch (e) {}
      this.$store.dispatch("systemConfig/showLoaderMessage", {
        show: false,
        message: ""
      });
    }
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
  color: #b7b7b7;
}
</style>
