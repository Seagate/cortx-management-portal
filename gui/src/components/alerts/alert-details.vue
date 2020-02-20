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
        <div class="eos-float-l" v-if="alert && alertExtendedInfo">
          <label class="eos-text-lg eos-text-bold">Id:&nbsp;</label>
          <label>{{ alertExtendedInfo.resource_id }}</label>
          <label class="eos-text-lg eos-text-bold">&nbsp;| Name:&nbsp;</label>
          <label>{{ alert.module_type }}</label>
        </div>
        <div class="eos-float-r">
          <div class="eos-icon-btn eos-comment-icon" @click="showComments()"></div>
          <div class="eos-icon-btn eos-acknowledge-icon ml-5" @click="acknowledgeAlert()"></div>
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
            v-if="alert.acknowledged"
            class="eos-float-l"
            :src="require('@/assets/acknowledge-default.svg')"
          />
          <img v-else class="eos-float-l" :src="require('@/assets/acknowledge-disabled.svg')" />
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
      <div v-for="(event_detail, i) in alertEventDetails" v-bind:key="'event_detail_' + i">
        <div class="mb-2" style="border: 1px solid #E8E8E8;" v-if="event_detail.event_reason">
          <div class="pa-2" style="background: #E8E8E8;">
            <label>Name:&nbsp;</label>
            <label>{{ event_detail.name }}</label>
          </div>
          <div class="pa-2">
            <label>Reason: {{ event_detail.event_reason }}</label>
            <span
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
    <template v-if="showCommentsDialog">
      <div class="eos-modal-container">
        <div class="eos-modal">
          <div class="eos-modal-header">
            <label>Comments</label>
            <img
              class="eos-modal-close"
              :src="require('@/assets/close-green.svg')"
              @click="closeAddCommentDialog()"
            />
          </div>
          <div class="eos-comments-container">
            <label v-if="alertComments.length === 0" class="eos-text-md ml-4">No comments</label>
            <div v-else
              class="eos-comment"
              v-for="alertComment in alertComments"
              :key="alertComment.comment_id"
            >
              <div>
                <span class="eos-text-md">{{ alertComment.comment_text }}</span>
              </div>
              <div class="mt-2" style="height: 20px;">
                <span class="eos-text-sm">{{ new Date(alertComment.created_time * 1000) | timeago }}</span>
                <span class="eos-text-sm mx-3">|</span>
                <span class="eos-text-sm">{{ alertComment.created_by }}</span>
              </div>
            </div>
          </div>
          <div class="eos-modal-footer">
            <div
              class="eos-form-group"
              :class="{
                'eos-form-group--error': $v.addCommentForm.comment_text.$error
              }"
              style="width: 100%;"
            >
              <textarea
                class="eos-form__input_textarea"
                v-model.trim="addCommentForm.comment_text"
                @input="$v.addCommentForm.comment_text.$touch"
              ></textarea>
              <div class="eos-form-group-label eos-form-group-error-msg">
                <label
                  v-if="$v.addCommentForm.comment_text.$dirty && !$v.addCommentForm.comment_text.required"
                >Comment is required</label>
                <label
                  v-else-if="$v.addCommentForm.comment_text.$dirty && !$v.addCommentForm.comment_text.maxLength"
                >Comment cannot be more than 250 characters</label>
              </div>
            </div>
            <div style="height: 40px;margin-top:10px;">
              <button
                type="button"
                class="eos-btn-secondary eos-float-r ml-3"
                @click="closeAddCommentDialog()"
              >Cancel</button>
              <button
                type="button"
                class="eos-btn-primary eos-float-r"
                @click="saveComment()"
                :disabled="$v.addCommentForm.$invalid"
              >Save</button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Validations } from "vuelidate-property-decorators";
import { required, maxLength } from "vuelidate/lib/validators";
import { Api } from "./../../services/api";
import apiRegister from "./../../services/api-register";
import {
  AlertEventDetail,
  AlertExtendedInfo,
  AlertComment
} from "../../models/alert";
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
  public showCommentsDialog: boolean = false;
  public alertComments: AlertComment[] = [];
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
    this.$store.dispatch("systemConfig/showLoaderMessage", {
      show: true,
      message: "Fetching alert details..."
    });
    const res = await Api.getAll(
      apiRegister.all_alerts + "/" + this.$route.params.alert_id
    );
    if (res.data) {
      this.alert = res.data;
      try {
        if (this.alert.extended_info) {
          const tempAlertExtendedInfoJSONString = this.alert.extended_info
            .split("'")
            .join("\"");
          this.alertDetails = JSON.parse(tempAlertExtendedInfoJSONString);
          this.alertExtendedInfo = this.alertDetails.info;
        }

        let tempAlertEventDetails = [];
        if (this.alert.event_details) {
          const tempAlertEventDetailsJSONString = this.alert.event_details
            .split("'")
            .join("\"");
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
    if (!this.alert.acknowledged) {
      this.$store.dispatch("systemConfig/showLoaderMessage", {
        show: true,
        message: "Acknowledging alert..."
      });
      try {
        await Api.patch(
          apiRegister.all_alerts,
          { acknowledged: true },
          this.$route.params.alert_id
        );
        this.alert.acknowledged = true;
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

  public async showComments() {
    this.$store.dispatch("systemConfig/showLoaderMessage", {
      show: true,
      message: "Fetching comments..."
    });
    const res = await Api.getAll(
      apiRegister.all_alerts + "/" + this.$route.params.alert_id + "/comments"
    );
    if (res.data) {
      this.alertComments = res.data.comments;
    }
    this.$store.dispatch("systemConfig/showLoaderMessage", {
      show: false,
      message: ""
    });
    this.showCommentsDialog = true;
  }

  public async saveComment() {
    const comment = {
      comment_text: this.addCommentForm.comment_text
    };
    this.showCommentsDialog = false;
    this.resetAddCommentForm();
    this.$store.dispatch("systemConfig/showLoaderMessage", {
      show: true,
      message: "Adding comment..."
    });
    const res = await Api.post(
      apiRegister.all_alerts + "/" + this.$route.params.alert_id + "/comments",
      comment
    );
    this.$store.dispatch("systemConfig/showLoaderMessage", {
      show: false,
      message: ""
    });
  }

  public closeAddCommentDialog() {
    this.showCommentsDialog = false;
    this.resetAddCommentForm();
  }

  private resetAddCommentForm() {
    this.addCommentForm.comment_text = "";
    if (this.$v.addCommentForm) {
      this.$v.addCommentForm.$reset();
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
.eos-alert-status-chip-disabled {
  color: #b7b7b7;
}
.eos-modal-footer {
  height: 12em;
  padding: 0.5em;
}
.eos-comments-container {
  height: 12.5em;
  border-bottom: 1px solid #b7b7b7;
  overflow: auto;
  padding: 2px;
}
.eos-comment {
  padding: 0.5em;
  border: 1px solid #b7b7b7;
  margin-bottom: 2px;
  border-radius: 4px;
}
</style>
