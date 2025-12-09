"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReputasiModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const reputasi_service_1 = require("./reputasi.service");
const reputasi_controller_1 = require("./reputasi.controller");
const reputasi_entity_1 = require("./entities/reputasi.entity");
const reputasi_section_entity_1 = require("./entities/reputasi-section.entity");
let ReputasiModule = class ReputasiModule {
};
exports.ReputasiModule = ReputasiModule;
exports.ReputasiModule = ReputasiModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([reputasi_entity_1.Reputasi, reputasi_section_entity_1.ReputasiSection])],
        controllers: [reputasi_controller_1.ReputasiController],
        providers: [reputasi_service_1.ReputasiService],
        exports: [reputasi_service_1.ReputasiService],
    })
], ReputasiModule);
//# sourceMappingURL=reputasi.module.js.map