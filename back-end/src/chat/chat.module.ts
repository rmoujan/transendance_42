import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaService } from '../prisma.service';
import { JwtService } from '../jwt/jwtservice.service';

@Module({
  providers: [ChatGateway, ChatService, PrismaService, JwtService],
  controllers: [ChatController]
})
export class ChatModule {}
