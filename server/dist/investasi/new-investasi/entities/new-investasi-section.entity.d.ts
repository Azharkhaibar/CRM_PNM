import { Investasi } from './new-investasi.entity';
export declare class InvestasiSection {
    id: number;
    no: string;
    bobotSection: number;
    parameter: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    investasi: Investasi[];
    deletedAt: Date;
}
