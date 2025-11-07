"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikuiditasModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const likuidita_entity_1 = require("./entities/likuidita.entity");
const likuiditas_service_1 = require("./likuiditas.service");
const likuiditas_controller_1 = require("./likuiditas.controller");
let LikuiditasModule = class LikuiditasModule {
};
exports.LikuiditasModule = LikuiditasModule;
exports.LikuiditasModule = LikuiditasModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([likuidita_entity_1.Likuiditas])],
        controllers: [likuiditas_controller_1.LikuiditasController],
        providers: [likuiditas_service_1.LikuiditasService],
        exports: [typeorm_1.TypeOrmModule],
    })
], LikuiditasModule);
//# sourceMappingURL=likuiditas.module.js.map