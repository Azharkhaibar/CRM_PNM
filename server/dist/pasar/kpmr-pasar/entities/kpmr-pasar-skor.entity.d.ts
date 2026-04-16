import { KPMRPasarDefinition } from './kpmr-pasar-definisi.entity';
export declare class KPMRPasarScore {
    id: number;
    definitionId: number;
    definition: KPMRPasarDefinition;
    year: number;
    quarter: string;
    sectionSkor: number | null;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string | null;
    updatedBy: string | null;
}
