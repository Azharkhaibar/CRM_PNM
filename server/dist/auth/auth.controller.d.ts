import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from 'src/users/dto/register-user.dto';
export declare class AuthController {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(body: {
        userID: string;
        password: string;
    }): Promise<{
        accessToken: string;
    }>;
    register(dto: RegisterDto): Promise<import("./entities/auth.entity").Auth>;
    getMe(req: any): any;
}
