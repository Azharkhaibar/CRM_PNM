"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentabilitasProdukOjkModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const rentabilitas_ojk_entity_1 = require("./entities/rentabilitas-ojk.entity");
const rentabilitas_ojk_service_1 = require("./rentabilitas-ojk.service");
const rentabilitas_ojk_controller_1 = require("./rentabilitas-ojk.controller");
const rentabilitas_parameter_entity_1 = require("./entities/rentabilitas-parameter.entity");
const rentabilitas_nilai_entity_1 = require("./entities/rentabilitas-nilai.entity");
const rentabilitas_inherent_references_entity_1 = require("./entities/rentabilitas-inherent-references.entity");
let RentabilitasProdukOjkModule = class RentabilitasProdukOjkModule {
};
exports.RentabilitasProdukOjkModule = RentabilitasProdukOjkModule;
exports.RentabilitasProdukOjkModule = RentabilitasProdukOjkModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                rentabilitas_ojk_entity_1.RentabilitasProdukOjk,
                rentabilitas_parameter_entity_1.RentabilitasParameter,
                rentabilitas_nilai_entity_1.RentabilitasNilai,
                rentabilitas_inherent_references_entity_1.InherentReferenceRentabilitas,
            ]),
        ],
        controllers: [rentabilitas_ojk_controller_1.RentabilitasProdukOjkController],
        providers: [rentabilitas_ojk_service_1.RentabilitasProdukOjkService],
        exports: [rentabilitas_ojk_service_1.RentabilitasProdukOjkService],
    })
], RentabilitasProdukOjkModule);
//# sourceMappingURL=rentabilitas-ojk.module.js.map