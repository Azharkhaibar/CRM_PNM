"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KreditProdukKpmrService = void 0;
const common_1 = require("@nestjs/common");
let KreditProdukKpmrService = class KreditProdukKpmrService {
    create(createKreditProdukKpmrDto) {
        return 'This action adds a new kreditProdukKpmr';
    }
    findAll() {
        return `This action returns all kreditProdukKpmr`;
    }
    findOne(id) {
        return `This action returns a #${id} kreditProdukKpmr`;
    }
    update(id, updateKreditProdukKpmrDto) {
        return `This action updates a #${id} kreditProdukKpmr`;
    }
    remove(id) {
        return `This action removes a #${id} kreditProdukKpmr`;
    }
};
exports.KreditProdukKpmrService = KreditProdukKpmrService;
exports.KreditProdukKpmrService = KreditProdukKpmrService = __decorate([
    (0, common_1.Injectable)()
], KreditProdukKpmrService);
//# sourceMappingURL=kredit-produk-kpmr.service.js.map