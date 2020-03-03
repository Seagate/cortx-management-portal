import { PerfomanceStatsDetails, DiskCapacityDetails } from "./../models/performance-stats";
export default abstract class StatsUtility {

  // params : metricValue = selected stats metric value.
  public static getYtwoObject(metricValue: string): any {
    // metrics object has c3 y2 axis object for each stats parameter.
    const metrics: any = {
      throughput_read: { throughput_read: "y2" },
      throughput_write: { throughput_write: "y2" },
      throughput_total: { throughput_total: "y2" },
      latency_total_request_time: { latency_total_request_time: "y2" },
      latency_create_object: { latency_create_object: "y2" },
      latency_delete_object: { latency_delete_object: "y2" },
      latency_write_object: { latency_write_object: "y2" },
      latency_read_object: { latency_read_object: "y2" },
      latency_getkv: { latency_getkv: "y2" },
      latency_putkv: { latency_putkv: "y2" },
      latency_deletekv: { latency_deletekv: "y2" },
      iops_read_object: { iops_read_object: "y2" },
      iops_write_object: { iops_write_object: "y2" },
      iops_read_bucket: { iops_read_bucket: "y2" },
      iops_write_bucket: { iops_write_bucket: "y2" }
    };

    switch (metricValue) {
      case "throughput_read":
        return metrics.throughput_read;
      case "throughput_write":
        return metrics.throughput_write;
      case "throughput_total":
        return metrics.throughput_total;
      case "latency_total_request_time":
        return metrics.latency_total_request_time;
      case "latency_create_object":
        return metrics.latency_create_object;
      case "latency_delete_object":
        return metrics.latency_delete_object;
      case "latency_write_object":
        return metrics.latency_write_object;
      case "latency_read_object":
        return metrics.latency_read_object;
      case "latency_getkv":
        return metrics.latency_getkv;
      case "latency_putkv":
        return metrics.latency_putkv;
      case "latency_deletekv":
        return metrics.latency_deletekv;
      case "iops_read_object":
        return metrics.iops_read_object;
      case "iops_write_object":
        return metrics.iops_write_object;
      case "iops_read_bucket":
        return metrics.iops_read_bucket;
      case "iops_write_bucket":
        return metrics.iops_write_bucket;
      default :
        return {};


    }
  }

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

  // This static method converts api responce into 2D array format of c3.js
  // c3.js: format [ ["x", new Date().getTime()], ["total", 0], ["read", 0], ["write", 0] ]
  // api response format : { "id": "1", "metrics": [ { "data": [ [ 1580732207000 ], [ 0 ] ],
  // "name": "throughput.read", "unit": "bytes" } ] }
  public static formatDataGenric(payload: any, chartType: string = "", paramList: any[]) {
    const c3Format: any = { ...payload };
    const outputFormat: any[][] = [];
    if (c3Format.metrics !== undefined) {
      for (let metricNo = 0; metricNo <= c3Format.metrics.length - 1; metricNo++) {
        if (c3Format.metrics[metricNo].data !== undefined) {
          if (metricNo === 0) {
            c3Format.metrics[metricNo].data[0].unshift("x");
            outputFormat.push(c3Format.metrics[metricNo].data[0]);
          }
          c3Format.metrics[metricNo].data[1].unshift(this.replaceCharInStr(c3Format.metrics[metricNo].name, ".", "_"));
          outputFormat.push(c3Format.metrics[metricNo].data[1]);
        }
      }
    }

    return outputFormat;
  }

  // getUnitStatMatric function returns unit for each
  // param metric : selected stats matric
  public static getUnitStatMatric(matric: string) {
    switch (matric.split("_")[0]) {
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

  public static replaceCharInStr(value: string, charToReplace: string, charToReplaceWith: string): string {
    return value.substring(0, value.indexOf(charToReplace)) + charToReplaceWith +
    value.substring(value.indexOf(charToReplace)
    + 1, value.length);
  }
}
