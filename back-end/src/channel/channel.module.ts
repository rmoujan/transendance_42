import { Module } from '@nestjs/common';
import { ChannelsController } from './channel.controller';
import { ChannelsService } from './channel.service';
import { PrismaService } from '../prisma.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '../jwt/jwtservice.service';

@Module({
  controllers: [ChannelsController],
  providers: [ChannelsService, PrismaService, UsersService, JwtService],
})
export class ChannelModule {
}
