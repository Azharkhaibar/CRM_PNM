// session.controller.ts - FIXED VERSION
import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { SessionService } from './session.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RequestUser } from 'src/auth/dto/get-auth-response.dto';

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get('me')
  async getMySessions(@Req() req: Request & { user: RequestUser }) {
    return this.sessionService.findSessionsByUser(req.user.sub);
  }

  @Get(':id')
  async findOne(
    @Req() req: Request & { user: RequestUser },
    @Param('id') id: string,
  ) {
    return this.sessionService.findOneForUser(req.user.sub, +id);
  }

  @Delete(':id')
  async remove(
    @Req() req: Request & { user: RequestUser },
    @Param('id') id: string,
  ) {
    return this.sessionService.removeForUser(req.user.sub, +id);
  }

  @Delete()
  async removeAll(@Req() req: Request & { user: RequestUser }) {
    return this.sessionService.removeAllUserSessions(req.user.sub);
  }
}
