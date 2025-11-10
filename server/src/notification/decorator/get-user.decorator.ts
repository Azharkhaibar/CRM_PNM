// src/decorators/get-user.decorator.ts
import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export interface AuthenticatedUser {
  user_id: number;
  userID: string;
  role: string;
  gender: string;
  divisi?: {
    divisi_id: number;
    name: string;
  } | null;
  created_at?: Date;
  updated_at?: Date;
}

export const GetUser = createParamDecorator(
  (
    property: keyof AuthenticatedUser | undefined,
    ctx: ExecutionContext,
  ): AuthenticatedUser | unknown => {
    const request = ctx.switchToHttp().getRequest();

    if (!request.user || typeof request.user !== 'object') {
      throw new UnauthorizedException('Invalid user authentication');
    }

    const user = request.user as AuthenticatedUser;

    if (!user.user_id || !user.userID) {
      throw new UnauthorizedException(
        'User object missing required properties',
      );
    }

    if (property) {
      const value = user[property];
      if (value === undefined) {
        throw new UnauthorizedException(
          `User property '${String(property)}' not found`,
        );
      }
      return value;
    }

    return user;
  },
);
