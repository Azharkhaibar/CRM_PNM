"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikuiditasProdukOjkModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const likuiditas_produk_ojk_service_1 = require("./likuiditas-produk-ojk.service");
const likuiditas_produk_ojk_controller_1 = require("./likuiditas-produk-ojk.controller");
const likuiditas_produk_ojk_entity_1 = require("./entities/likuiditas-produk-ojk.entity");
const likuiditas_parameter_entity_1 = require("./entities/likuiditas-parameter.entity");
const likuditas_nilai_entity_1 = require("./entities/likuditas-nilai.entity");
const likuditas_inherent_refrences_entity_1 = require("./entities/likuditas-inherent-refrences.entity");
let LikuiditasProdukOjkModule = class LikuiditasProdukOjkModule {
};
exports.LikuiditasProdukOjkModule = LikuiditasProdukOjkModule;
exports.LikuiditasProdukOjkModule = LikuiditasProdukOjkModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                likuiditas_produk_ojk_entity_1.LikuiditasProdukOjk,
                likuiditas_parameter_entity_1.LikuiditasParameter,
                likuditas_nilai_entity_1.LikuiditasNilai,
                likuditas_inherent_refrences_entity_1.InherentReferenceLikuiditas,
            ]),
        ],
        controllers: [likuiditas_produk_ojk_controller_1.LikuiditasProdukOjkController],
        providers: [likuiditas_produk_ojk_service_1.LikuiditasProdukOjkService],
        exports: [likuiditas_produk_ojk_service_1.LikuiditasProdukOjkService],
    })
], LikuiditasProdukOjkModule);
//# sourceMappingURL=likuiditas-produk-ojk.module.js.map