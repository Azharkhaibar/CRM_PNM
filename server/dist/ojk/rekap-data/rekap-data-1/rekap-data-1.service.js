"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RekapData1Service = void 0;
const common_1 = require("@nestjs/common");
let RekapData1Service = class RekapData1Service {
    create(createRekapData1Dto) {
        return 'This action adds a new rekapData1';
    }
    findAll() {
        return `This action returns all rekapData1`;
    }
    findOne(id) {
        return `This action returns a #${id} rekapData1`;
    }
    update(id, updateRekapData1Dto) {
        return `This action updates a #${id} rekapData1`;
    }
    remove(id) {
        return `This action removes a #${id} rekapData1`;
    }
};
exports.RekapData1Service = RekapData1Service;
exports.RekapData1Service = RekapData1Service = __decorate([
    (0, common_1.Injectable)()
], RekapData1Service);
//# sourceMappingURL=rekap-data-1.service.js.map