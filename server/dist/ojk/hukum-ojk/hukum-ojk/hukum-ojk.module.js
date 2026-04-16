"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HukumOjkModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const hukum_ojk_service_1 = require("./hukum-ojk.service");
const hukum_ojk_controller_1 = require("./hukum-ojk.controller");
const hukum_ojk_entity_1 = require("./entities/hukum-ojk.entity");
const hukum_paramater_entity_1 = require("./entities/hukum-paramater.entity");
const hukum_nilai_entity_1 = require("./entities/hukum-nilai.entity");
const hukum_inherent_references_entity_1 = require("./entities/hukum-inherent-references.entity");
let HukumOjkModule = class HukumOjkModule {
};
exports.HukumOjkModule = HukumOjkModule;
exports.HukumOjkModule = HukumOjkModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                hukum_ojk_entity_1.HukumOjk,
                hukum_paramater_entity_1.HukumParameter,
                hukum_nilai_entity_1.HukumNilai,
                hukum_inherent_references_entity_1.InherentReferenceHukum,
            ]),
        ],
        controllers: [hukum_ojk_controller_1.HukumOjkController],
        providers: [hukum_ojk_service_1.HukumOjkService],
        exports: [hukum_ojk_service_1.HukumOjkService],
    })
], HukumOjkModule);
//# sourceMappingURL=hukum-ojk.module.js.map