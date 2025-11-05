import { GetAuthResponseDto } from 'src/auth/dto/get-auth-response.dto';
export declare class GetUserDto {
    user_id: number;
    username: string;
    gender: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    auth: GetAuthResponseDto;
}
