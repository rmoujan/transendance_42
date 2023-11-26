import { PartialType } from '@nestjs/mapped-types';
import { CreateCloudinaryDto } from './create-cloudinary.dto';

export class UpdateCloudinaryDto extends PartialType(CreateCloudinaryDto) {}
