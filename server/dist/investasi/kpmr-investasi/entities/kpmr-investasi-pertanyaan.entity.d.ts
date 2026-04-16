import { KPMRAspect } from './kpmr-investasi-aspek.entity';
import { KPMRDefinition } from './kpmr-investasi-definisi.entity';
export declare class KPMRQuestion {
    id: number;
    year: number;
    aspekNo: string;
    aspect: KPMRAspect;
    sectionNo: string;
    sectionTitle: string;
    createdAt: Date;
    updatedAt: Date;
    definitions: KPMRDefinition[];
}
