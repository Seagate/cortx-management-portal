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
        start_date: 0,
        end_date: 0
    };

    @Action
    public async downloadLogs(queryParams: AuditLogQueryParam) {
        queryParams = queryParams ? queryParams : this.queryParams;
        try {
            const res = await Api.getFile(apiRegister.auditlogs + "/download/"
                + queryParams.component.toLowerCase()
                + "?start_date=" + queryParams.start_date + "&end_date=" + queryParams.end_date + "");

            return res;
        } catch (e) {
            // tslint:disable-next-line: no-console
            console.log("err logger: ", e);
        }
    }
}
