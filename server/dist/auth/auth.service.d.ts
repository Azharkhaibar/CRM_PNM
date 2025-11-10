import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly authRepository;
    private readonly jwtService;
    constructor(authRepository: Repository<Auth>, jwtService: JwtService);
    login(userID: string, password: string): Promise<{
        accessToken: string;
    }>;
    findOneByUserID(userID: string): Promise<Auth | null>;
}
