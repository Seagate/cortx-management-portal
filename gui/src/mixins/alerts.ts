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
// mixin.js
import { Component, Vue } from "vue-property-decorator";
import { AlertQueryParam, AlertObject } from "../models/alert";
import { Api } from "../services/api";
import apiRegister from "../services/api-register";

@Component
export default class AlertsMixin extends Vue {
  public alertObject: AlertObject = {} as AlertObject;
  public constString: any = require("../common/const-string.json");
  public alertTableHeaders: any = [];
  public sortByHeader: any = {};
  public hidePagination: boolean = true;

  public async onSort(header: any) {
    if (header.sortable) {
      this.$store.commit("alerts/setSortInfo", header.value);
      this.onSortPaginate();
    }
  }

  // Column sort handler
  public async onSortPaginate() {
    const alertQueryParam: AlertQueryParam = {} as AlertQueryParam;

    switch (this.alertPageFilter) {
      case "new":
        alertQueryParam.acknowledged = false;
        alertQueryParam.resolved = false;
        break;
      case "active":
        alertQueryParam.show_active = true;
        break;
      case "history":
        alertQueryParam.acknowledged = true;
        alertQueryParam.resolved = true;
        alertQueryParam.show_all = true;
        break;
    }
    const sortInfo = this.$store.getters["alerts/getSortInfo"];
    alertQueryParam.sortby = sortInfo.header;
    alertQueryParam.dir = sortInfo.sort_dir;
    alertQueryParam.offset = this.currentPage;
    alertQueryParam.limit = this.itemsPerPage;

    this.$store.dispatch(
      "systemConfig/showLoader",
      "Fetching alerts..."
    );
    this.alertObject.alerts = [];
    this.alertObject.total_records = 0;
    const res = await Api.getAll(apiRegister.all_alerts, alertQueryParam);
    if (res && res.data) {
      this.alertObject = res.data;
      if (this.alertObject.total_records > 200) {
        this.hidePagination = false;
      }
    }
    this.$store.dispatch("systemConfig/hideLoader");
  }

  public async acknowledgeAll() {
    this.$store.dispatch("systemConfig/showLoaderMessage", {
      show: true,
      message: "Acknowledging alerts..."
    });
    const currentPageAlertIds: string[] = [];
    this.alertObject.alerts.forEach((alert: any) => {
      currentPageAlertIds.push(alert.alert_uuid);
    });
    try {
      await Api.patch(apiRegister.all_alerts, currentPageAlertIds);
      this.currentPage = this.currentPage > 1 ? this.currentPage-- : 1;
      await this.onSortPaginate();
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.log(e);
    }
    this.$store.dispatch("systemConfig/showLoaderMessage", {
      show: false,
      message: ""
    });
  }

  get currentPage() {
    return this.$store.getters["alerts/getCurrentPage"];
  }
  set currentPage(page: number) {
    this.$store.commit("alerts/setCurrentPage", page);
  }
  get itemsPerPage() {
    return this.$store.getters["alerts/getItemsPerPage"];
  }
  set itemsPerPage(items: number) {
    this.$store.commit("alerts/setItemsPerPage", items);
  }
  get alertPageFilter() {
    return this.$store.getters["alerts/getAlertPageFilter"];
  }
  set alertPageFilter(alertPageFilter: string) {
    this.$store.commit("alerts/setAlertPageFilter", alertPageFilter);
  }

}
