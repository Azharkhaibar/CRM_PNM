export declare class KpmrPasarQueryDto {
    year?: number;
    quarter?: number;
    isActive?: boolean;
    isLocked?: boolean;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
export declare class KpmrPasarStatsQueryDto {
    year?: number;
    quarter?: number;
}
