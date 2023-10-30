import { Module, Session } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
// import { PrismaModule } from './prisma/prisma.module';
// import { PrismaService } from 'prisma.service';

import { JwtService } from './jwt/jwtservice.service';
import { PassportModule } from '@nestjs/passport';
import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';
import { ProfileModule } from './profile/profile.module';
import { JwtModule } from '@nestjs/jwt';

// For Chat :
import { ChannelModule } from './channel/channel.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { PrismaService } from './prisma.service';
import { ChannelsController } from './channel/channel.controller';
import { ChannelsService } from './channel/channel.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
  imports: [AuthModule,
            PassportModule.register({Session: true}),
            ProfileModule, JwtModule , ChannelModule, UsersModule, ChatModule, ChannelModule/*, JwtModule.register({
              secret: 'your-secret-key', // Replace with your secret key
              signOptions: { expiresIn: '1m' }, // Token expiration time            
            })*/],
  controllers: [AppController, AuthController,
                ProfileController, ChannelsController, UsersController],
  providers: [AppService, AuthService,
              JwtService, ProfileService, PrismaService, ChannelsService, UsersService],
})
export class AppModule {}