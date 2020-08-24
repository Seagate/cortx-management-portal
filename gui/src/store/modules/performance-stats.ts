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
  PerfomanceStatsDetails,
  PerformanceStatsQueryParams,
  DiskCapacityDetails
} from "./../../models/performance-stats";
import {
  Module,
  VuexModule,
  Mutation,
  Action,
  MutationAction
} from "vuex-module-decorators";
import StatsUtility from "./../../common/stats-utility";

Vue.use(Vuex);

@Module({
  namespaced: true
})
export default class PerformanceStats extends VuexModule {
  public capacityData: DiskCapacityDetails = {
    size: "0 GB",
    used: "0 GB",
    avail: "0 GB",
    usage_percentage: "0 %"
  };
  public constStr = require("../../common/const-string.json");
  // Throuthput
  @Action
  public async getThroughputPerformanceStats(queryParams: any) {
    try {
      const { metric1, metric2 } = queryParams;
      const metric1Unit = StatsUtility.getUnitStatMatric(queryParams.metric1);
      const metric2Unit = StatsUtility.getUnitStatMatric(queryParams.metric2);
      const metric1Name: string =
        StatsUtility.replaceCharInStr(queryParams.metric1, "_", ".") +
        "." +
        metric1Unit;
      const metric2Name: string =
        StatsUtility.replaceCharInStr(queryParams.metric2, "_", ".") +
        "." +
        metric2Unit;
      let apiUri: string = "";

      if (queryParams.metric1 !== "" && queryParams.metric2 !== "") {
        // tslint:disable-next-line:max-line-length
        apiUri = `${apiRegister.stats}?from=${queryParams.from}&to=${queryParams.to}&total_sample=${queryParams.total_sample}&metric=${metric1Name}&metric=${metric2Name}`;
      } else {
        if (queryParams.metric1 === "") {
          // tslint:disable-next-line:max-line-length
          apiUri = `${apiRegister.stats}?from=${queryParams.from}&to=${queryParams.to}&total_sample=${queryParams.total_sample}&metric=${metric2Name}`;
        } else {
          // tslint:disable-next-line:max-line-length
          apiUri = `${apiRegister.stats}?from=${queryParams.from}&to=${queryParams.to}&total_sample=${queryParams.total_sample}&metric=${metric1Name}`;
        }
      }
      const res = await Api.getAll(apiUri);

      if (res && res.data) {
        return StatsUtility.formatDataGenric(
          res.data,
          this.constStr.throughput,
          [metric1, metric2]
        );
      }
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error("err logger: ", e);
    }
  }

  // Latency
  @Action
  public async getLatencyPerformanceStats(latencyParams: any) {
    try {
      const res = await Api.getAll(apiRegister.latency, latencyParams);
      if (res && res.data) {
        return StatsUtility.formatData(res.data, this.constStr.latency, []);
      }
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error("err logger: ", e);
    }
  }

  // Iops
  @Action
  public async getIopsPerformanceStats(latencyParams: any) {
    try {
      const res = await Api.getAll(apiRegister.iops, latencyParams);
      if (res && res.data) {
        return StatsUtility.formatData(res.data, this.constStr.iops, []);
      }
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
      if (res && res.data) {
        this.context.commit("setCapacityStats", res.data);
        return StatsUtility.formatCapacityData(res.data);
      }
    } catch (e) {
      this.context.commit("setCapacityStats", {} as DiskCapacityDetails);
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
