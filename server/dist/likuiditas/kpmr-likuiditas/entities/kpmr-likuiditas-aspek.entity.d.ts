import { KPMRLikuiditasQuestion } from './kpmr-likuiditas-pertanyaan.entity';
export declare class KPMRLikuiditasAspect {
    id: number;
    year: number;
    aspekNo: string;
    aspekTitle: string;
    aspekBobot: number;
    createdAt: Date;
    updatedAt: Date;
    questions: KPMRLikuiditasQuestion[];
}
