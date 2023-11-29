import { Controller, Get,Post, Req,Body, UseGuards, Patch, Delete, ValidationPipe } from '@nestjs/common';
import { ChatService } from './chat.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '../auth/jwt/jwtservice.service';
import * as cookieParser from 'cookie-parser';
import * as cookie from 'cookie';

@Controller('chatData')
export class ChatController {
    constructor(private jwt:JwtService ,private readonly chatService: ChatService, private readonly UsersService: UsersService) {}

    @Get('allConversationsDm')
    async getAllConversations(@Req() req)
    {
        const decode = this.jwt.verify(req.cookies['cookie']);
        const user = await this.UsersService.findById(decode.id);
        return this.chatService.getAllConversations(user.id_user);
    }

    @Get('allMessagesDm')
    async getAllMessages(@Req() req, @Body() data: any)
    {
        // const decode = this.jwt.verify(req.cookies['cookie']);
        // const user = await this.UsersService.findById(decode.id);
        return this.chatService.getAllMessages(data.idDm);
        
    }
    @Get('allMessagesRoom')
    async getAllMessagesRoom(@Req() req, @Body() data: any)
    {
        // const decode = this.jwt.verify(req.cookies['cookie']);
        // const user = await this.UsersService.findById(decode.id);
        return this.chatService.getAllMessagesRoom(data.idRoom); 
    }

}
