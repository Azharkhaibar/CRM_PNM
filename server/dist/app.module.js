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
const kpmr_pasar_module_1 = require("./pasar/kpmr-pasar/kpmr-pasar.module");
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
            kpmr_pasar_module_1.KpmrPasarModule,
            kpmr_likuiditas_module_1.KpmrLikuiditasModule,
            new_investasi_module_1.NewInvestasiModule,
            hukum_module_1.HukumModule,
            kpmr_hukum_module_1.KpmrHukumModule,
            stratejik_module_1.StratejikModule,
            kpmr_stratejik_module_1.KpmrStratejikModule,
            kpmr_operasional_module_1.KpmrOperasionalModule,
            kepatuhan_module_1.KepatuhanModule,
            kpmr_kepatuhan_module_1.KpmrKepatuhanModule,
            reputasi_module_1.ReputasiModule,
            kpmr_reputasi_module_1.KpmrReputasiModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map