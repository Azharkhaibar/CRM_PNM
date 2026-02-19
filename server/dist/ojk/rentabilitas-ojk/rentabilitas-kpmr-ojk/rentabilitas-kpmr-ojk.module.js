"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentabilitasKpmrOjkModule = void 0;
const common_1 = require("@nestjs/common");
const rentabilitas_kpmr_ojk_service_1 = require("./rentabilitas-kpmr-ojk.service");
const rentabilitas_kpmr_ojk_controller_1 = require("./rentabilitas-kpmr-ojk.controller");
let RentabilitasKpmrOjkModule = class RentabilitasKpmrOjkModule {
};
exports.RentabilitasKpmrOjkModule = RentabilitasKpmrOjkModule;
exports.RentabilitasKpmrOjkModule = RentabilitasKpmrOjkModule = __decorate([
    (0, common_1.Module)({
        controllers: [rentabilitas_kpmr_ojk_controller_1.RentabilitasKpmrOjkController],
        providers: [rentabilitas_kpmr_ojk_service_1.RentabilitasKpmrOjkService],
    })
], RentabilitasKpmrOjkModule);
//# sourceMappingURL=rentabilitas-kpmr-ojk.module.js.map