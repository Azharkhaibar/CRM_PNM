import { GetAuthResponseDto } from 'src/auth/dto/get-auth-response.dto';
import { DivisiResponseDto } from 'src/divisi/dto/divisi-response.dto';
export declare class GetUserDto {
    user_id: number;
    userID: string;
    role: string;
    gender: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    auth: GetAuthResponseDto;
    divisi: DivisiResponseDto | null;
}
