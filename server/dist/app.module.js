"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const db_config_1 = require("./config/db.config");
const pasar_module_1 = require("./pasar/pasar/pasar.module");
const likuiditas_module_1 = require("./likuiditas/likuiditas/likuiditas.module");
const operasional_module_1 = require("./operasional/operasional/operasional.module");
const divisi_module_1 = require("./divisi/divisi.module");
const notification_module_1 = require("./notification/notification.module");
const kpmr_investasi_module_1 = require("./investasi/kpmr-investasi/kpmr-investasi.module");
const audit_log_module_1 = require("./audit-log/audit-log.module");
const kpmr_likuiditas_module_1 = require("./likuiditas/kpmr-likuiditas/kpmr-likuiditas.module");
const new_investasi_module_1 = require("./investasi/new-investasi/new-investasi.module");
const hukum_module_1 = require("./hukum/hukum/hukum.module");
const kpmr_hukum_module_1 = require("./hukum/kpmr-hukum/kpmr-hukum.module");
const stratejik_module_1 = require("./stratejik/stratejik/stratejik.module");
const kpmr_stratejik_module_1 = require("./stratejik/kpmr-stratejik/kpmr-stratejik.module");
const kpmr_operasional_module_1 = require("./operasional/kpmr-operasional/kpmr-operasional.module");
const kepatuhan_module_1 = require("./kepatuhan/kepatuhan/kepatuhan.module");
const kpmr_kepatuhan_module_1 = require("./kepatuhan/kpmr-kepatuhan/kpmr-kepatuhan.module");
const reputasi_module_1 = require("./reputasi/reputasi/reputasi.module");
const kpmr_reputasi_module_1 = require("./reputasi/kpmr-reputasi/kpmr-reputasi.module");
const resiko_profile_repository_module_1 = require("./resiko-profile-repository/resiko-profile-repository.module");
const gemini_classifier_module_1 = require("./gemini_classifier/gemini_classifier.module");
const ras_module_1 = require("./ras/ras.module");
const kpmr_pasar_module_1 = require("./pasar/kpmr-pasar/kpmr-pasar.module");
const likuiditas_produk_ojk_module_1 = require("./ojk/likuiditas-produk/likuiditas-produk-ojk/likuiditas-produk-ojk.module");
const likuiditas_produk_kpmr_module_1 = require("./ojk/likuiditas-produk/likuiditas-produk-kpmr/likuiditas-produk-kpmr.module");
const kredit_produk_ojk_module_1 = require("./ojk/kredit-produk/kredit-produk-ojk/kredit-produk-ojk.module");
const kredit_produk_kpmr_module_1 = require("./ojk/kredit-produk/kredit-produk-kpmr/kredit-produk-kpmr.module");
const konsentrasi_produk_ojk_module_1 = require("./ojk/konsentrasi-produk/konsentrasi-produk-ojk/konsentrasi-produk-ojk.module");
const konsentrasi_produk_kpmr_module_1 = require("./ojk/konsentrasi-produk/konsentrasi-produk-kpmr/konsentrasi-produk-kpmr.module");
const operasional_ojk_module_1 = require("./ojk/operasional-ojk/operasional-ojk/operasional-ojk.module");
const operasional_kpmr_ojk_module_1 = require("./ojk/operasional-ojk/operasional-kpmr-ojk/operasional-kpmr-ojk.module");
const hukum_ojk_module_1 = require("./ojk/hukum-ojk/hukum-ojk/hukum-ojk.module");
const hukum_kpmr_ojk_module_1 = require("./ojk/hukum-ojk/hukum-kpmr-ojk/hukum-kpmr-ojk.module");
const kepatuhan_ojk_module_1 = require("./ojk/kepatuhan-ojk/kepatuhan-ojk/kepatuhan-ojk.module");
const kepatuhan_kpmr_ojk_module_1 = require("./ojk/kepatuhan-ojk/kepatuhan-kpmr-ojk/kepatuhan-kpmr-ojk.module");
const reputasi_ojk_module_1 = require("./ojk/reputasi-ojk/reputasi-ojk/reputasi-ojk.module");
const reputasi_kpmr_ojk_module_1 = require("./ojk/reputasi-ojk/reputasi-kpmr-ojk/reputasi-kpmr-ojk.module");
const investasi_ojk_module_1 = require("./ojk/investasi-ojk/investasi-ojk/investasi-ojk.module");
const investasi_kpmr_ojk_module_1 = require("./ojk/investasi-ojk/investasi-kpmr-ojk/investasi-kpmr-ojk.module");
const strategis_ojk_module_1 = require("./ojk/strategis-ojk/strategis-ojk/strategis-ojk.module");
const strategis_kpmr_ojk_module_1 = require("./ojk/strategis-ojk/strategis-kpmr-ojk/strategis-kpmr-ojk.module");
const rentabilitas_ojk_module_1 = require("./ojk/rentabilitas-ojk/rentabilitas-ojk/rentabilitas-ojk.module");
const rentabilitas_kpmr_ojk_module_1 = require("./ojk/rentabilitas-ojk/rentabilitas-kpmr-ojk/rentabilitas-kpmr-ojk.module");
const pasar_produk_ojk_module_1 = require("./ojk/pasar-produk/pasar-produk-ojk/pasar-produk-ojk.module");
const rekap_data_1_module_1 = require("./ojk/rekap-data/rekap-data-1/rekap-data-1.module");
const rekap_data_2_module_1 = require("./ojk/rekap-data/rekap-data-2/rekap-data-2.module");
const pasar_produk_kpmr_module_1 = require("./ojk/pasar-produk/pasar-produk-kpmr/pasar-produk-kpmr.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => (0, db_config_1.typeOrmConfig)(config),
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            pasar_module_1.PasarModule,
            likuiditas_module_1.LikuiditasModule,
            operasional_module_1.OperasionalModule,
            divisi_module_1.DivisiModule,
            notification_module_1.NotificationModule,
            kpmr_investasi_module_1.KpmrInvestasiModule,
            audit_log_module_1.AuditLogModule,
            kpmr_likuiditas_module_1.KpmrLikuiditasModule,
            likuiditas_produk_kpmr_module_1.LikuiditasKpmrModule,
            new_investasi_module_1.NewInvestasiModule,
            hukum_module_1.HukumModule,
            pasar_produk_kpmr_module_1.PasarProdukKpmrModule,
            kpmr_hukum_module_1.KpmrHukumModule,
            stratejik_module_1.StrategikModule,
            kpmr_stratejik_module_1.KpmrStratejikModule,
            kpmr_operasional_module_1.KpmrOperasionalModule,
            kepatuhan_module_1.KepatuhanModule,
            kpmr_kepatuhan_module_1.KpmrKepatuhanModule,
            reputasi_module_1.ReputasiModule,
            kpmr_pasar_module_1.KpmrPasarModule,
            kpmr_reputasi_module_1.KpmrReputasiModule,
            resiko_profile_repository_module_1.ResikoProfileRepositoryModule,
            gemini_classifier_module_1.GeminiClassifierModule,
            ras_module_1.RasModule,
            pasar_produk_ojk_module_1.PasarProdukOjkModule,
            likuiditas_produk_ojk_module_1.LikuiditasProdukOjkModule,
            kredit_produk_ojk_module_1.KreditProdukOjkModule,
            kredit_produk_kpmr_module_1.KreditProdukKpmrModule,
            konsentrasi_produk_ojk_module_1.KonsentrasiProdukOjkModule,
            konsentrasi_produk_kpmr_module_1.KonsentrasiProdukKpmrModule,
            operasional_ojk_module_1.OperasionalOjkModule,
            operasional_kpmr_ojk_module_1.OperasionalKpmrOjkModule,
            hukum_ojk_module_1.HukumOjkModule,
            hukum_kpmr_ojk_module_1.HukumKpmrOjkModule,
            kepatuhan_ojk_module_1.KepatuhanOjkModule,
            kepatuhan_kpmr_ojk_module_1.KepatuhanKpmrOjkModule,
            reputasi_ojk_module_1.ReputasiOjkModule,
            reputasi_kpmr_ojk_module_1.ReputasiKpmrOjkModule,
            investasi_ojk_module_1.InvestasiOjkModule,
            investasi_kpmr_ojk_module_1.InvestasiKpmrOjkModule,
            strategis_ojk_module_1.StrategisOjkModule,
            strategis_kpmr_ojk_module_1.StrategisKpmrOjkModule,
            rentabilitas_ojk_module_1.RentabilitasOjkModule,
            rentabilitas_kpmr_ojk_module_1.RentabilitasKpmrOjkModule,
            rekap_data_1_module_1.RekapData1Module,
            rekap_data_2_module_1.RekapData2Module,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map