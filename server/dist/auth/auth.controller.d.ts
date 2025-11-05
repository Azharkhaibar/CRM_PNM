import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: {
        userID: string;
        password: string;
    }): Promise<{
        accessToken: string;
    }>;
}
