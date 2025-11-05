import { Gender } from '../enum/userEnum';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';
export declare class CreateUserDto {
    username: string;
    gender: Gender;
    auth: CreateAuthDto;
}
