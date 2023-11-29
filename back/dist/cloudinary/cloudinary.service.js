"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
const toStream = require("buffer-to-stream");
let CloudinaryService = class CloudinaryService {
    async uploadImage(avatar) {
        return new Promise((resolve, reject) => {
            if (!avatar) {
                reject('No image file');
            }
            if (!avatar.mimetype.includes('image')) {
                reject('File is not an image');
            }
            const modifiedFileName = `avatar_${Date.now()}_${avatar.originalname.split('.')[0]}.${avatar.mimetype.split('/')[1]}`;
            const upload = cloudinary_1.v2.uploader.upload_stream({
                folder: 'avatars',
                public_id: modifiedFileName,
                format: 'webp',
            }, (error, result) => {
                if (error)
                    return reject(error);
                resolve(result);
            });
            toStream(avatar.buffer).pipe(upload);
        });
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)()
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map