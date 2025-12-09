"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KpmrLikuiditasModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const kpmr_likuiditas_service_1 = require("./kpmr-likuiditas.service");
const kpmr_likuiditas_controller_1 = require("./kpmr-likuiditas.controller");
const kpmr_likuidita_entity_1 = require("./entities/kpmr-likuidita.entity");
let KpmrLikuiditasModule = class KpmrLikuiditasModule {
};
exports.KpmrLikuiditasModule = KpmrLikuiditasModule;
exports.KpmrLikuiditasModule = KpmrLikuiditasModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([kpmr_likuidita_entity_1.KpmrLikuiditas])],
        controllers: [kpmr_likuiditas_controller_1.KpmrLikuiditasController],
        providers: [kpmr_likuiditas_service_1.KpmrLikuiditasService],
        exports: [kpmr_likuiditas_service_1.KpmrLikuiditasService],
    })
], KpmrLikuiditasModule);
//# sourceMappingURL=kpmr-likuiditas.module.js.map