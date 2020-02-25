/*****************************************************************************
 Filename:          maintenance.ts
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
import {
  Module,
  VuexModule,
  Mutation,
  Action,
  MutationAction
} from "vuex-module-decorators";
Vue.use(Vuex);

@Module({
  namespaced: true
})
export default class Maintenance extends VuexModule {
  @Action
  public async getNodeStatus(queryParams: object) {
    try {
      const res = await Api.getAll(apiRegister.node_status, queryParams);
      if (res) {
        return res.data;
      }
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error("err logger: ", e);
    }
  }
  @Action
  public async stopNode(queryParams: object) {
    try {
      const res = await Api.getAll(apiRegister.node_stop, queryParams);
      if (res) {
        return res.data;
      }
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error("err logger: ", e);
    }
  }
  @Action
  public async startNode(queryParams: object) {
    try {
      const res = await Api.getAll(apiRegister.node_start, queryParams);
      if (res) {
        return res.data;
      }
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error("err logger: ", e);
    }
  }
  @Action
  public async shutdownNode(queryParams: object) {
    try {
      const res = await Api.getAll(apiRegister.node_shutdown, queryParams);
      if (res) {
        return res.data;
      }
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error("err logger: ", e);
    }
  }
}
