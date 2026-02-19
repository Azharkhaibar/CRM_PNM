"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RekapData2Module = void 0;
const common_1 = require("@nestjs/common");
const rekap_data_2_service_1 = require("./rekap-data-2.service");
const rekap_data_2_controller_1 = require("./rekap-data-2.controller");
let RekapData2Module = class RekapData2Module {
};
exports.RekapData2Module = RekapData2Module;
exports.RekapData2Module = RekapData2Module = __decorate([
    (0, common_1.Module)({
        controllers: [rekap_data_2_controller_1.RekapData2Controller],
        providers: [rekap_data_2_service_1.RekapData2Service],
    })
], RekapData2Module);
//# sourceMappingURL=rekap-data-2.module.js.map