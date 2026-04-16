"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResikoProfileRepositoryModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const resiko_profile_repository_controller_1 = require("./resiko-profile-repository.controller");
const resiko_profile_repository_entity_1 = require("./entities/resiko-profile-repository.entity");
const resiko_profile_repository_service_1 = require("./resiko-profile-repository.service");
const kepatuhan_section_entity_1 = require("../kepatuhan/kepatuhan/entities/kepatuhan-section.entity");
const kepatuhan_entity_1 = require("../kepatuhan/kepatuhan/entities/kepatuhan.entity");
const new_investasi_entity_1 = require("../investasi/new-investasi/entities/new-investasi.entity");
const new_investasi_section_entity_1 = require("../investasi/new-investasi/entities/new-investasi-section.entity");
const likuiditas_entity_1 = require("../likuiditas/likuiditas/entities/likuiditas.entity");
const likuiditas_section_entity_1 = require("../likuiditas/likuiditas/entities/likuiditas-section.entity");
const operasional_entity_1 = require("../operasional/operasional/entities/operasional.entity");
const operasional_section_entity_1 = require("../operasional/operasional/entities/operasional-section.entity");
const hukum_entity_1 = require("../hukum/hukum/entities/hukum.entity");
const hukum_section_entity_1 = require("../hukum/hukum/entities/hukum-section.entity");
const stratejik_entity_1 = require("../stratejik/stratejik/entities/stratejik.entity");
const stratejik_section_entity_1 = require("../stratejik/stratejik/entities/stratejik-section.entity");
const reputasi_entity_1 = require("../reputasi/reputasi/entities/reputasi.entity");
const reputasi_section_entity_1 = require("../reputasi/reputasi/entities/reputasi-section.entity");
let ResikoProfileRepositoryModule = class ResikoProfileRepositoryModule {
};
exports.ResikoProfileRepositoryModule = ResikoProfileRepositoryModule;
exports.ResikoProfileRepositoryModule = ResikoProfileRepositoryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                resiko_profile_repository_entity_1.RiskProfileRepositoryView,
                kepatuhan_section_entity_1.KepatuhanSection,
                kepatuhan_entity_1.Kepatuhan,
                new_investasi_entity_1.Investasi,
                new_investasi_section_entity_1.InvestasiSection,
                likuiditas_entity_1.Likuiditas,
                likuiditas_section_entity_1.LikuiditasSection,
                operasional_entity_1.Operasional,
                operasional_section_entity_1.OperasionalSection,
                hukum_entity_1.Hukum,
                hukum_section_entity_1.HukumSection,
                stratejik_entity_1.Strategik,
                stratejik_section_entity_1.StrategikSection,
                kepatuhan_entity_1.Kepatuhan,
                kepatuhan_section_entity_1.KepatuhanSection,
                reputasi_entity_1.Reputasi,
                reputasi_section_entity_1.ReputasiSection,
            ]),
        ],
        controllers: [resiko_profile_repository_controller_1.ResikoProfileRepositoryController],
        providers: [resiko_profile_repository_service_1.ResikoProfileRepositoryService],
        exports: [resiko_profile_repository_service_1.ResikoProfileRepositoryService],
    })
], ResikoProfileRepositoryModule);
//# sourceMappingURL=resiko-profile-repository.module.js.map