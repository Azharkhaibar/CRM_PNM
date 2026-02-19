"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RasModule = void 0;
const common_1 = require("@nestjs/common");
const ras_service_1 = require("./ras.service");
const ras_controller_1 = require("./ras.controller");
const typeorm_1 = require("@nestjs/typeorm");
const ras_entity_1 = require("./entities/ras.entity");
let RasModule = class RasModule {
};
exports.RasModule = RasModule;
exports.RasModule = RasModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([ras_entity_1.RasData])],
        controllers: [ras_controller_1.RasController],
        providers: [ras_service_1.RasService],
        exports: [ras_service_1.RasService]
    })
], RasModule);
//# sourceMappingURL=ras.module.js.map