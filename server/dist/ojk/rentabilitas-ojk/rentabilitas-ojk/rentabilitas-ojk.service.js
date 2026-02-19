"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentabilitasOjkService = void 0;
const common_1 = require("@nestjs/common");
let RentabilitasOjkService = class RentabilitasOjkService {
    create(createRentabilitasOjkDto) {
        return 'This action adds a new rentabilitasOjk';
    }
    findAll() {
        return `This action returns all rentabilitasOjk`;
    }
    findOne(id) {
        return `This action returns a #${id} rentabilitasOjk`;
    }
    update(id, updateRentabilitasOjkDto) {
        return `This action updates a #${id} rentabilitasOjk`;
    }
    remove(id) {
        return `This action removes a #${id} rentabilitasOjk`;
    }
};
exports.RentabilitasOjkService = RentabilitasOjkService;
exports.RentabilitasOjkService = RentabilitasOjkService = __decorate([
    (0, common_1.Injectable)()
], RentabilitasOjkService);
//# sourceMappingURL=rentabilitas-ojk.service.js.map