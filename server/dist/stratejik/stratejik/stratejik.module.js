"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StratejikModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const stratejik_service_1 = require("./stratejik.service");
const stratejik_controller_1 = require("./stratejik.controller");
const stratejik_entity_1 = require("./entities/stratejik.entity");
const stratejik_section_entity_1 = require("./entities/stratejik-section.entity");
let StratejikModule = class StratejikModule {
};
exports.StratejikModule = StratejikModule;
exports.StratejikModule = StratejikModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([stratejik_entity_1.Stratejik, stratejik_section_entity_1.StratejikSection])],
        controllers: [stratejik_controller_1.StratejikController],
        providers: [stratejik_service_1.StratejikService],
        exports: [stratejik_service_1.StratejikService],
    })
], StratejikModule);
//# sourceMappingURL=stratejik.module.js.map