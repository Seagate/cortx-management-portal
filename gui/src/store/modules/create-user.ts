/*****************************************************************************
 Filename:          create-user.ts
 Description:       Create Csm local user Store Module

 Creation Date:     25/11/2019
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
import {
  Module,
  VuexModule,
  Mutation,
  Action,
  MutationAction
} from "vuex-module-decorators";
import { UserDetails, UserDetailsObject } from "./../../models/user-Details";

Vue.use(Vuex);

@Module({
  namespaced: true
})
export default class UserCreate extends VuexModule {
  public userDataDetails: UserDetailsObject | null = null;

  public queryParams: UserDetails = {
    username: "",
    password: "",
    interfaces: [],
    roles: [],
    temperature: "",
    language: "",
    timeout: 0
  };

  @Action
  public async getDataAction() {
    try {
      const res = await Api.getAll(apiRegister.create_csmuser);
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
  public async createCSMUserAction(queryParams: object) {
    queryParams = queryParams ? queryParams : this.queryParams;
    try {
      const res = await Api.post(apiRegister.create_csmuser, queryParams);
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error("err logger: ", e);
    }
  }
  /**
   * This action for delete user
   */
  @Action
  public async deleteUserAction(id: string) {
    try {
      const res = await Api.delete(apiRegister.create_csmuser, id);
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error("err logger: ", e);
    }
  }
  @Action
  public async updateUserDetails(payload: any) {
    try {
      const res = Api.put(apiRegister.create_csmuser, payload, payload.id);
      return res;
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.log(e);
    }
  }
}
