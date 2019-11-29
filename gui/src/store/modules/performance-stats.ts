/*****************************************************************************
 Filename:          performance-stats.ts
 Description:       Performance stats Store Module

 Creation Date:     11/06/2019
 Author:            Piyush Gupte

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
    PerfomanceStatsDetails,
    PerformanceStatsQueryParams,
    DiskCapacityDetails
} from "./../../models/performance-stats";
import { Module, VuexModule, Mutation, Action, MutationAction } from "vuex-module-decorators";
import StatsUtility from "./../../common/stats-utility";

Vue.use(Vuex);

@Module({
    namespaced: true
})
export default class PerformanceStats extends VuexModule {

    public throughputPerformanceData: PerfomanceStatsDetails | null = null;
    public latencyPerformanceData: PerfomanceStatsDetails | null = null;
    public capacityData: DiskCapacityDetails = {
        size: "0 GB",
        used: "0 GB",
        avail: "0 GB",
        usage_Percentage: "0 %"
    };
    public constStr = require("../../common/const-string.json");
    // Throuthput
    @Action
    public async getThroughputPerformanceStats(queryParams: PerformanceStatsQueryParams) {
        try {
            const res = await Api.getAll(apiRegister.throughput, queryParams);

            return StatsUtility.formatData(res.data, this.constStr.throughput);
        } catch (e) {
            // tslint:disable-next-line: no-console
            console.error("err logger: ", e);
        }
    }

    @Mutation
    public setThrouthputPerformanceStats(payload: any) {
        this.throughputPerformanceData = { ...payload };
    }

    get getThroughputperformanceStats() {
        if (this.throughputPerformanceData) {
            return StatsUtility.formatData(this.throughputPerformanceData);
        }
        return;
    }

    // Latency
    @Action
    public async getLatencyPerformanceStats(latencyParams: any) {
        try {
            const res = await Api.getAll(apiRegister.latency, latencyParams);

            return StatsUtility.formatData(res.data, this.constStr.latency);
        } catch (e) {
            // tslint:disable-next-line: no-console
            console.error("err logger: ", e);
        }

    }
    @Mutation
    public setLatencyPerformanceStats(payload: any) {
        this.latencyPerformanceData = { ...payload };
    }

    get getLatencyperformanceStats() {
        if (this.latencyPerformanceData) {
            return StatsUtility.formatData(this.latencyPerformanceData);
        }

    }

    // Iops
    @Action
    public async getIopsPerformanceStats(latencyParams: any) {
        try {
            const res = await Api.getAll(apiRegister.iops, latencyParams);

            return StatsUtility.formatData(res.data, this.constStr.iops);
        } catch (e) {
            // tslint:disable-next-line: no-console
            console.error("err logger: ", e);
        }
    }

    // capacity
    @Action
    public async getCapacityStats(latencyParams: any) {
        try {
            const res = await Api.getAll(apiRegister.capacity, latencyParams);
            this.context.commit("setCapacityStats", res.data);
            return StatsUtility.formatCapacityData(res.data);
        } catch (e) {
            // tslint:disable-next-line: no-console
            console.error("err logger: ", e);
        }
    }

    @Mutation
    public async setCapacityStats(data: DiskCapacityDetails) {
        this.capacityData = { ...data };
    }

    get getCapacity() {
        return this.capacityData;
    }


}
