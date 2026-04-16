import { KPMRQuestion } from './kpmr-investasi-pertanyaan.entity';
export declare class KPMRAspect {
    id: number;
    year: number;
    aspekNo: string;
    aspekTitle: string;
    aspekBobot: number;
    createdAt: Date;
    updatedAt: Date;
    questions: KPMRQuestion[];
}
