import { PerfomanceStatsDetails, DiskCapacityDetails } from "./../models/performance-stats";
export default abstract class StatsUtility {
  // This static method converts api responce into 2D array format of c3.js
  // parameters: payload: api response data
  //             chartType: Throughput|| Latency || IOPS
  //             paramList: List of 2 metrics to show on the graph
  public static formatData(payload: PerfomanceStatsDetails, chartType: string = "", paramList: string[]): any[][] {
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
          for (let datePointCount = 0; datePointCount <= c3Format.list[0].data[0].length - 1; datePointCount++) {
            payload.list[0].data[0].splice(datePointCount, 1, new Date(payload.list[0].data[0][datePointCount]));
          }
        }
        if (chartType === constStr.throughput) {
          for (let i = 0; i <= payload.list[objCount].data[1].length - 1; i++) {
            payload.list[objCount].data[1][i] = Math.round(payload.list[objCount].data[1][i] / (1024 * 1024));
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
    for (let paramIndex = 0; paramIndex <= paramArray.length - 1; paramIndex++) {

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

  // This static function is used to convert capacity api data into c3 fromat
  public static formatCapacityData(payload: DiskCapacityDetails | null): [string, ...any[]][] {
    const outputFormat: [string, ...any[]][] = [["data"]];
    if (payload !== null && payload !== undefined) {
      const percentUsage = payload.usage_percentage.split(" ");
      outputFormat[0].push(parseInt(percentUsage[0], 10));
    }
    return outputFormat;
  }
}
