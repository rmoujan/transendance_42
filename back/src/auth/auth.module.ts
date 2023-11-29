import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FortyTwoStrategy } from './utils/FortyTwoStrategy';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '../auth/jwt/jwtservice.service';
import { SessionSerializer } from './utils/Serializer';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  controllers: [AuthController],
  providers: [AuthService, FortyTwoStrategy, 
              PrismaService, JwtService,
              SessionSerializer],
})
export class AuthModule {}
