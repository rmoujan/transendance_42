import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '../auth/jwt/jwtservice.service';
import { CloudinaryProvider } from 'src/cloudinary/cloudinary.controller';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, JwtService, CloudinaryProvider, CloudinaryService],
})
export class UsersModule {}