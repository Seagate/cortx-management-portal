/*****************************************************************************
 Filename:          system-configuration.ts
 Description:       System Configuration Store Module

 Creation Date:     26/09/2019
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
import { SystemConfigObject, ManagementNetworkSettings, DataNetworkSettings, DnsNetworkSettings, DateTimeSettings } from "./../../models/system-configuration";

Vue.use(Vuex);

@Module({
    namespaced: true
})
export default class SystemConfiguration extends VuexModule {
    public systemConfigDetails: SystemConfigObject = {} as SystemConfigObject;
    public isipV4: boolean = false;
    public isipV6: boolean = false;
    public isnetworkSettingsSkip: boolean = false;
    public showLoader: boolean = false;
    public loaderMessage: string = "";

    @Mutation
    public systemConfigMutation(payload: any) {
        this.systemConfigDetails = { ...payload };
    }
    @Mutation
    public MngmtIpv4ConfigMutation(payload: any) {
        if (!this.systemConfigDetails.management_network_settings) {
            this.systemConfigDetails.management_network_settings = {} as ManagementNetworkSettings
        }
        this.systemConfigDetails.management_network_settings.ipv4 =
            { ...payload }
    }

    @Mutation
    public MngmtIpv6ConfigMutation(payload: any) {
        if (!this.systemConfigDetails.management_network_settings) {
            this.systemConfigDetails.management_network_settings = {} as ManagementNetworkSettings
        }
        this.systemConfigDetails.management_network_settings.ipv6 =
            { ...payload }
    }
    // data n/w4
    @Mutation
    public DataNetworkSettingIpv4Mutation(payload: any) {
        if (!this.systemConfigDetails.data_network_settings) {
            this.systemConfigDetails.data_network_settings = {} as DataNetworkSettings
        }
        this.systemConfigDetails.data_network_settings.ipv4 =
            { ...payload }
    }
    // data n/w6
    @Mutation
    public DataNetworkSettingIpv6Mutation(payload: any) {
        if (!this.systemConfigDetails.data_network_settings) {
            this.systemConfigDetails.data_network_settings = {} as DataNetworkSettings
        }
        this.systemConfigDetails.data_network_settings.ipv6 =
            { ...payload }
    }
    // DNS
    @Mutation
    updateDNSSettingMutation(payload: any) {
        if (!this.systemConfigDetails.dns_network_settings) {
            this.systemConfigDetails.dns_network_settings = {} as DnsNetworkSettings
        }
        this.systemConfigDetails.dns_network_settings =
            { ...payload }

    }
    //NTP Mutation 
    @Mutation
    updateNTPSettingMutation(payload: any) {
        if (!this.systemConfigDetails.date_time_settings) {
            this.systemConfigDetails.date_time_settings = {} as DateTimeSettings
        }
        this.systemConfigDetails.date_time_settings =
            { ...payload }

    }

    @Mutation
    public setNetworkManagementSettings(networkType: any) {
        if (networkType.type === "ipV4") {
            this.isipV4 = networkType.flag;
        }
        if (networkType.type === "ipV6") {
            this.isipV6 = networkType.flag;
        }
    }

    @Action
    public async getSystemConfigAction() {
        try {
            const res = await Api.getAll(apiRegister.sysconfig);
            let data = {};
            if (res.data && Array.isArray(res.data)) {
                data = res.data[0];
            }
            this.context.commit("systemConfigMutation", data);
            return data;
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
                const res = await Api.post(apiRegister.sysconfig, this.systemConfigDetails);
                const data = res.data;
                this.context.commit("systemConfigMutation", data);
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
            const res = await Api.put(apiRegister.sysconfig, this.systemConfigDetails, this.systemConfigDetails.config_id);
            return res;
        } catch (e) {
            // tslint:disable-next-line: no-console
            console.error(e);
        }
    }
    @Action
    public async updateMngmtIpv6(payload: any) {
        try {
            console.log("TCL: SystemConfiguration -> payload", payload)
            this.context.commit("MngmtIpv6ConfigMutation", payload);
            const res = await Api.put(apiRegister.sysconfig, this.systemConfigDetails, this.systemConfigDetails.config_id);
            return res;
        } catch (e) {
            // tslint:disable-next-line: no-console
            console.error(e);
        }
    }
    //datan/w4
    @Action
    public async updateDataNetworkSettingIpv4(payload: any) {
        try {
            this.context.commit("DataNetworkSettingIpv4Mutation", payload);
            const res = await Api.put(apiRegister.sysconfig, this.systemConfigDetails, this.systemConfigDetails.config_id);
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
            const res = await Api.put(apiRegister.sysconfig, this.systemConfigDetails, this.systemConfigDetails.config_id);
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
            const res = await Api.put(apiRegister.sysconfig, this.systemConfigDetails, this.systemConfigDetails.config_id);
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
            const res = await Api.put(apiRegister.sysconfig, this.systemConfigDetails, this.systemConfigDetails.config_id);
            return res;

        } catch (e) {
            // tslint:disable-next-line: no-console
            console.error(e);
        }
    }
    /**
     * sysconfig getter
     */
    get systemconfig() {
        return this.systemConfigDetails;
    }
    get isipV4Status() {
        return this.isipV4;
    }
    get isipV6Status() {
        return this.isipV6;
    }

    // Loader Config
    @Mutation
    public loaderConfigMutation(loaderData: any) {
        this.showLoader = loaderData.show;
        this.loaderMessage = loaderData.message;
    }
    @Action
    public async showLoaderMessage(loaderData: any) {
        this.context.commit("loaderConfigMutation", loaderData);
    }
    get showLoaderStatus() {
        return this.showLoader;
    }
    get loaderMessageText() {
        return this.loaderMessage;
    }


}
