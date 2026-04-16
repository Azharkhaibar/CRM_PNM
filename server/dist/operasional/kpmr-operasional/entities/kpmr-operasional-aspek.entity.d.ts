import { KPMROperasionalQuestion } from './kpmr-operasional-pertanyaan.entity';
export declare class KPMROperasionalAspect {
    id: number;
    year: number;
    aspekNo: string;
    aspekTitle: string;
    aspekBobot: number;
    createdAt: Date;
    updatedAt: Date;
    questions: KPMROperasionalQuestion[];
}
