export declare function apiResponse<T>(data: T, message?: string, success?: boolean): {
    success: boolean;
    message: string;
    data: T;
    timestamp: Date;
};
