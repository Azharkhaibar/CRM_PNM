import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from 'src/users/dto/register-user.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  login(@Body() body: { userID: string; password: string }) {
    return this.authService.login(body.userID, body.password);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      return await this.usersService.register(dto);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Register failed';
      throw new BadRequestException(message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req) {
    return req.user;
  }
}
