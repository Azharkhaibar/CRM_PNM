import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from 'src/users/dto/register-user.dto';
import { RequestUser } from './dto/get-auth-response.dto';
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
    getMe(req: Request & {
        user: RequestUser;
    }): Promise<{
        user_id: number;
        userID: string;
        role: import("../users/enum/userEnum").Role;
        gender: import("../users/enum/userEnum").Gender;
        created_at: Date;
        updated_at: Date;
    }>;
    changePassword(req: Request & {
        user: RequestUser;
    }, body: {
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        message: string;
        userID: string;
    }>;
    forgotPassword(body: {
        userID: string;
    }): Promise<{
        message: string;
        userID?: undefined;
    } | {
        message: string;
        userID: string;
    } | undefined>;
}
