import { KPMROperasionalDefinition } from './kpmr-operasional-definisi.entity';
export declare class KPMROperasionalScore {
    id: number;
    definitionId: number;
    definition: KPMROperasionalDefinition;
    year: number;
    quarter: string;
    sectionSkor: number | null;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string | null;
    updatedBy: string | null;
}
