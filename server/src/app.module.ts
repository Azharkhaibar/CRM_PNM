import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { typeOrmConfig } from './config/db.config';
import { PasarModule } from './pasar/pasar/pasar.module';
import { LikuiditasModule } from './likuiditas/likuiditas/likuiditas.module';
import { OperasionalModule } from './operasional/operasional/operasional.module';
import { DivisiModule } from './divisi/divisi.module';
import { NotificationModule } from './notification/notification.module';
import { KpmrInvestasiModule } from './investasi/kpmr-investasi/kpmr-investasi.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { KpmrPasarModule } from './pasar/kpmr-pasar/kpmr-pasar.module';
import { KpmrLikuiditasModule } from './likuiditas/kpmr-likuiditas/kpmr-likuiditas.module';
import { NewInvestasiModule } from './investasi/new-investasi/new-investasi.module';
import { HukumModule } from './hukum/hukum/hukum.module';
import { KpmrHukumModule } from './hukum/kpmr-hukum/kpmr-hukum.module';
import { StratejikModule } from './stratejik/stratejik/stratejik.module';
import { KpmrStratejikModule } from './stratejik/kpmr-stratejik/kpmr-stratejik.module';
import { KpmrOperasionalModule } from './operasional/kpmr-operasional/kpmr-operasional.module';
import { KepatuhanModule } from './kepatuhan/kepatuhan/kepatuhan.module';
import { KpmrKepatuhanModule } from './kepatuhan/kpmr-kepatuhan/kpmr-kepatuhan.module';
import { ReputasiModule } from './reputasi/reputasi/reputasi.module';
import { KpmrReputasiModule } from './reputasi/kpmr-reputasi/kpmr-reputasi.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => typeOrmConfig(config),
    }),

    AuthModule,
    UsersModule,
    PasarModule,
    LikuiditasModule,
    OperasionalModule,
    DivisiModule,
    NotificationModule,
    KpmrInvestasiModule,
    AuditLogModule,
    KpmrPasarModule,
    KpmrLikuiditasModule,
    NewInvestasiModule,
    HukumModule,
    KpmrHukumModule,
    StratejikModule,
    KpmrStratejikModule,
    KpmrOperasionalModule,
    KepatuhanModule,
    KpmrKepatuhanModule,
    ReputasiModule,
    KpmrReputasiModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
