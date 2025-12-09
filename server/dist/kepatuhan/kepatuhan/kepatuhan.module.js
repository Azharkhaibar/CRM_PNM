"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KepatuhanModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const kepatuhan_service_1 = require("./kepatuhan.service");
const kepatuhan_controller_1 = require("./kepatuhan.controller");
const kepatuhan_entity_1 = require("./entities/kepatuhan.entity");
const kepatuhan_section_entity_1 = require("./entities/kepatuhan-section.entity");
let KepatuhanModule = class KepatuhanModule {
};
exports.KepatuhanModule = KepatuhanModule;
exports.KepatuhanModule = KepatuhanModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([kepatuhan_entity_1.Kepatuhan, kepatuhan_section_entity_1.KepatuhanSection])],
        controllers: [kepatuhan_controller_1.KepatuhanController],
        providers: [kepatuhan_service_1.KepatuhanService],
        exports: [kepatuhan_service_1.KepatuhanService],
    })
], KepatuhanModule);
//# sourceMappingURL=kepatuhan.module.js.map