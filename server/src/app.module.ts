import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';

import { JwtStrategy } from './auth/jwt_strategy';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';

import { Auth } from './auth/entities/auth.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    ConfigModule, 

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: Number(config.get('JWT_EXPIRE')) || 86400,
        },
      }),
    }),

    TypeOrmModule.forFeature([Auth, User]),
  ],

  controllers: [AuthController],

  providers: [AuthService, JwtStrategy, JwtAuthGuard],

  exports: [JwtAuthGuard, PassportModule, JwtModule],
})
export class AuthModule {}
