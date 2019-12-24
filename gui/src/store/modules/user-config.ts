/*****************************************************************************
 Filename:          user-config.ts
 Description:       Gets and sets user config

 Creation Date:     12/12/2019
 Author:            Soniya Moholkar

 Do NOT modify or remove this copyright and confidentiality notice!
 Copyright (c) 2001 - $Date: 2015/01/14 $ Seagate Technology, LLC.
 The code contained herein is CONFIDENTIAL to Seagate Technology, LLC.
 Portions are also trade secret. Any use, duplication, derivation, distribution
 or disclosure of this code, for any reason, not expressly authorized is
 prohibited. All other rights are expressly reserved by Seagate Technology, LLC.
 *****************************************************************************/
import Vue from "vue";
import Vuex from "vuex";
import { Api } from "../../services/api";
import apiRegister from "../../services/api-register";
import { Module, VuexModule, Mutation, Action, MutationAction } from "vuex-module-decorators";
import { UserConfigObject, Notifications } from "../../models/user-config";
Vue.use(Vuex);

@Module({
  namespaced: true
})
export default class UserConfig extends VuexModule {
  public userConfigDetails: UserConfigObject = {} as UserConfigObject;
  public notifications: Notifications = {} as Notifications;
  public isLocalUser: boolean = false;
  public isLdapUser: boolean = false;
  public isUserSettingSkip: boolean = false;
  public isEmailSettings: boolean = false;
  public isSysLogSettings: boolean = false;
  public isNotificationSettingSkip: boolean = false;

  @Mutation
  public userConfigLdapMutation(payload: any) {
    this.userConfigDetails.ldap = { ...payload };
  }

  @Mutation
  public userConfigEmailNotificaionMutation(payload: any) {
    if (!this.userConfigDetails.notifications) {
      this.userConfigDetails.notifications = {} as Notifications;
    }
    this.userConfigDetails.notifications.email = { ...payload };
  }

  @Mutation
  public userConfigSysLogNotificaionMutation(payload: any) {
    if (!this.userConfigDetails.notifications) {
      this.userConfigDetails.notifications = {} as Notifications;
    }
    this.userConfigDetails.notifications.syslog = { ...payload };
  }

  @Mutation
  public userConfigMutation(payload: any) {
    this.userConfigDetails = { ...payload };
  }

  @Mutation
  public setNotificationsType(notificationType: any) {
    if (notificationType.type === "email") {
      this.isEmailSettings = notificationType.flag;
    }
    if (notificationType.type === "syslog") {
      this.isSysLogSettings = notificationType.flag;
    }
    if (notificationType.type === "skip") {
      this.isNotificationSettingSkip = notificationType.flag;
    }
  }

  @Mutation
  public setUser(userType: any) {
    if (userType.type === "local") {
      this.isLocalUser = userType.flag;
    }
    if (userType.type === "ldap") {
      this.isLdapUser = userType.flag;
    }
    if (userType.type === "skip") {
      this.isUserSettingSkip = userType.flag;
    }
  }

  @Action
  public async getDataAction() {
    try {
      const res = await Api.getAll(apiRegister.user_config);
      let data = {};
      if (res && res.data && Array.isArray(res.data)) {
        data = res.data[0];
      }
      this.context.commit("userConfigMutation", data);
      return data;
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.log("err logger: ", e);
    }
  }
  /**
   * @param queryParams {object},
   * This action for create user config.
   */
  @Action
  public async createUserConfig(queryParams: object) {
    try {
      const userConfig = this.userConfigDetails;
      if (!userConfig || !userConfig.user_config_id) {
        const res = await Api.post(apiRegister.user_config, queryParams);
        if (res && res.data) {
          const data = res.data;
          this.context.commit("userConfigMutation", data);
          return res;
        }
      }
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error("err logger: ", e);
    }
  }

  /**
   * @param queryParams {object},
   * This action for update user config.
   */
  @Action
  public async updateLdapUserConfig(payload: any) {
    try {
      this.context.commit("userConfigLdapMutation", payload);
      const res = await Api.put(apiRegister.user_config, this.userConfigDetails, this.userConfigDetails.user_config_id);
      if (res && res.data) {
        const data = res.data;
        this.context.commit("userConfigMutation", data);
        return res;
      }
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.log(e);
    }
  }

  /**
   * @param queryParams {object},
   * This action for update user config.
   */
  @Action
  public async updateEmailNotificationUserConfig(payload: any) {
    try {
      this.context.commit("userConfigEmailNotificaionMutation", payload);
      const res = await Api.put(apiRegister.user_config, this.userConfigDetails, this.userConfigDetails.user_config_id);
      if (res && res.data) {
        const data = res.data;
        this.context.commit("userConfigMutation", data);
        return res;
      }
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.log(e);
    }
  }

  /**
   * @param queryParams {object},
   * This action for update user config.
   */
  @Action
  public async updateSyslogNotificationUserConfig(payload: any) {
    try {
      this.context.commit("userConfigSysLogNotificaionMutation", payload);
      const res = await Api.put(apiRegister.user_config, this.userConfigDetails, this.userConfigDetails.user_config_id);
      if (res && res.data) {
        const data = res.data;
        this.context.commit("userConfigMutation", data);
        return res;
      }
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.log(e);
    }
  }
  // Get system configuration from store
  get userConfigData() {
    return this.userConfigDetails;
  }
  get isLocalUserStatus() {
    return this.isLocalUser;
  }
  get isLdapUserStatus() {
    return this.isLdapUser;
  }
  get isUserSettingSkipStatus() {
    return this.isUserSettingSkip;
  }
  get isEmailSettingsStatus() {
    return this.isEmailSettings;
  }
  get isSysLogSettingsStatus() {
    return this.isSysLogSettings;
  }
  get isNotificationSettingSkipStatus() {
    return this.isNotificationSettingSkip;
  }
}
