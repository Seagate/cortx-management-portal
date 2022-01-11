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
import {
  PerfomanceStatsDetails,
  DiskCapacityDetails
} from "./../models/performance-stats";
export default abstract class StatsUtility {

  // params : metricValue = selected stats metric value.
  public static getYaxisLabel(metricValue: string): any {
    switch (metricValue.split("_")[0]) {
      case "throughput":
        return "MB Transferred Per Second";
      case "latency":
        return "Milliseconds";
      case "iops":
        return "iops";
      default:
        return "";
    }
  }

  // This static method converts api response into 2D array format of c3.js
  // parameters: payload: api response data
  //             chartType: Throughput|| Latency || IOPS
  //             paramList: List of 2 metrics to show on the graph
  public static formatData(
    payload: PerfomanceStatsDetails,
    chartType: string = "",
    paramList: string[]
  ): any[][] {
    const c3Format: any = { ...payload };
    const outputFormat: any[][] = [];
    const constStr = require("../common/const-string.json");
    const readIndex: number = 0;
    const writeIndex: number = 1;
    const totalIndex: number = 2;
    const paramArray: string[] = ["Read", "Write", "Total"];

    if (c3Format.list !== undefined) {
      for (let objCount = 0; objCount <= c3Format.list.length - 1; objCount++) {
        if (objCount === 0) {
          for (
            let datePointCount = 0;
            datePointCount <= c3Format.list[0].data[0].length - 1;
            datePointCount++
          ) {
            payload.list[0].data[0].splice(
              datePointCount,
              1,
              new Date(payload.list[0].data[0][datePointCount])
            );
          }
        }
        if (chartType === constStr.throughput) {
          for (let i = 0; i <= payload.list[objCount].data[1].length - 1; i++) {
            payload.list[objCount].data[1][i] = Math.round(
              payload.list[objCount].data[1][i] / (1024 * 1024)
            );
          }
        }
        payload.list[objCount].data[1].unshift(payload.list[objCount].label);
        outputFormat.push(payload.list[objCount].data[1]);
      }
      outputFormat.push(payload.list[0].data[0]);
      payload.list[0].data[0].unshift("x");
    }
    // Following loop is for recognizing the parameter to splice
    // Which we are not going to show on the gui
    // This logic will go once we integrate with generic stats api
    for (
      let paramIndex = 0;
      paramIndex <= paramArray.length - 1;
      paramIndex++
    ) {
      if (!paramList.includes(paramArray[paramIndex])) {
        switch (paramArray[paramIndex].toLowerCase()) {
          case "read":
            outputFormat.splice(readIndex, 1);
            break;
          case "write":
            outputFormat.splice(writeIndex, 1);
            break;
          case "total":
            outputFormat.splice(totalIndex, 1);
            break;
          default:
            break;
        }
      }
    }

    return outputFormat;
  }

  // This static function is used to convert capacity api data into c3 format
  public static formatCapacityData(
    payload: DiskCapacityDetails | null
  ): [string, ...any[]][] {
    const outputFormat: [string, ...any[]][] = [["data"]];
    if (payload !== null && payload !== undefined) {
      outputFormat[0].push(payload.usage_percentage);
    }
    return outputFormat;
  }

  // This static method converts api response into 2D array format of c3.js
  // c3.js: format [ ["x", new Date().getTime()], ["total", 0], ["read", 0], ["write", 0] ]
  // api response format : { "id": "1", "metrics": [ { "data": [ [ 1580732207000 ], [ 0 ] ],
  // "name": "throughput.read", "unit": "bytes" } ] }
  public static formatDataGenric(
    payload: any,
    chartType: string = "",
    paramList: any[]
  ) {
    const outputFormat: any[] = [];
    if (payload.metrics && payload.metrics.length > 0) {
      outputFormat.push(["x", ...payload.metrics[0].data[0]]);
      payload.metrics.forEach((metric: any) => {
        outputFormat.push([
          metric.name.replace(".", "_"),
          ...metric.data[1]
        ])
      });
    }
    return outputFormat;
  }

  // getUnitStatMetric function returns unit for each
  // param metric : selected stats metric
  public static getUnitStatMatric(metric: string) {
    switch (metric.split("_")[0]) {
      case "throughput":
        return "mb";
      case "latency":
        return "milliseconds";
      case "iops":
        return "iops";
      default:
        return "mb";
    }
  }

  public static replaceCharInStr(
    value: string,
    charToReplace: string,
    charToReplaceWith: string
  ): string {
    return (
      value.substring(0, value.indexOf(charToReplace)) +
      charToReplaceWith +
      value.substring(value.indexOf(charToReplace) + 1, value.length)
    );
  }
}
