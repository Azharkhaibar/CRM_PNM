import { Reputasi } from './reputasi.entity';
export declare class ReputasiSection {
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
    reputasi: Reputasi[];
}
