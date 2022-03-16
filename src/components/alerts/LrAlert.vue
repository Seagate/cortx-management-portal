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
  <div v-if="showDataTable">
    <LrDataTable
      ref="alertDataTable"
      :headers="alertConst.alertTable.headers"
      :records="alerts"
      :searchConfig="alertConst.searchConfig"
      :isMultiSelect="alertConst.alertTable.isMultiSelect"
      :multiSelectButtons="alertConst.alertTable.multiSelectButtons"
      :chips="chips"
      :itemKey="alertConst.alertTable.itemKey"
      @zoom="openDetails($event)"
      @comment="comment($event)"
      @acknowledge="multiAcknowledge($event)"
      @update-record="updateRecord($event)"
    >
      <template v-slot:severity="{data}">
        <v-avatar :color="getColor(data)" size="24"></v-avatar>
      </template>
      <template v-slot:description="{data}">{{data.description}}</template>
    </LrDataTable>
    <LrAlertDialog
      v-if="selectedRecord"
      :modalTitle="'Alert Details'"
      :modalData="selectedRecord"
      :showAlertDetailsDialog.sync="showAlertDetailsDialog"
    />
    <LrAlertComments
      v-if="showAlertCommentsDialog"
      :id="selectedRecord.alert_uuid"
      :showAlertCommentsDialog.sync="showAlertCommentsDialog"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, PropSync } from "vue-property-decorator";
import LrDataTable from "../shared/LrDataTable/LrDataTable.vue";
import { lrAlertConst } from "./LrAlert.constant";
import { Api } from "../../services/Api";
import LrAlertDialog from "./LrAlertDialog.vue";
import LrAlertComments from "./LrAlertComments.vue";
import {
	LrDataTableFilterSortPag,
	PaginationModel,
} from "../shared/LrDataTable/LrDataTableFilterSortPag.model";
import { LrFilterObject } from "../shared/LrChips/LrFilterObject.model";

@Component({
	name: "LrAlert",
	components: { LrDataTable, LrAlertDialog, LrAlertComments },
})
export default class LrAlert extends Vue {
	@Prop({ required: false, default: "" }) private severity: string;
	@Prop({ required: false }) private alertId: string;
	alertConst: any = JSON.parse(JSON.stringify(lrAlertConst));
	alerts: any = [];
	showDataTable = false;
	chips: LrFilterObject[] = [];
	showAlertDetailsDialog = false;
	selectedRecord: any = null;
	showAlertCommentsDialog = false;

	mounted() {
		Api.getData("alerts/list", { isDummy: true }).then((resp: any) => {
			this.alerts = resp["list"];
		});
		if (this.alertId) {
			let headers = this.alertConst?.alertTable?.headers;
			let actionColumn = headers[headers?.length - 1];
			actionColumn.actionList = [];
			this.alertConst.alertTable.isMultiSelect = false;
			//   getMethod for selected alert
			this.showDataTable = true;
		} else {
			this.showDataTable = true;
		}
	}
	getColor(item: any) {
		return this.alertConst.severityList[item.severity];
	}

	updateRecord(tableDataConfig: LrDataTableFilterSortPag) {
		// code for API call
		this.chips = tableDataConfig.filterList;
	}

	openDetails(selectedRow: any) {
		if (this.alertId) {
			this.selectedRecord = null;
			this.selectedRecord = JSON.parse(JSON.stringify(selectedRow));
			this.selectedRecord.extended_info = JSON.parse(
				this.selectedRecord.extended_info
			);
			this.showAlertDetailsDialog = true;
		} else {
			this.$router.push({
				name: "alert-details",
				params: { alertId: selectedRow.alert_uuid },
			});
		}
	}

	comment(selectedRow: any) {
		this.selectedRecord = null;
		this.selectedRecord = JSON.parse(JSON.stringify(selectedRow));
		this.showAlertCommentsDialog = true;
	}
	multiAcknowledge(data: any) {
		//multi select action
	}
}
</script>
