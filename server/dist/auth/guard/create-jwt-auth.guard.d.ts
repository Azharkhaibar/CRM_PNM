import { IAuthGuard } from '@nestjs/passport';
import { Type } from '@nestjs/common';
export declare function createJwtAuthGuard(): Type<IAuthGuard>;
