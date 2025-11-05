import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: Repository<User>);
    getUsersData(): Promise<GetUserDto[]>;
    getUserById(id: number): Promise<GetUserDto>;
    updateUserById(id: number, dto: UpdateUserDto): Promise<GetUserDto>;
    deleteUserById(id: number): Promise<{
        message: string;
    }>;
}
