import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { RegisterDto } from './dto/register-user.dto';
import { Auth } from 'src/auth/entities/auth.entity';
export declare class UsersService {
    private readonly usersRepository;
    private readonly AuthRepository;
    constructor(usersRepository: Repository<User>, AuthRepository: Repository<Auth>);
    register(dto: RegisterDto): Promise<Auth>;
    getUsersData(): Promise<GetUserDto[]>;
    getUserById(user_id: number): Promise<GetUserDto>;
    updateUserById(user_id: number, dto: UpdateUserDto): Promise<GetUserDto>;
    deleteUserById(user_id: number): Promise<{
        message: string;
    }>;
    changePassword(userID: string, currentPassword: string, newPassword: string): Promise<{
        message: string;
        userID: string;
    }>;
    requestPasswordReset(userID: string): Promise<{
        message: string;
        userID?: undefined;
    } | {
        message: string;
        userID: string;
    } | undefined>;
}
