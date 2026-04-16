import { KPMROperasionalQuestion } from './kpmr-operasional-pertanyaan.entity';
import { KPMROperasionalScore } from './kpmr-operasional-skor.entity';
export declare class KPMROperasionalDefinition {
    id: number;
    year: number;
    aspekNo: string;
    aspekTitle: string;
    aspekBobot: number;
    sectionNo: string;
    question: KPMROperasionalQuestion;
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
    scores: KPMROperasionalScore[];
}
