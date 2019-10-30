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
import { Api } from "./../../services/api";
import apiRegister from "./../../services/api-register";
import { Module, VuexModule, Mutation, Action, MutationAction } from "vuex-module-decorators";
import { AlertObject, AlertQueryParam } from "./../../models/alert";

Vue.use(Vuex);

@Module({
    namespaced: true
})
export default class Alerts extends VuexModule {
    public alerts: AlertObject | null = null;
    public header: object | null = null;
    public isOnboardingDone: boolean = false;
    public queryParams: AlertQueryParam = {
        sortBy: "created_time",
        dir: "desc",
        offset: 1,
        limit: 5
    };
    public currentPage: number = 1;
    public recordsPerPage: number = 5;

    @Mutation
    public alertDataMutation(payload: AlertObject) {
        this.alerts = { ...payload };
    }

    @Mutation
    public setOnboardingFlag(flag: boolean) {
        this.isOnboardingDone = flag;
    }
    get onboardingStatus() {
        return this.isOnboardingDone;
    }

    @Mutation
    public setPage(page: number) {
        this.currentPage = page;
    }
    get page() {
        return this.currentPage;
    }

    // set items per page
    @Mutation
    public setItemsPerPage(noOfRecords: number) {
        this.recordsPerPage = noOfRecords;
    }

    // Get items per page
    get itemsPerPage() {
        return this.recordsPerPage;
    }

    @Action
    public async alertDataAction(queryParams: object) {
        queryParams = queryParams ? queryParams : this.queryParams;
        try {
            const res = await Api.getAll(apiRegister.all_alerts, queryParams);
            const data = res.data;
            this.context.commit("alertDataMutation", data);
        } catch (e) {
            // tslint:disable-next-line: no-console
            console.log("err logger: ", e);
        }
    }

    @Action
    public async updateAlert(payload: any): Promise<any | undefined> {
        try {
            const res = Api.patch(apiRegister.all_alerts,
                { acknowledged: payload.acknowledged, comment: payload.comment },
                payload.alert_uuid);
            return res;
        } catch (e) {
            // tslint:disable-next-line: no-console
            console.log(e);
        }
    }

    get alertTotalRecordCount() {
        if (this.alerts) {
            return this.alerts.total_records;
        }

        return;
    }

    get alertData() {
        if (this.alerts) {
            return this.alerts.alerts;
        }

        return;
    }


    // Set headers for alert table
    @Mutation
    public alertHeaderMutation(headerObj: object) {
        this.header = headerObj;
    }

    // Get alert headers
    get alertHeader() {
        return this.header;
    }

    // Set query params for Alert Table
    @Mutation
    public alertQueryParamMutation({ ...queryParams }) {
        this.queryParams.sortBy = queryParams.sortBy;
        this.queryParams.dir = queryParams.dir;
        this.queryParams.offset = queryParams.offset;
        this.queryParams.limit = queryParams.limit;
    }
    // Get Alert Query Parameter
    get alertQueryParams(): AlertQueryParam {
        return this.queryParams;
    }
}
