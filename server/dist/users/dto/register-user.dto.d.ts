import { Role, Gender } from '../enum/userEnum';
export declare class RegisterDto {
    userID: string;
    password: string;
    role: Role;
    gender: Gender;
}
