import { Module, Session } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { PrismaModule } from './prisma/prisma.module';
import { JwtService } from './jwt/jwtservice.service';
// import { PassportModule } from '@nestjs/passport';
import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';
import { ProfileModule } from './profile/profile.module';
import { JwtModule } from '@nestjs/jwt';
import { SocketGateway } from './socket/socket.gateway';
import { SocketModule } from './socket/socket.module';
import { AppGateway } from './app.gateway';

@Module({
  imports: [AuthModule, PrismaModule,
            ProfileModule, JwtModule, SocketModule/*, JwtModule.register({
              secret: 'your-secret-key', // Replace with your secret key
              signOptions: { expiresIn: '1m' }, // Token expiration time            
            })*/],
  controllers: [AppController, AuthController,
                ProfileController],
  providers: [AppService, AuthService,
              JwtService, ProfileService, SocketGateway, AppGateway],
})

export class AppModule {}