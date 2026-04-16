import { KPMRQuestion } from './kpmr-investasi-pertanyaan.entity';
import { KPMRScore } from './kpmr-investasi-skor.entity';
export declare class KPMRDefinition {
    id: number;
    year: number;
    aspekNo: string;
    aspekTitle: string;
    aspekBobot: number;
    sectionNo: string;
    question: KPMRQuestion;
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
    scores: KPMRScore[];
}
