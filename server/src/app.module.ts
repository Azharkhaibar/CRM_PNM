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
import { KpmrLikuiditasModule } from './likuiditas/kpmr-likuiditas/kpmr-likuiditas.module';
import { NewInvestasiModule } from './investasi/new-investasi/new-investasi.module';
import { HukumModule } from './hukum/hukum/hukum.module';
import { KpmrHukumModule } from './hukum/kpmr-hukum/kpmr-hukum.module';
import { StrategikModule } from './stratejik/stratejik/stratejik.module';
import { KpmrStratejikModule } from './stratejik/kpmr-stratejik/kpmr-stratejik.module';
import { KpmrOperasionalModule } from './operasional/kpmr-operasional/kpmr-operasional.module';
import { KepatuhanModule } from './kepatuhan/kepatuhan/kepatuhan.module';
import { KpmrKepatuhanModule } from './kepatuhan/kpmr-kepatuhan/kpmr-kepatuhan.module';
import { ReputasiModule } from './reputasi/reputasi/reputasi.module';
import { KpmrReputasiModule } from './reputasi/kpmr-reputasi/kpmr-reputasi.module';
import { ResikoProfileRepositoryModule } from './resiko-profile-repository/resiko-profile-repository.module';
import { GeminiClassifierModule } from './gemini_classifier/gemini_classifier.module';
import { RasModule } from './ras/ras.module';

// import { PasarProdukKpmrModule } from './ojk/pasar-produk/pasar-produk-kpmr/pasar-produk-kpmr.module';
import { KpmrPasarModule } from './pasar/kpmr-pasar/kpmr-pasar.module';
import { LikuiditasProdukOjkModule } from './ojk/likuiditas-produk/likuiditas-produk-ojk/likuiditas-produk-ojk.module';
import { LikuiditasKpmrModule } from './ojk/likuiditas-produk/likuiditas-produk-kpmr/likuiditas-produk-kpmr.module';
import { KreditProdukOjkModule } from './ojk/kredit-produk/kredit-produk-ojk/kredit-produk-ojk.module';
import { KreditProdukKpmrModule } from './ojk/kredit-produk/kredit-produk-kpmr/kredit-produk-kpmr.module';
import { KonsentrasiProdukOjkModule } from './ojk/konsentrasi-produk/konsentrasi-produk-ojk/konsentrasi-produk-ojk.module';
import { KonsentrasiProdukKpmrModule } from './ojk/konsentrasi-produk/konsentrasi-produk-kpmr/konsentrasi-produk-kpmr.module';
import { OperasionalOjkModule } from './ojk/operasional-ojk/operasional-ojk/operasional-ojk.module';
import { OperasionalKpmrOjkModule } from './ojk/operasional-ojk/operasional-kpmr-ojk/operasional-kpmr-ojk.module';
import { HukumOjkModule } from './ojk/hukum-ojk/hukum-ojk/hukum-ojk.module';
import { HukumKpmrOjkModule } from './ojk/hukum-ojk/hukum-kpmr-ojk/hukum-kpmr-ojk.module';
import { KepatuhanOjkModule } from './ojk/kepatuhan-ojk/kepatuhan-ojk/kepatuhan-ojk.module';
import { KepatuhanKpmrOjkModule } from './ojk/kepatuhan-ojk/kepatuhan-kpmr-ojk/kepatuhan-kpmr-ojk.module';
import { ReputasiOjkModule } from './ojk/reputasi-ojk/reputasi-ojk/reputasi-ojk.module';
import { ReputasiKpmrOjkModule } from './ojk/reputasi-ojk/reputasi-kpmr-ojk/reputasi-kpmr-ojk.module';
import { InvestasiOjkModule } from './ojk/investasi-ojk/investasi-ojk/investasi-ojk.module';
import { InvestasiKpmrOjkModule } from './ojk/investasi-ojk/investasi-kpmr-ojk/investasi-kpmr-ojk.module';
import { StrategisOjkModule } from './ojk/strategis-ojk/strategis-ojk/strategis-ojk.module';
import { StrategisKpmrOjkModule } from './ojk/strategis-ojk/strategis-kpmr-ojk/strategis-kpmr-ojk.module';
import { RentabilitasOjkModule } from './ojk/rentabilitas-ojk/rentabilitas-ojk/rentabilitas-ojk.module';
import { RentabilitasKpmrOjkModule } from './ojk/rentabilitas-ojk/rentabilitas-kpmr-ojk/rentabilitas-kpmr-ojk.module';
import { PasarProdukOjkModule } from './ojk/pasar-produk/pasar-produk-ojk/pasar-produk-ojk.module';
import { RekapData1Module } from './ojk/rekap-data/rekap-data-1/rekap-data-1.module';
import { RekapData2Module } from './ojk/rekap-data/rekap-data-2/rekap-data-2.module';
import { PasarProdukKpmrModule } from './ojk/pasar-produk/pasar-produk-kpmr/pasar-produk-kpmr.module';
import { Likuiditas } from './likuiditas/likuiditas/entities/likuiditas.entity';

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
    KpmrLikuiditasModule,
    LikuiditasKpmrModule,
    NewInvestasiModule,
    HukumModule,
    PasarProdukKpmrModule,
    KpmrHukumModule,
    StrategikModule,
    KpmrStratejikModule,
    KpmrOperasionalModule,
    KepatuhanModule,
    KpmrKepatuhanModule,
    ReputasiModule,
    KpmrPasarModule,
    KpmrReputasiModule,
    ResikoProfileRepositoryModule,
    GeminiClassifierModule,
    RasModule,
    PasarProdukOjkModule,
    LikuiditasProdukOjkModule,
    KreditProdukOjkModule,
    KreditProdukKpmrModule,
    KonsentrasiProdukOjkModule,
    KonsentrasiProdukKpmrModule,
    OperasionalOjkModule,
    OperasionalKpmrOjkModule,
    HukumOjkModule,
    HukumKpmrOjkModule,
    KepatuhanOjkModule,
    KepatuhanKpmrOjkModule,
    ReputasiOjkModule,
    ReputasiKpmrOjkModule,
    InvestasiOjkModule,
    InvestasiKpmrOjkModule,
    StrategisOjkModule,
    StrategisKpmrOjkModule,
    RentabilitasOjkModule,
    RentabilitasKpmrOjkModule,
    RekapData1Module,
    RekapData2Module,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
