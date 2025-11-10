// auth.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  BadRequestException,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from 'src/users/dto/register-user.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { RequestUser } from './dto/get-auth-response.dto';

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
  async getMe(@Req() req: Request & { user: RequestUser }) {
    const auth = await this.authService.findOneByUserID(req.user.userID);

    if (!auth) {
      throw new BadRequestException('User not found');
    }

    return {
      user_id: auth.user.user_id,
      userID: auth.userID,
      role: auth.user.role,
      gender: auth.user.gender,
      created_at: auth.user.created_at,
      updated_at: auth.user.updated_at,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  async changePassword(
    @Req() req: Request & { user: RequestUser },
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    try {
      return await this.usersService.changePassword(
        req.user.userID,
        body.currentPassword,
        body.newPassword,
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Password change failed';
      throw new BadRequestException(message);
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { userID: string }) {
    try {
      return await this.usersService.requestPasswordReset(body.userID);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Password reset failed';
      throw new BadRequestException(message);
    }
  }
}
