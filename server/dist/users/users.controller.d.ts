import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllUsers(): Promise<GetUserDto[]>;
    getUserById(id: number): Promise<GetUserDto>;
    updateUser(id: number, dto: UpdateUserDto): Promise<GetUserDto>;
    deleteUser(id: number): Promise<{
        message: string;
    }>;
    updateUserDivision(id: string, body: {
        divisiId: number | null;
    }): Promise<GetUserDto>;
}
