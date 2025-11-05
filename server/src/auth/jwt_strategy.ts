import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtPayload } from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // ✅ Sudah aman
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const userId = Number(payload.sub);
    const user = await this.usersRepository.findOne({
      where: { user_id: userId },
      relations: ['auth'],
    });

    if (!user) throw new UnauthorizedException('User not found');

    return user;
  }
}
