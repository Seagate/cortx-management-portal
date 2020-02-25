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
import { AuditLogQueryParam } from "../../models/download";

Vue.use(Vuex);

@Module({
    namespaced: true
})
export default class Download extends VuexModule {
    public queryParams: AuditLogQueryParam = {
        component: "CSM",
        timerange: "1d",
        from: "",
        to: ""

    };

    @Action
    public async downloadLogs(queryParams: AuditLogQueryParam) {
        queryParams = queryParams ? queryParams : this.queryParams;
        try {
            const res = await Api.getFile(apiRegister.auditlogs + "/download/"
                + queryParams.component.toLowerCase()
                + "?start_date=" + queryParams.from + "&end_date=" + queryParams.to + "");

            return res;
        } catch (e) {
            // tslint:disable-next-line: no-console
            console.log("err logger: ", e);
        }
    }
    @Action
    public async showAuditLogs(queryParams: AuditLogQueryParam) {
        queryParams = queryParams ? queryParams : this.queryParams;

        try {
            const res = await Api.getAll(apiRegister.auditlogs + "/show/"
                + queryParams.component.toLowerCase()
                + "?start_date=" + queryParams.from + "&end_date=" + queryParams.to + "");

            return res;
        } catch (e) {
            // tslint:disable-next-line: no-console
            console.log("err logger: ", e);
        }
    }
}
