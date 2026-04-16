import { KPMRLikuiditasAspect } from './kpmr-likuiditas-aspek.entity';
import { KPMRLikuiditasDefinition } from './kpmr-likuiditas-definisi.entity';
export declare class KPMRLikuiditasQuestion {
    id: number;
    year: number;
    aspekNo: string;
    aspect: KPMRLikuiditasAspect;
    sectionNo: string;
    sectionTitle: string;
    createdAt: Date;
    updatedAt: Date;
    definitions: KPMRLikuiditasDefinition[];
}
