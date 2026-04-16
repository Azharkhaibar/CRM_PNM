import { KPMRPasarQuestion } from './kpmr-pasar-pertanyaan.entity';
export declare class KPMRPasarAspect {
    id: number;
    year: number;
    aspekNo: string;
    aspekTitle: string;
    aspekBobot: number;
    createdAt: Date;
    updatedAt: Date;
    questions: KPMRPasarQuestion[];
}
