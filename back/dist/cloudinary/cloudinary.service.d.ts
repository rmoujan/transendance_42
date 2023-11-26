/// <reference types="multer" />
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
export declare class CloudinaryService {
    uploadImage(avatar: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse>;
}
