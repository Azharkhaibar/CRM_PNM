import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemSettingsService } from './system-settings.service';
import { SystemSettingsController } from './system-settings.controller';
import { SystemSetting } from './entities/system-setting.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SystemSetting]),
    AuthModule,
  ],
  providers: [SystemSettingsService],
  controllers: [SystemSettingsController],
  exports: [SystemSettingsService],
})
export class SystemSettingsModule {}
