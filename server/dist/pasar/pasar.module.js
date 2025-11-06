"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasarModule = void 0;
const common_1 = require("@nestjs/common");
const pasar_service_1 = require("./pasar.service");
const pasar_controller_1 = require("./pasar.controller");
const typeorm_1 = require("@nestjs/typeorm");
const pasar_entity_1 = require("./entities/pasar.entity");
let PasarModule = class PasarModule {
};
exports.PasarModule = PasarModule;
exports.PasarModule = PasarModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([pasar_entity_1.Pasar])],
        controllers: [pasar_controller_1.PasarController],
        providers: [pasar_service_1.PasarService],
    })
], PasarModule);
//# sourceMappingURL=pasar.module.js.map