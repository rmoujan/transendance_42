import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaService } from '../prisma.service';
import { JwtService } from '../auth/jwt/jwtservice.service';
import { UsersService } from 'src/users/users.service';
import { ChannelsService } from 'src/channel/channel.service';

@Module({
  providers: [ChatGateway, ChatService, PrismaService, JwtService, UsersService, ChannelsService],
  controllers: [ChatController]
})
export class ChatModule {}
