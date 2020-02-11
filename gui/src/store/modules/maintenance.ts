/*****************************************************************************
 Filename:          manintenance.ts
 Description:       main Store Module
 Creation Date:     27/11/2019
 Author:            Jayshree More

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
Vue.use(Vuex);

@Module({
    namespaced: true
})
export default class Manintenance extends VuexModule {
    /**
     * @param queryParams {object},
     *
     */
    @Action
    public async maintenanceAction(queryParams: object) {
        try {
            const res = await Api.post(apiRegister.maintenance, queryParams);
        } catch (e) {
            // tslint:disable-next-line: no-console
            console.error("err logger: ", e);
        }
    }
    
}
