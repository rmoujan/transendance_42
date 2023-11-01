import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FortyTwoStrategy } from './utils/FortyTwoStrategy';
// import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from 'src/jwt/jwtservice.service';
import { SessionSerializer } from './utils/Serializer';
import { JwtModule } from '@nestjs/jwt';

@Module({
//   imports: [JwtModule.register({
//     secret: 'asddfsdf5456dsf45ds', // Replace with your secret key
//     signOptions: {
//       expiresIn: '20s', // Token expiration time
//     },
//   }),
// ],
  imports: [JwtModule],
  controllers: [AuthController],
  providers: [AuthService, FortyTwoStrategy, 
               PrismaService, JwtService,
              SessionSerializer],
})
export class AuthModule {}
