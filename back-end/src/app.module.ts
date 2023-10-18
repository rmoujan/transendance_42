import { Module, Session } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { PrismaModule } from './prisma/prisma.module';
import { JwtService } from './jwt/jwtservice.service';
import { PassportModule } from '@nestjs/passport';
import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';
import { ProfileModule } from './profile/profile.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [AuthModule, PrismaModule,
            PassportModule.register({Session: true}),
            ProfileModule, JwtModule/*, JwtModule.register({
              secret: 'your-secret-key', // Replace with your secret key
              signOptions: { expiresIn: '1m' }, // Token expiration time            
            })*/],
  controllers: [AppController, AuthController,
                ProfileController],
  providers: [AppService, AuthService,
              JwtService, ProfileService],
})
export class AppModule {}