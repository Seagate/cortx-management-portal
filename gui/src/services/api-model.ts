export interface ApiResponse {
    data: any;
    status: number;
    statusText: string;
    error?: Error;
}
