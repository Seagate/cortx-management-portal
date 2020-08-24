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
