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
exports.GetUserDto = void 0;
const class_transformer_1 = require("class-transformer");
const get_auth_response_dto_1 = require("../../auth/dto/get-auth-response.dto");
class GetUserDto {
    user_id;
    username;
    gender;
    created_at;
    updated_at;
    deleted_at;
    auth;
}
exports.GetUserDto = GetUserDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], GetUserDto.prototype, "user_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GetUserDto.prototype, "username", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GetUserDto.prototype, "gender", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], GetUserDto.prototype, "created_at", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], GetUserDto.prototype, "updated_at", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], GetUserDto.prototype, "deleted_at", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => get_auth_response_dto_1.GetAuthResponseDto),
    __metadata("design:type", get_auth_response_dto_1.GetAuthResponseDto)
], GetUserDto.prototype, "auth", void 0);
//# sourceMappingURL=get-user.dto.js.map