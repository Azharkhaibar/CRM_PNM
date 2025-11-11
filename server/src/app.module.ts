import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { typeOrmConfig } from './config/db.config';
import { InvestasiModule } from './investasi/investasi/investasi.module';
import { PasarModule } from './pasar/pasar.module';
import { LikuiditasModule } from './likuiditas/likuiditas.module';
import { OperasionalModule } from './operasional/operasional.module';
import { DivisiModule } from './divisi/divisi.module';
import { NotificationModule } from './notification/notification.module';
import { KpmrInvestasiModule } from './investasi/kpmr-investasi/kpmr-investasi.module';
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
    InvestasiModule,
    PasarModule,
    LikuiditasModule,
    OperasionalModule,
    DivisiModule,
    NotificationModule,
    KpmrInvestasiModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
