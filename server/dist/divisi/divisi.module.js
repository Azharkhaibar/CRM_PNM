"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DivisiModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const divisi_service_1 = require("./divisi.service");
const divisi_controller_1 = require("./divisi.controller");
const divisi_entity_1 = require("./entities/divisi.entity");
let DivisiModule = class DivisiModule {
};
exports.DivisiModule = DivisiModule;
exports.DivisiModule = DivisiModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([divisi_entity_1.Divisi])],
        controllers: [divisi_controller_1.DivisiController],
        providers: [divisi_service_1.DivisiService],
        exports: [divisi_service_1.DivisiService],
    })
], DivisiModule);
//# sourceMappingURL=divisi.module.js.map