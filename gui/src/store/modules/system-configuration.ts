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
import CommonUtils from "../../common/common-utils";
import {
  Module,
  VuexModule,
  Mutation,
  Action,
  MutationAction
} from "vuex-module-decorators";
import {
  SystemConfigObject,
  ManagementNetworkSettings,
  DataNetworkSettings,
  DnsNetworkSettings,
  DateTimeSettings,
  Notifications,
  WizardMetadata
} from "./../../models/system-configuration";
import { wizardConfig } from "./../../models/system-config-wizard";
const { findStepIndexFromComponentName } = CommonUtils;
Vue.use(Vuex);
@Module({
  namespaced: true
})
export default class SystemConfiguration extends VuexModule {
  public systemConfigDetails: SystemConfigObject = {} as SystemConfigObject;
  public wizardMetadata: WizardMetadata = wizardConfig as WizardMetadata;
  public isipV4: boolean = false;
  public isipV6: boolean = false;
  public isnetworkSettingsSkip: boolean = false;
  public isDataipV4: boolean = false;
  public isDataipV6: boolean = false;
  public isDataNetworkSettingsSkip: boolean = false;
  public loaderShow: boolean = false;
  public loaderMessage: string = "";
  public notifications: Notifications = {} as Notifications;
  public isLocalUser: boolean = false;
  public isLdapUser: boolean = false;
  public isUserSettingSkip: boolean = false;
  public isEmailSettings: boolean = false;
  public isSysLogSettings: boolean = false;
  public isNotificationSettingSkip: boolean = false;
  public componentNameToSearch: string = "";
  public isOnboardingShow: boolean = false;

  @Mutation
  public setOnboardingFlag(flag: boolean) {
    this.isOnboardingShow = flag;
  }
  get onboardingStatus() {
    return this.isOnboardingShow;
  }
  @Mutation
  public userConfigLdapMutation(payload: any) {
    this.systemConfigDetails.ldap = { ...payload };
  }
  @Mutation
  public userConfigApplianceMutation(payload: any) {
    this.systemConfigDetails.appliance_name = payload;
  }
  @Mutation
  public userConfigEmailNotificaionMutation(payload: any) {
    if (!this.systemConfigDetails.notifications) {
      this.systemConfigDetails.notifications = {} as Notifications;
    }
    this.systemConfigDetails.notifications.email = { ...payload };
  }

  @Mutation
  public userConfigSysLogNotificaionMutation(payload: any) {
    if (!this.systemConfigDetails.notifications) {
      this.systemConfigDetails.notifications = {} as Notifications;
    }
    this.systemConfigDetails.notifications.syslog = { ...payload };
  }

  @Mutation
  public setNotificationsType(notificationType: any) {
    if (notificationType.type === "email") {
      this.isEmailSettings = notificationType.flag;
      this.componentNameToSearch = "CortxNotificationsEmail";
    }
    if (notificationType.type === "syslog") {
      this.isSysLogSettings = notificationType.flag;
      this.componentNameToSearch = "CortxNotificationsSyslog";
    }
    if (notificationType.type === "skip") {
      this.isNotificationSettingSkip = notificationType.flag;
    }
    const stepIndex = findStepIndexFromComponentName(
      this.componentNameToSearch,
      this.wizardMetadata
    );
    if (stepIndex !== undefined || stepIndex !== -1) {
      this.wizardMetadata.steps[stepIndex].isByPassed = !notificationType.flag;
    }
  }

  @Mutation
  public setUser(userType: any) {
    if (userType.type === "local") {
      this.componentNameToSearch = "CortxUserSettingLocal";
      this.isLocalUser = userType.flag;
    }
    if (userType.type === "ldap") {
      this.componentNameToSearch = "CortxUserSettingLdap";
      this.isLdapUser = userType.flag;
    }
    if (userType.type === "skip") {
      this.isUserSettingSkip = userType.flag;
    }
    const stepIndex = findStepIndexFromComponentName(
      this.componentNameToSearch,
      this.wizardMetadata
    );
    if (stepIndex !== undefined || stepIndex !== -1) {
      this.wizardMetadata.steps[stepIndex].isByPassed = !userType.flag;
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
      const res = await Api.put(
        apiRegister.sysconfig,
        this.systemConfigDetails,
        this.systemConfigDetails.config_id
      );
      if (res && res.data) {
        const data = res.data;
        this.context.commit("systemConfigMutation", data);
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
  public async updateApplianceConfig(payload: any) {
    try {
      this.context.commit("userConfigApplianceMutation", payload);
      const res = await Api.put(
        apiRegister.sysconfig,
        this.systemConfigDetails,
        this.systemConfigDetails.config_id
      );
      if (res && res.data) {
        const data = res.data;
        this.context.commit("systemConfigMutation", data);
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
      const res = await Api.put(
        apiRegister.sysconfig,
        this.systemConfigDetails,
        this.systemConfigDetails.config_id
      );
      if (res && res.data) {
        const data = res.data;
        this.context.commit("systemConfigMutation", data);
        return res;
      }
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.log(e);
    }
  }
  /**
   * @param queryParams {object},
   * This action for checking email notification.
   */
  @Action
  public async sendTestEmailNotification(payload: any) {
    try {
      const res = await Api.post(apiRegister.send_test_email, payload);
      if (res && res.data) {
        const data = res.data;
        return data;
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
      const res = await Api.put(
        apiRegister.sysconfig,
        this.systemConfigDetails,
        this.systemConfigDetails.config_id
      );
      if (res && res.data) {
        const data = res.data;
        this.context.commit("systemConfigMutation", data);
        return res;
      }
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.log(e);
    }
  }
  @Mutation
  public systemConfigMutation(payload: any) {
    this.systemConfigDetails = { ...payload };
  }
  @Mutation
  public MngmtIpv4ConfigMutation(payload: any) {
    if (!this.systemConfigDetails.management_network_settings) {
      this.systemConfigDetails.management_network_settings = {} as ManagementNetworkSettings;
    }
    this.systemConfigDetails.management_network_settings.ipv4 = { ...payload };
  }

  @Mutation
  public MngmtIpv6ConfigMutation(payload: any) {
    if (!this.systemConfigDetails.management_network_settings) {
      this.systemConfigDetails.management_network_settings = {} as ManagementNetworkSettings;
    }
    this.systemConfigDetails.management_network_settings.ipv6 = { ...payload };
  }
  // data n/w4
  @Mutation
  public DataNetworkSettingIpv4Mutation(payload: any) {
    if (!this.systemConfigDetails.data_network_settings) {
      this.systemConfigDetails.data_network_settings = {} as DataNetworkSettings;
    }
    this.systemConfigDetails.data_network_settings.ipv4 = { ...payload };
  }
  // data n/w6
  @Mutation
  public DataNetworkSettingIpv6Mutation(payload: any) {
    if (!this.systemConfigDetails.data_network_settings) {
      this.systemConfigDetails.data_network_settings = {} as DataNetworkSettings;
    }
    this.systemConfigDetails.data_network_settings.ipv6 = { ...payload };
  }
  // DNS
  @Mutation
  public updateDNSSettingMutation(payload: any) {
    if (!this.systemConfigDetails.dns_network_settings) {
      this.systemConfigDetails.dns_network_settings = {} as DnsNetworkSettings;
    }
    this.systemConfigDetails.dns_network_settings = { ...payload };
  }
  // NTP Mutation
  @Mutation
  public updateNTPSettingMutation(payload: any) {
    if (!this.systemConfigDetails.date_time_settings) {
      this.systemConfigDetails.date_time_settings = {} as DateTimeSettings;
    }
    this.systemConfigDetails.date_time_settings = { ...payload };
  }

  @Mutation
  public setNetworkManagementSettings(networkType: any) {
    if (networkType.type === "ipV4") {
      this.isipV4 = networkType.flag;
      this.componentNameToSearch = "CortxNetworkSettingsIpv4";
    }
    if (networkType.type === "ipV6") {
      this.isipV6 = networkType.flag;
      this.componentNameToSearch = "CortxNetworkSettingsIpv6";
    }
    const stepIndex = findStepIndexFromComponentName(
      this.componentNameToSearch,
      this.wizardMetadata
    );
    if (stepIndex !== undefined || stepIndex !== -1) {
      this.wizardMetadata.steps[stepIndex].isByPassed = !networkType.flag;
    }
  }

  @Mutation
  public setWizardMetadata(payload: any) {
    this.wizardMetadata = payload;
  }

  @Mutation
  public setWizardCurrentComponent(payload: any) {
    this.wizardMetadata.currentComponent = payload;
  }
  @Mutation
  public setDataNetworkSettings(networkType: any) {
    if (networkType.type === "ipV4") {
      this.isDataipV4 = networkType.flag;
      this.componentNameToSearch = "CortxDataNetworkIpv4";
    }
    if (networkType.type === "ipV6") {
      this.isDataipV6 = networkType.flag;
      this.componentNameToSearch = "CortxDataNetworkIpv6";
    }
    const stepIndex = findStepIndexFromComponentName(
      this.componentNameToSearch,
      this.wizardMetadata
    );
    if (stepIndex !== undefined || stepIndex !== -1) {
      this.wizardMetadata.steps[stepIndex].isByPassed = !networkType.flag;
    }
  }
  @Action
  public async getSystemConfigAction() {
    try {
      const res = await Api.getAll(apiRegister.sysconfig);
      let data = {};
      if (res && res.data && Array.isArray(res.data)) {
        const defaultConfig = res.data[0];
        if (defaultConfig && defaultConfig.is_summary) {
          defaultConfig.is_summary = false;
        }
        data = defaultConfig;
        this.context.commit("systemConfigMutation", data);
        return data;
      }
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.error(error);
    }
  }
  @Action
  public async createManagementNetworkObj() {
    try {
      // Create blank object for the first time.
      const sysConfig = this.systemConfigDetails;
      if (!sysConfig || !sysConfig.config_id) {
        const res = await Api.post(
          apiRegister.sysconfig,
          this.systemConfigDetails
        );
        if (res && res.data) {
          this.context.commit("systemConfigMutation", res.data);
          return res.data;
        }
      }
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error(e);
    }
  }
  @Action
  public async updateMngmtIpv4(payload: any) {
    try {
      this.context.commit("MngmtIpv4ConfigMutation", payload);
      const res = await Api.put(
        apiRegister.sysconfig,
        this.systemConfigDetails,
        this.systemConfigDetails.config_id
      );
      return res;
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error(e);
    }
  }
  @Action
  public async updateMngmtIpv6(payload: any) {
    try {
      this.context.commit("MngmtIpv6ConfigMutation", payload);
      const res = await Api.put(
        apiRegister.sysconfig,
        this.systemConfigDetails,
        this.systemConfigDetails.config_id
      );
      return res;
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error(e);
    }
  }
  // data n/w4
  @Action
  public async updateDataNetworkSettingIpv4(payload: any) {
    try {
      this.context.commit("DataNetworkSettingIpv4Mutation", payload);
      const res = await Api.put(
        apiRegister.sysconfig,
        this.systemConfigDetails,
        this.systemConfigDetails.config_id
      );
      return res;
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error(e);
    }
  }
  // data n/w6
  @Action
  public async updateDataNetworkSettingIpv6(payload: any) {
    try {
      this.context.commit("DataNetworkSettingIpv6Mutation", payload);
      const res = await Api.put(
        apiRegister.sysconfig,
        this.systemConfigDetails,
        this.systemConfigDetails.config_id
      );
      return res;
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error(e);
    }
  }
  // DNSAction
  @Action
  public async updateDNSSetting(payload: any) {
    try {
      this.context.commit("updateDNSSettingMutation", payload);
      const res = await Api.put(
        apiRegister.sysconfig,
        this.systemConfigDetails,
        this.systemConfigDetails.config_id
      );
      return res;
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error(e);
    }
  }
  // NTP setting
  @Action
  public async updateNTPSetting(payload: any) {
    try {
      this.context.commit("updateNTPSettingMutation", payload);
      const res = await Api.put(
        apiRegister.sysconfig,
        this.systemConfigDetails,
        this.systemConfigDetails.config_id,
        { timeout: -1 }
      );
      return res;
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error(e);
    }
  }
  // Summary setting
  @Action
  public async updateSummary(payload: any) {
    try {
      const res = await Api.put(
        apiRegister.sysconfig,
        { ...this.systemConfigDetails, is_summary: payload },
        this.systemConfigDetails.config_id,
        { timeout: -1 }
      );
      return res;
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error(e);
    }
  }
  // Wizard Update
  @Action
  public async updateWizardMetadata(payload: any) {
    try {
      this.context.commit("setWizardMetadata", payload);
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error(e);
    }
  }

  // Get system configuration from store
  get userConfigData() {
    return this.systemConfigDetails;
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
  get systemconfig() {
    return this.systemConfigDetails;
  }
  get isipV4Status() {
    return this.isipV4;
  }
  get isipV6Status() {
    return this.isipV6;
  }
  // Data network settings getter
  get isDataipV4Status() {
    return this.isDataipV4;
  }
  get isDataipV6Status() {
    return this.isDataipV6;
  }
  get wizardMetadataObject() {
    return this.wizardMetadata;
  }

  // Loader Config
  @Mutation
  public loaderConfigMutation(loaderData: any) {
    this.loaderShow = loaderData.show;
    this.loaderMessage = loaderData.message;
  }
  @Action
  public async showLoaderMessage(loaderData: any) {
    this.context.commit("loaderConfigMutation", loaderData);
  }
  @Action
  public async showLoader(message: string) {
    this.context.commit("loaderConfigMutation", {
      show: true,
      message
    });
  }

  @Action
  public async hideLoader() {
    this.context.commit("loaderConfigMutation", {
      show: false,
      message: ""
    });
  }
  get showLoaderStatus() {
    return this.loaderShow;
  }
  get loaderMessageText() {
    return this.loaderMessage;
  }
}
