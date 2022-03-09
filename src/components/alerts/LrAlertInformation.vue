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
  <div class="alert-details-container" v-if="alert">
    <div v-if="alert && alertExtendedInfo">
      <LrLabel name="Id" :value="alertExtendedInfo.resource_id" />
      <LrLabel name="Name" :value="alert.module_type" />
      <LrLabel name="Cluster" :value="alertExtendedInfo.cluster_id" />
      <LrLabel name="Site" :value="alertExtendedInfo.site_id" />
      <LrLabel name="Rack" :value="alertExtendedInfo.rack_id" />
      <LrLabel name="Host Name" :value="alert.hostname" />
    </div>
    <div>
      <LrLabel name="Resource Type" :value="alertExtendedInfo.resource_type" />
      <LrLabel name="State" :value="alert.state" />
      <LrLabel name="Created Time" :value="new Date(alert.created_time*1000)" />
      <LrLabel name="Updated Time" :value="new Date(alert.updated_time*1000)" />
    </div>

    <div>
      <template v-if="alert.module_type === 'logical_volume'">
        <LrLabel name="Volume Group" :value="alert.volume_group" />
        <LrLabel name="Volume Name" :value="alert.name" />
      </template>
      <template v-else-if="alert.module_type === 'system'">
        <LrLabel name="Version" :value="alert.version" />
        <LrLabel name="Node Name" :value="alert.name" />
      </template>
      <template v-else-if="alert.module_type === 'volume'">
        <LrLabel name="Size" :value="alert.volume_size" />
        <LrLabel name="Total Size" :value="alert.volume_total_size" />
      </template>
      <template v-else-if="alert.module_type === 'current'">
        <LrLabel name="Sensor Name" :value="alert.name" />
      </template>
      <template v-else-if="alert.module_type === 'controller'">
        <LrLabel name="Serial Number" :value="alert.serial_number" />
      </template>
    </div>

    <div>
      <template v-if="alert.module_name === 'enclosure:fru:psu'">
        <LrLabel name="Location" :value="alert.location" />
      </template>
      <template
        v-if="alert.module_name === 'enclosure:fru:fan' || alert.module_name === 'enclosure:fru:sideplane'"
      >
        <LrLabel name="Name" :value="alert.Name" />
        <LrLabel name="Location" :value="alert.location" />
      </template>
      <template v-if="alert.module_name === 'enclosure:fru:disk'">
        <LrLabel name="Serial Number" :value="alert.serial_number" />
        <LrLabel name="Size" :value="alert.volume_size" />
      </template>
    </div>

    <template v-if="alertEventDetails.length > 0">
      <div v-for="(event_detail, i) in alertEventDetails" v-bind:key="'event_detail_' + i">
        <LrLabel name="Name" :value="event_detail.name" />
        <LrLabel name="Reason" :value="event_detail.event_reason" />
        <LrLabel
          v-if="event_detail.event_recommendation.length > 0"
          name
          :value="alerts.recommendations"
        />
      </div>
    </template>

    <div style="float:right">
      <div class="alert-info">
        <img v-if="alert.resolved" :src="require('@/assets/icons/resolved-disabled.svg')" />
        <img v-else :src="require('@/assets/icons/resolved-disabled.svg')" />
        <span>Resolved</span>
      </div>
      <div class="alert-info">
        <img v-if="alert.acknowledged" :src="require('@/assets/icons/alerts-disabled.svg')" />
        <img v-else :src="require('@/assets/icons/alert-green.svg')" />
        <span>Acknowledged</span>
      </div>
      <div class="alert-info">
        <LrSvgIcon
          icon="more-info.svg"
          @click="showAlertDetailsDialog = true"
          class="action-btn-block"
        />
        <LrSvgIcon
          icon="comment-default.svg"
          hoverIcon="comment-hover.svg"
          @click="showAlertCommentsDialog = true"
          class="action-btn-block"
        />
        <LrSvgIcon
          icon="alert-green.svg"
          hoverIcon="alert-hover.svg"
          @click="acknowledge"
          class="action-btn-block"
        />
      </div>
    </div>

    <div>
      <LrAlertDialog
        v-if="alertDetails && alertExtendedInfo && Object.keys(alertExtendedInfo).length>0"
        :modalTitle="'Alert Details'"
        :modalData="alertExtendedInfo"
        :showAlertDetailsDialog.sync="showAlertDetailsDialog"
      />
    </div>
    <div>
      <LrAlertComments
        v-if="alertDetails"
        :id="alertDetails.alert_uuid"
        :showAlertCommentsDialog.sync="showAlertCommentsDialog"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";
import LrLabel from "../shared/LrLabel/LrLabel.vue";
import LrAlertDialog from "./LrAlertDialog.vue";
import LrAlertComments from "./LrAlertComments.vue";
import LrSvgIcon from "../shared/LrSvgIcon/LrSvgIcon.vue";

@Component({
	name: "LrAlertInformation",
	components: { LrLabel, LrAlertDialog, LrSvgIcon, LrAlertComments },
})
export default class LrAlertInformation extends Vue {
	@Prop({ required: true }) private alert: any;
	public alertEventDetails: any = [];
	public alertExtendedInfo: any = {};
	public alertDetails: any = {};
	public showAlertDetailsDialog = false;
	public showAlertCommentsDialog = false;
	public addCommentForm = {
		comment_text: "",
	};

	public async mounted() {
		try {
			if (this.alert.extended_info) {
				this.alertDetails = JSON.parse(this.alert.extended_info);
				this.alertExtendedInfo = this.alertDetails.info;
			}
			let tempAlertEventDetails = [];
			if (this.alert.event_details) {
				tempAlertEventDetails = JSON.parse(this.alert.event_details);
			}
			if (tempAlertEventDetails.length > 0) {
				tempAlertEventDetails.forEach((event_detail: any) => {
					const alertEventDetail = {
						name: event_detail.name,
						event_reason: event_detail.event_reason,
						event_recommendation: event_detail.event_recommendation.split("-"),
						showRecommendation: false,
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
					showRecommendation: false,
				});
			}
		} catch (e) {
			// tslint:disable-next-line: no-console
			console.log(e);
		}
	}

	comment() {
		//comment action
		this.showAlertCommentsDialog = true;
	}
	acknowledge() {
		//acknowledge action
	}
}
</script>

<style lang="scss" scoped >
.alert-details-container {
	margin: 0.5rem;
}
.alert-info {
	display: inline-block;
	padding-right: 1rem;
	span {
		vertical-align: super;
	}
	.action-btn-block {
		padding-right: 1rem;
	}
}
</style>