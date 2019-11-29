/*****************************************************************************
 Filename:          s3-bucket.ts
 Description:       Create Bucket creation Store Module
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
import { Buckets, BucketDetailsObject } from "./../../models/s3Buckets";
Vue.use(Vuex);

@Module({
    namespaced: true
})
export default class BucketCreate extends VuexModule {
    public userDataDetails: BucketDetailsObject | null = null;

    public queryParams: Buckets = {
        bucket_name: "",
    };
    @Action
    public async getDataAction() {
        try {
            const res = await Api.getAll(apiRegister.s3_bucket);
            const data = res.data;
            return data;
        } catch (e) {
            // tslint:disable-next-line: no-console
            console.log("err logger: ", e);
        }
    }
    /**
     * @param queryParams {object},
     * This action for create user.
     */
    @Action
    public async createBucketListAction(queryParams: object) {
        queryParams = queryParams ? queryParams : this.queryParams;
        try {
            const res = await Api.post(apiRegister.s3_bucket, queryParams);
        } catch (e) {
            // tslint:disable-next-line: no-console
            console.error("err logger: ", e);
        }
    }
    /**
     * This action for delete user
     */
    @Action
    public async deleteBucketListAction(name: string) {
        try {
            const res = await Api.delete(apiRegister.s3_bucket, name);
        } catch (e) {
            // tslint:disable-next-line: no-console
            console.error("err logger: ", e);
        }
    }
}
