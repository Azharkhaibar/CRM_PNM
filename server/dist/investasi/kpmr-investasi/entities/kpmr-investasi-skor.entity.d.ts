import { KPMRDefinition } from './kpmr-investasi-definisi.entity';
export declare class KPMRScore {
    id: number;
    definitionId: number;
    definition: KPMRDefinition;
    year: number;
    quarter: string;
    sectionSkor: number | null;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string | null;
    updatedBy: string | null;
}
