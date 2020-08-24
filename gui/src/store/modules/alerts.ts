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
import Vue from "vue";
import Vuex from "vuex";
import {
  Module,
  VuexModule,
  Mutation
} from "vuex-module-decorators";

Vue.use(Vuex);

@Module({
  namespaced: true
})
export default class Alerts extends VuexModule {
  public alert_page_filter: string = "new";
  public items_per_page: number = 200;
  public current_page: number = 1;
  public sort_info: any = {
    header: "created_time",
    sort_dir: "desc"
  };

  @Mutation
  public setAlertPageFilter(alert_page_filter: string) {
    this.alert_page_filter = alert_page_filter;
  }

  get getAlertPageFilter() {
    return this.alert_page_filter;
  }

  @Mutation
  public setItemsPerPage(items_per_page: number) {
    this.items_per_page = items_per_page;
  }

  get getItemsPerPage() {
    return this.items_per_page;
  }

  @Mutation
  public setCurrentPage(current_page: number) {
    this.current_page = current_page;
  }

  get getCurrentPage() {
    return this.current_page;
  }

  @Mutation
  public setSortInfo(header: string) {
    if (this.sort_info.header === header) {
      this.sort_info.sort_dir = this.sort_info.sort_dir === "asc" ? "desc" : "asc";
    } else {
      this.sort_info.header = header;
      this.sort_info.sort_dir = "asc";
    }
  }

  get getSortInfo() {
    return this.sort_info;
  }

  @Mutation
  public resetAlertQueryParams() {
    this.items_per_page = 200;
    this.current_page = 1;
    this.sort_info = {
      header: "created_time",
      sort_dir: "desc"
    };
  }

}
