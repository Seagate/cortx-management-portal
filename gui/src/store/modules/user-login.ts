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
import {
  Module,
  VuexModule,
  Mutation,
  Action,
  MutationAction
} from "vuex-module-decorators";
import { UserLoginQueryParam } from "./../../models/user-login";
import { ACCESS_TOKEN, USERNAME } from "./../../common/consts";
Vue.use(Vuex);

@Module({
  namespaced: true
})
export default class UserLogin extends VuexModule {
  public user: any = {};
  public userPermissions: object = {};
  public unsupportedFeatures: any = {};

  public queryParams: UserLoginQueryParam = {
    username: "",
    password: ""
  };

  @Mutation
  public setUser(user: any) {
    this.user = user;
  }
  @Mutation
  public setUserPermissions(permissions: any) {
    this.userPermissions = permissions;
  }
  @Mutation
  public setUnsupportedFeatures(features: any) {
    this.unsupportedFeatures = features;
  }

  // Get user
  get getUser() {
    return this.user;
  }

  get getUserPermissions() {
    return this.userPermissions;
  }

  get getUnsupportedFeatures() {
    return this.unsupportedFeatures;
  }

  @Action({ rawError: true })
  public async createUserAction(queryParams: object) {
    queryParams = queryParams ? queryParams : this.queryParams;
    try {
      const res = await Api.post(apiRegister.create_user, queryParams);
      return res;
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error("err logger: ", e);
      if (e && e.data && e.data.message_text) {
        throw new Error(e.data.message_text);
      }
    }
  }

  @Action
  public async loginAction(queryParams: object) {
    queryParams = queryParams ? queryParams : this.queryParams;
    try {
      const res = await Api.post(apiRegister.login, queryParams);
      if (res && res.headers) {
        return res.headers;
      }
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error("err logger: ", e);
    }
  }

  @Action
  public async logoutAction() {
    try {
      await Api.post(apiRegister.logout, {});
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.log("err logger: ", e);
    }
    this.context.commit("setUserPermissions", {});
    this.context.commit("setUnsupportedFeatures", {});
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(USERNAME);
  }
  @Action({ rawError: true })
  public async getUserPermissionsAction() {
    try {
      if (
        this.userPermissions &&
        !Object.entries(this.userPermissions).length
      ) {
        const res = await Api.getAll(apiRegister.user_permissions);
        if (res && res.data && res.data.permissions) {
          this.context.commit("setUserPermissions", res.data.permissions);
          return res.data.permissions;
        }
      } else {
        return true;
      }
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error("err logger: ", e);
      throw new Error(e.message);
    }
  }

  @Action({ rawError: true })
  public async getUnsupportedFeaturesAction() {
    if (this.unsupportedFeatures && !Object.entries(this.unsupportedFeatures).length) {
      const features = await Api.getAll(apiRegister.unsupported_features);
      if (features && features.data && features.data.unsupported_features) {
        const featuresMap = features.data.unsupported_features.reduce((result: any, item: string) => {
          result[item] = true;
          return result;
        }, {});
        this.context.commit("setUnsupportedFeatures", featuresMap);
      }
    }

    return this.unsupportedFeatures;
  }

  @Action
  public async addLicenseKey(queryParams: object) {
    try {
      const res = await Api.post(apiRegister.addlicensekey, queryParams);
      return res;
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error("err logger: ", e);
      return e;
    }
  }
}
