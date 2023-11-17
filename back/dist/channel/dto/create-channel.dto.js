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
exports.CreateDmDto = exports.joinDto = exports.CreateMemberDto = exports.CreateChannelDto = void 0;
const class_validator_1 = require("class-validator");
class CreateChannelDto {
}
exports.CreateChannelDto = CreateChannelDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Property must not be empty' }),
    (0, class_validator_1.Length)(5, 15),
    __metadata("design:type", String)
], CreateChannelDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Property must not be empty' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['public', 'private', 'protected']),
    __metadata("design:type", String)
], CreateChannelDto.prototype, "visibility", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.password !== undefined),
    (0, class_validator_1.Length)(5, 15),
    __metadata("design:type", String)
], CreateChannelDto.prototype, "password", void 0);
class CreateMemberDto {
}
exports.CreateMemberDto = CreateMemberDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateMemberDto.prototype, "id_channel", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemberDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemberDto.prototype, "visibility", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemberDto.prototype, "password", void 0);
class joinDto {
}
exports.joinDto = joinDto;
class CreateDmDto {
}
exports.CreateDmDto = CreateDmDto;
//# sourceMappingURL=create-channel.dto.js.map