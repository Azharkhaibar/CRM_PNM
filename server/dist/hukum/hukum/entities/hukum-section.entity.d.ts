import { Hukum } from './hukum.entity';
export declare class HukumSection {
    id: number;
    no: string;
    bobotSection: number;
    parameter: string;
    description: string | null;
    category: string | null;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    hukum: Hukum[];
}
