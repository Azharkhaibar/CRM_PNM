"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAuthDto = void 0;
const class_transformer_1 = require("class-transformer");
class GetAuthDto {
    auth_id;
    email;
    hash_password;
    created_at;
    updated_at;
    deleted_at;
}
exports.GetAuthDto = GetAuthDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], GetAuthDto.prototype, "auth_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GetAuthDto.prototype, "email", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GetAuthDto.prototype, "hash_password", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], GetAuthDto.prototype, "created_at", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], GetAuthDto.prototype, "updated_at", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], GetAuthDto.prototype, "deleted_at", void 0);
//# sourceMappingURL=get-auth.dto.js.map