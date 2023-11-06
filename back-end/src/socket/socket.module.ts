import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { JwtService } from 'src/jwt/jwtservice.service';


@Module({
    providers: [SocketGateway, JwtService],
})

export class SocketModule {}