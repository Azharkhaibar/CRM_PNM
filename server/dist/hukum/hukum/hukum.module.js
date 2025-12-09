"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HukumModule = void 0;
const common_1 = require("@nestjs/common");
const hukum_service_1 = require("./hukum.service");
const hukum_controller_1 = require("./hukum.controller");
const typeorm_1 = require("@nestjs/typeorm");
const hukum_entity_1 = require("./entities/hukum.entity");
const hukum_section_entity_1 = require("./entities/hukum-section.entity");
let HukumModule = class HukumModule {
};
exports.HukumModule = HukumModule;
exports.HukumModule = HukumModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([hukum_entity_1.Hukum, hukum_section_entity_1.HukumSection])],
        controllers: [hukum_controller_1.HukumController],
        providers: [hukum_service_1.HukumService],
        exports: [hukum_service_1.HukumService],
    })
], HukumModule);
//# sourceMappingURL=hukum.module.js.map