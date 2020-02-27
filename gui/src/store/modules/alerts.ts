/*****************************************************************************
 Filename:          alerts.ts
 Description:       Alert Store Module

 Creation Date:     30/08/2019
 Author:            Sanjeevan Bhave

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
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
