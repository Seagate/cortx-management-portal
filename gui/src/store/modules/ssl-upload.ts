/*****************************************************************************
 Filename:          firmware.ts
 Description:       Upload firmware file to server/backend
 Creation Date:     06/02/2019
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

Vue.use(Vuex);

@Module({
    namespaced: true
})
export default class SSLupload extends VuexModule {
    public queryParams: FormData = new FormData();

    /**
     * @param queryParams {object},
     * This action for create user.
     */
    @Action
    public async uploadSSLCerificate(queryParams: FormData) {
        queryParams = queryParams ? queryParams : this.queryParams;
        try {
            const res = await Api.uploadFile(apiRegister.ssl_upload, queryParams);
        } catch (e) {
            // tslint:disable-next-line: no-console
            console.error("err logger: ", e);
        }
    }
    /**
     * This action for install ssl certifacate.
     */
    @Action
    public async installSSLCerificate(payload: any) {
        try {
          const res = Api.patch(apiRegister.ssl_upload, payload);
          return res;
        } catch (e) {
          // tslint:disable-next-line: no-console
          console.log(e);
        }
      }
}
