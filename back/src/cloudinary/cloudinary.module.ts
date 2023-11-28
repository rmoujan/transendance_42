import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.controller';
import { CloudinaryService } from './cloudinary.service';

@Module({
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule { }
