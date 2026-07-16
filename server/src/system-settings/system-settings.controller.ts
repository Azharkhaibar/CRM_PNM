import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { SystemSettingsService } from './system-settings.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RequestUser } from 'src/auth/dto/get-auth-response.dto';

@Controller('system-settings')
export class SystemSettingsController {
  constructor(
    private readonly systemSettingsService: SystemSettingsService,
  ) {}

  @Post('verify-pin')
  async verifyPin(@Body() body: { pin: string }) {
    if (!body.pin) {
      throw new BadRequestException('PIN is required');
    }
    const isValid = await this.systemSettingsService.verifyPin(body.pin);
    return { success: isValid };
  }

  @UseGuards(JwtAuthGuard)
  @Get('registration-pin')
  async getRegistrationPin(@Req() req: Request & { user: RequestUser }) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admin can access this setting');
    }
    const pin = await this.systemSettingsService.getSetting('registration_pin');
    return { pin };
  }

  @UseGuards(JwtAuthGuard)
  @Put('registration-pin')
  async updateRegistrationPin(
    @Req() req: Request & { user: RequestUser },
    @Body() body: { pin: string },
  ) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admin can access this setting');
    }
    if (!body.pin || body.pin.length !== 6 || !/^\d+$/.test(body.pin)) {
      throw new BadRequestException('PIN must be exactly 6 digits');
    }
    await this.systemSettingsService.setSetting('registration_pin', body.pin);
    return { success: true, message: 'Registration PIN updated successfully' };
  }
}
