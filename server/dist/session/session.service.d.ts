import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { IAuthForSession } from './types/session.types';
export declare class SessionService {
    private sessionRepository;
    constructor(sessionRepository: Repository<Session>);
    createSession(auth: IAuthForSession, userAgent?: string): Promise<Session>;
    validateSession(sessionId: number): Promise<boolean>;
    findSessionsByUser(userId: number): Promise<Session[]>;
    findOneForUser(userId: number, sessionId: number): Promise<Session>;
    removeForUser(userId: number, sessionId: number): Promise<{
        message: string;
    }>;
    removeAllUserSessions(userId: number): Promise<{
        message: string;
    }>;
}
