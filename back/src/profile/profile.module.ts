import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '../auth/jwt/jwtservice.service';

@Module({
    providers: [ProfileService, PrismaService, JwtService],
    controllers: [ProfileController],
})
export class ProfileModule {}
