import { Role, Gender } from '../enum/userEnum';
export declare class UpdateUserDto {
    username?: string;
    role?: Role;
    gender?: Gender;
    divisiId?: number | null;
}
