export interface PerfomanceStatsDetails {
    id: number;
    list: PerformanceServerObject[];
    stats: string;
}

interface PerformanceServerObject {
    data: any[][];
    label: string;
}

export interface PerformanceStatsQueryParams {
    id: number;
    from: string;
    to: string;
    interval: string;
    meric_list: string[];
    format: string;
}

export interface DiskCapacityDetails {
    size: string;
    used: string;
    avail: string;
    usage_percentage: string;
}
