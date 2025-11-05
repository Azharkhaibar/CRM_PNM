import { AuthGuard as NestAuthGuard, IAuthGuard } from '@nestjs/passport';
import { Type } from '@nestjs/common';

export function createJwtAuthGuard(): Type<IAuthGuard> {
  return NestAuthGuard('jwt') as unknown as Type<IAuthGuard>;
}
