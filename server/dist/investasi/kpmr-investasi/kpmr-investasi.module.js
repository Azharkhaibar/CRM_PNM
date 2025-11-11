"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KpmrInvestasiModule = void 0;
const common_1 = require("@nestjs/common");
const kpmr_investasi_service_1 = require("./kpmr-investasi.service");
const kpmr_investasi_controller_1 = require("./kpmr-investasi.controller");
const typeorm_1 = require("@nestjs/typeorm");
const kpmr_investasi_entity_1 = require("./entities/kpmr-investasi.entity");
let KpmrInvestasiModule = class KpmrInvestasiModule {
};
exports.KpmrInvestasiModule = KpmrInvestasiModule;
exports.KpmrInvestasiModule = KpmrInvestasiModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([kpmr_investasi_entity_1.KpmrInvestasi])],
        controllers: [kpmr_investasi_controller_1.KpmrInvestasiController],
        providers: [kpmr_investasi_service_1.KpmrInvestasiService],
    })
], KpmrInvestasiModule);
//# sourceMappingURL=kpmr-investasi.module.js.map