/*****************************************************************************
 Filename:          user-login.ts
 Description:       Create Root User and Login Store Module

 Creation Date:     08/11/2019
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
import { UserLoginQueryParam } from "./../../models/user-login";

Vue.use(Vuex);

@Module({
    namespaced: true
})
export default class UserLogin extends VuexModule {
    public queryParams: UserLoginQueryParam = {
        username: "",
        password: ""
    };

    @Action
    public async createUserAction(queryParams: object) {
        queryParams = queryParams ? queryParams : this.queryParams;
        try {
            const res = await Api.post(apiRegister.create_user, queryParams);
            return res;
        } catch (e) {
            // tslint:disable-next-line: no-console
            console.error("err logger: ", e);
        }
    }

    @Action
    public async loginAction(queryParams: object) {
        queryParams = queryParams ? queryParams : this.queryParams;
        try {
            const res = await Api.post(apiRegister.login, queryParams);
            return res.headers;
        } catch (e) {
            // tslint:disable-next-line: no-console
            console.error("err logger: ", e);
        }
    }

    @Action
    public async logoutAction(queryParams: object) {
        queryParams = queryParams ? queryParams : this.queryParams;
        try {
            const res = await Api.post(apiRegister.logout, queryParams);
            return res.status;
        } catch (e) {
            // tslint:disable-next-line: no-console
            console.log("err logger: ", e);
        }
    }
}
