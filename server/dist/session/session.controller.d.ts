import { SessionService } from './session.service';
import { RequestUser } from 'src/auth/dto/get-auth-response.dto';
export declare class SessionController {
    private readonly sessionService;
    constructor(sessionService: SessionService);
    getMySessions(req: Request & {
        user: RequestUser;
    }): Promise<import("./entities/session.entity").Session[]>;
    findOne(req: Request & {
        user: RequestUser;
    }, id: string): Promise<import("./entities/session.entity").Session>;
    remove(req: Request & {
        user: RequestUser;
    }, id: string): Promise<{
        message: string;
    }>;
    removeAll(req: Request & {
        user: RequestUser;
    }): Promise<{
        message: string;
    }>;
}
