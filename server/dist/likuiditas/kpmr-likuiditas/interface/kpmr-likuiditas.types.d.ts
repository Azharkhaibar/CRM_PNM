import { KpmrLikuiditas } from '../entities/kpmr-likuidita.entity';
export interface KpmrGroup {
    aspekNo: string;
    aspekTitle: string;
    aspekBobot: number;
    items: KpmrLikuiditas[];
    skorAverage: number;
}
export interface GroupedKpmrResponse {
    data: KpmrLikuiditas[];
    groups: KpmrGroup[];
    overallAverage: number;
}
export interface KpmrListResponse {
    data: KpmrLikuiditas[];
    total: number;
}
export interface KpmrWhereClause {
    year?: number;
    quarter?: string;
    aspekNo?: string;
    indikator?: any;
}
