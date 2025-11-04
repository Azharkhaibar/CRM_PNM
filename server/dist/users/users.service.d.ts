import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Auth } from 'src/auth/entities/auth.entity';
import { GetUserDto } from './dto/get-user.dto';
export declare class UsersService {
    private readonly usersRepository;
    private readonly authRepository;
    constructor(usersRepository: Repository<User>, authRepository: Repository<Auth>);
    register(createUserDto: CreateUserDto): Promise<GetUserDto>;
    UserGetById(id: number): Promise<GetUserDto>;
    getUsersData(): Promise<GetUserDto[]>;
}
