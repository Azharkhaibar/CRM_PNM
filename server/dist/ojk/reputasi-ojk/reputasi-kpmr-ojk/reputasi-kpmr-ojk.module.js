"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReputasiKpmrOjkModule = void 0;
const common_1 = require("@nestjs/common");
const reputasi_kpmr_ojk_service_1 = require("./reputasi-kpmr-ojk.service");
const reputasi_kpmr_ojk_controller_1 = require("./reputasi-kpmr-ojk.controller");
let ReputasiKpmrOjkModule = class ReputasiKpmrOjkModule {
};
exports.ReputasiKpmrOjkModule = ReputasiKpmrOjkModule;
exports.ReputasiKpmrOjkModule = ReputasiKpmrOjkModule = __decorate([
    (0, common_1.Module)({
        controllers: [reputasi_kpmr_ojk_controller_1.ReputasiKpmrOjkController],
        providers: [reputasi_kpmr_ojk_service_1.ReputasiKpmrOjkService],
    })
], ReputasiKpmrOjkModule);
//# sourceMappingURL=reputasi-kpmr-ojk.module.js.map