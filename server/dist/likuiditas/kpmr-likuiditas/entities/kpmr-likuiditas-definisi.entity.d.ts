import { KPMRLikuiditasQuestion } from './kpmr-likuiditas-pertanyaan.entity';
import { KPMRLikuiditasScore } from './kpmr-likuiditas-skor.entity';
export declare class KPMRLikuiditasDefinition {
    id: number;
    year: number;
    aspekNo: string;
    aspekTitle: string;
    aspekBobot: number;
    sectionNo: string;
    question: KPMRLikuiditasQuestion;
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
    scores: KPMRLikuiditasScore[];
}
