"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperasionalKpmrModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const operasional_kpmr_aspek_entity_1 = require("./entities/operasional-kpmr-aspek.entity");
const operasional_kpmr_pertanyaan_entity_1 = require("./entities/operasional-kpmr-pertanyaan.entity");
const operasional_kpmr_ojk_entity_1 = require("./entities/operasional-kpmr-ojk.entity");
const operasional_kpmr_ojk_controller_1 = require("./operasional-kpmr-ojk.controller");
const operasional_kpmr_ojk_service_1 = require("./operasional-kpmr-ojk.service");
let OperasionalKpmrModule = class OperasionalKpmrModule {
};
exports.OperasionalKpmrModule = OperasionalKpmrModule;
exports.OperasionalKpmrModule = OperasionalKpmrModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                operasional_kpmr_ojk_entity_1.KpmrOperasionalOjk,
                operasional_kpmr_aspek_entity_1.KpmrAspekOperasional,
                operasional_kpmr_pertanyaan_entity_1.KpmrPertanyaanOperasional,
            ]),
        ],
        controllers: [operasional_kpmr_ojk_controller_1.KpmrOperasionalController],
        providers: [operasional_kpmr_ojk_service_1.KpmrOperasionalService],
        exports: [operasional_kpmr_ojk_service_1.KpmrOperasionalService],
    })
], OperasionalKpmrModule);
//# sourceMappingURL=operasional-kpmr-ojk.module.js.map