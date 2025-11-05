import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorator/role.decorator';
import { Request } from 'express';

interface AuthRequest extends Request {
  user?: Record<string, unknown>;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic =
      this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler()) ?? false;

    if (isPublic) return true;

    const request: AuthRequest = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Authorization token missing');
    }

    try {
      const payload =
        await this.jwtService.verifyAsync<Record<string, unknown>>(token);

      request.user = payload;
    } catch (_err: unknown) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }

  private extractTokenFromHeader(request: AuthRequest): string | undefined {
    const header = request.headers['authorization'];

    if (typeof header !== 'string') return undefined;

    const parts = header.split(' ');

    if (parts.length !== 2) return undefined;
    if (parts[0] !== 'Bearer') return undefined;

    return parts[1];
  }
}
