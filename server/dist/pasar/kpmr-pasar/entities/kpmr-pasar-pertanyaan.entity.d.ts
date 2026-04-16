import { KPMRPasarAspect } from './kpmr-pasar-aspek.entity';
import { KPMRPasarDefinition } from './kpmr-pasar-definisi.entity';
export declare class KPMRPasarQuestion {
    id: number;
    year: number;
    aspekNo: string;
    sectionNo: string;
    sectionTitle: string;
    createdAt: Date;
    updatedAt: Date;
    aspect: KPMRPasarAspect;
    definitions: KPMRPasarDefinition[];
}
