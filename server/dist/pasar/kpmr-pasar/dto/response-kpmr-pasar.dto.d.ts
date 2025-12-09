export declare class KpmrPasarResponseDto<T = any> {
    success: boolean;
    data?: T | undefined;
    message?: string | undefined;
    constructor(success: boolean, data?: T | undefined, message?: string | undefined);
    static success<T>(data: T, message?: string): KpmrPasarResponseDto<T>;
    static error(message: string): KpmrPasarResponseDto;
}
