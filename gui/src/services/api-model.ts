export interface ApiResponse {
    data?: any;
    headers?: any;
    status: number;
    statusText: string;
    error?: Error;
}
