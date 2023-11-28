import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  async uploadImage(
    avatar: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      if (!avatar) {
        reject('No image file');
      }
      if (!avatar.mimetype.includes('image')) {
        reject('File is not an image');
      }
      const modifiedFileName = `avatar_${Date.now()}_${
        avatar.originalname.split('.')[0]
      }.${avatar.mimetype.split('/')[1]}`;
      const upload = v2.uploader.upload_stream(
        {
          folder: 'avatars',
          public_id: modifiedFileName,
          format: 'webp',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      toStream(avatar.buffer).pipe(upload);
    });
  }
}
