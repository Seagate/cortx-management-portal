import { PerfomanceStatsDetails, DiskCapacityDetails } from "./../models/performance-stats";
export default abstract class StatsUtility {
    public static formatData(payload: PerfomanceStatsDetails, chartType: string = ""): any[][] {
        const c3Format: any = { ...payload };
        const outputFormat: any[][] = [];
        const constStr = require("../common/const-string.json");

        if (c3Format.list !== undefined) {
            for (let objCount = 0; objCount <= c3Format.list.length - 1; objCount++) {
                if (objCount === 0) {
                    for (let datePointCount = 0;
                        datePointCount <= c3Format.list[0].data[0].length - 1;
                        datePointCount++) {
                        payload.list[0].data[0].splice(datePointCount,
                            1,
                            new Date(payload.list[0].data[0][datePointCount]));
                    }
                }
                if (chartType === constStr.throughput) {
                    for (let i = 0; i <= payload.list[objCount].data[1].length - 1; i++) {
                        payload.list[objCount].data[1][i] = payload.list[objCount].data[1][i] / 1024;
                    }
                }
                payload.list[objCount].data[1].unshift(payload.list[objCount].label);
                outputFormat.push(payload.list[objCount].data[1]);

            }
            outputFormat.push(payload.list[0].data[0]);
            payload.list[0].data[0].unshift("x");
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
