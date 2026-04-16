import { KPMRLikuiditasDefinition } from './kpmr-likuiditas-definisi.entity';
export declare class KPMRLikuiditasScore {
    id: number;
    definitionId: number;
    definition: KPMRLikuiditasDefinition;
    year: number;
    quarter: string;
    sectionSkor: number | null;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string | null;
    updatedBy: string | null;
}
