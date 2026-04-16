import { KPMROperasionalAspect } from './kpmr-operasional-aspek.entity';
import { KPMROperasionalDefinition } from './kpmr-operasional-definisi.entity';
export declare class KPMROperasionalQuestion {
    id: number;
    year: number;
    aspekNo: string;
    aspect: KPMROperasionalAspect;
    sectionNo: string;
    sectionTitle: string;
    createdAt: Date;
    updatedAt: Date;
    definitions: KPMROperasionalDefinition[];
}
