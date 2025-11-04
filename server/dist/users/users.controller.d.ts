import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    signup(CreateUserDto: CreateUserDto): Promise<{
        message: string;
        data: GetUserDto;
    }>;
}
