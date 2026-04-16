import { KPMRPasarQuestion } from './kpmr-pasar-pertanyaan.entity';
import { KPMRPasarScore } from './kpmr-pasar-skor.entity';
export declare class KPMRPasarDefinition {
    id: number;
    year: number;
    aspekNo: string;
    aspekTitle: string;
    aspekBobot: number;
    sectionNo: string;
    question: KPMRPasarQuestion;
    sectionTitle: string;
    level1: string | null;
    level2: string | null;
    level3: string | null;
    level4: string | null;
    level5: string | null;
    evidence: string | null;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string | null;
    updatedBy: string | null;
    scores: KPMRPasarScore[];
}
