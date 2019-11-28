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
import SystemConfigObject from "./../../models/system-configuration";

Vue.use(Vuex);

@Module({
    namespaced: true
})
export default class SystemConfiguration extends VuexModule {
    public systemConfig: SystemConfigObject = {} as SystemConfigObject;
    public isipV4: boolean = false;
    public isipV6: boolean = false;
    public isnetworkSettingsSkip: boolean = false;
    public showLoader: boolean = false;
    public loaderMessage: string = "";

    @Mutation
    public systemConfigMutation(payload: any) {
        this.systemConfig = { ...payload };
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
    @Mutation
    public loaderConfigMutation(loaderData: any) {
        this.showLoader = loaderData.show;
        this.loaderMessage = loaderData.message;
    }

    @Action
    public async getSystemConfigAction(queryParams: object) {
        const res = await Api.getAll(apiRegister.systemconfig, queryParams);
        const data = res.data;
        this.context.commit("systemConfigMutation", data);
    }
    @Action
    public async updateSystemConfig(payload: any): Promise<any | undefined> {
        try {
            const res = Api.patch(apiRegister.systemconfig,
                { acknowledged: payload.acknowledged === "1" ? true : false, comment: payload.comment },
                payload.id);
            return res;
        } catch (e) {
            // tslint:disable-next-line: no-console
            console.log(e);
        }
    }

    @Action
    public async showLoaderMessage(loaderData: any) {
        this.context.commit("loaderConfigMutation", loaderData);
    }

    // Get system configuration from store
    get systemConfigData() {
        return this.systemConfig.system_config;
    }
    get ipv4IpAddress() {
        if (this.systemConfig.system_config) {
            return this.systemConfig.system_config.ipv4.ipAddress;
        }
        return;
    }
    get ipv4Netmask() {
        if (this.systemConfig.system_config) {
            return this.systemConfig.system_config.ipv4.netmask;
        }
        return;
    }
    get ipv4Gateway() {
        if (this.systemConfig.system_config) {
            return this.systemConfig.system_config.ipv4.gateway;
        }
        return;
    }
    get isipV4Status() {
        return this.isipV4;
    }
    get isipV6Status() {
        return this.isipV6;
    }
    get showLoaderStatus() {
        return this.showLoader;
    }
    get loaderMessageText() {
        return this.loaderMessage;
    }

}
