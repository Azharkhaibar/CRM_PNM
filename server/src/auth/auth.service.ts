import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    userID: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const auth = await this.authRepository.findOne({
      where: { userID },
      relations: ['user'],
    });

    if (!auth) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, auth.hash_password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      sub: auth.user.user_id,
      userID: auth.userID,
      role: auth.user.role,
    };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async findOneByUserID(userID: string) {
    return this.authRepository.findOne({
      where: { userID },
      relations: ['user'],
    });
  }
}
