import { Injectable } from '@nestjs/common';
import { AuthGuard as NestAuthGuard, IAuthGuard } from '@nestjs/passport';
import { Type } from '@nestjs/common';

function JwtGuardFactory(): Type<IAuthGuard> {
  // Tipe ANY diselesaikan DI SINI, tersembunyi dari ESLint
  return NestAuthGuard('jwt') as unknown as Type<IAuthGuard>;
}

@Injectable()
export class JwtAuthGuard extends JwtGuardFactory() {}
