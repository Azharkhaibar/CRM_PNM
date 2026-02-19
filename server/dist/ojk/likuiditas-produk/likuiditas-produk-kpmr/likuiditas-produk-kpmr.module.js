"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikuiditasKpmrModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const likuiditas_kpmr_aspek_entity_1 = require("./entities/likuiditas-kpmr-aspek.entity");
const likuiditas_kpmr_pertanyaan_entity_1 = require("./entities/likuiditas-kpmr-pertanyaan.entity");
const likuiditas_produk_ojk_entity_1 = require("./entities/likuiditas-produk-ojk.entity");
const likuiditas_produk_kpmr_controller_1 = require("./likuiditas-produk-kpmr.controller");
const likuiditas_produk_kpmr_service_1 = require("./likuiditas-produk-kpmr.service");
let LikuiditasKpmrModule = class LikuiditasKpmrModule {
};
exports.LikuiditasKpmrModule = LikuiditasKpmrModule;
exports.LikuiditasKpmrModule = LikuiditasKpmrModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                likuiditas_produk_ojk_entity_1.KpmrLikuiditas,
                likuiditas_kpmr_aspek_entity_1.KpmrAspekLikuiditas,
                likuiditas_kpmr_pertanyaan_entity_1.KpmrPertanyaanLikuiditas,
            ]),
            LikuiditasKpmrModule,
        ],
        controllers: [likuiditas_produk_kpmr_controller_1.KpmrLikuiditasController],
        providers: [likuiditas_produk_kpmr_service_1.KpmrLikuiditasService],
        exports: [likuiditas_produk_kpmr_service_1.KpmrLikuiditasService],
    })
], LikuiditasKpmrModule);
//# sourceMappingURL=likuiditas-produk-kpmr.module.js.map