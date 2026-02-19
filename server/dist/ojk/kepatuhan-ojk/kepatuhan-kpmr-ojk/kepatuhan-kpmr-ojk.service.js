"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KepatuhanKpmrOjkService = void 0;
const common_1 = require("@nestjs/common");
let KepatuhanKpmrOjkService = class KepatuhanKpmrOjkService {
    create(createKepatuhanKpmrOjkDto) {
        return 'This action adds a new kepatuhanKpmrOjk';
    }
    findAll() {
        return `This action returns all kepatuhanKpmrOjk`;
    }
    findOne(id) {
        return `This action returns a #${id} kepatuhanKpmrOjk`;
    }
    update(id, updateKepatuhanKpmrOjkDto) {
        return `This action updates a #${id} kepatuhanKpmrOjk`;
    }
    remove(id) {
        return `This action removes a #${id} kepatuhanKpmrOjk`;
    }
};
exports.KepatuhanKpmrOjkService = KepatuhanKpmrOjkService;
exports.KepatuhanKpmrOjkService = KepatuhanKpmrOjkService = __decorate([
    (0, common_1.Injectable)()
], KepatuhanKpmrOjkService);
//# sourceMappingURL=kepatuhan-kpmr-ojk.service.js.map