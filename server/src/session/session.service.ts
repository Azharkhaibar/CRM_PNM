// session.service.ts - FIXED VERSION
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Session } from './entities/session.entity';
import { IAuthForSession } from './types/session.types';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  // Buat session baru - SESUAI ENTITY (TANPA token_hash)
  async createSession(
    auth: IAuthForSession,
    userAgent?: string,
  ): Promise<Session> {
    const session = this.sessionRepository.create({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      auth: { auth_id: auth.auth_id } as any,
      user: auth.user,
      user_agent: userAgent,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 hari
      is_active: true,
    });

    return await this.sessionRepository.save(session);
  }

  // Validasi session berdasarkan ID saja (karena tidak ada token_hash)
  async validateSession(sessionId: number): Promise<boolean> {
    const session = await this.sessionRepository.findOne({
      where: {
        session_id: sessionId,
        is_active: true,
        expires_at: MoreThan(new Date()), // Hanya session yang belum expired
      },
    });

    return !!session;
  }

  async findSessionsByUser(userId: number): Promise<Session[]> {
    return await this.sessionRepository.find({
      where: {
        user: { user_id: userId },
        is_active: true,
        expires_at: MoreThan(new Date()),
      },
      relations: ['auth', 'user'],
      order: { created_at: 'DESC' },
    });
  }

  async findOneForUser(userId: number, sessionId: number): Promise<Session> {
    const session = await this.sessionRepository.findOne({
      where: {
        session_id: sessionId,
        is_active: true,
      },
      relations: ['user'],
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.user.user_id !== userId) {
      throw new ForbiddenException('Access denied to this session');
    }

    return session;
  }

  async removeForUser(
    userId: number,
    sessionId: number,
  ): Promise<{ message: string }> {
    const session = await this.findOneForUser(userId, sessionId);

    await this.sessionRepository.update(sessionId, {
      is_active: false,
    });

    return { message: 'Session removed successfully' };
  }

  async removeAllUserSessions(userId: number): Promise<{ message: string }> {
    await this.sessionRepository.update(
      {
        user: { user_id: userId },
        is_active: true,
      },
      {
        is_active: false,
      },
    );

    return { message: 'All sessions removed successfully' };
  }
}
