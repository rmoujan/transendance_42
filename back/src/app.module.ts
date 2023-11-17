import { Module, Session } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
// import { PrismaModule } from './prisma.se';
import { JwtService } from './auth/jwt/jwtservice.service';
// import { PassportModule } from '@nestjs/passport';
import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';
import { ProfileModule } from './profile/profile.module';
import { JwtModule } from '@nestjs/jwt';
import { SocketGateway } from './socket/socket.gateway';
import { SocketModule } from './socket/socket.module';
import { AppGateway } from './app.gateway';
import { ChannelModule } from './channel/channel.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { ChannelsController } from './channel/channel.controller';
import { UsersController } from './users/users.controller';
import { ChannelsService } from './channel/channel.service';
import { UsersService } from './users/users.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [AuthModule,
            ProfileModule, JwtModule, SocketModule, ChannelModule, UsersModule, ChatModule, ChannelModule/*, JwtModule.register({
              secret: 'your-secret-key', // Replace with your secret key
              signOptions: { expiresIn: '1m' }, // Token expiration time            
            })*/],
  controllers: [AppController, AuthController,
                ProfileController,ChannelsController, UsersController],
  providers: [AppService, AuthService,
              JwtService, ProfileService, SocketGateway, AppGateway,PrismaService, ChannelsService, UsersService],
})


export class AppModule {}