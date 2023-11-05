import { Controller, Get,Post, Req,Body, UseGuards, Patch, Delete, ValidationPipe, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '../jwt/jwtservice.service';
import * as cookieParser from 'cookie-parser';
import * as cookie from 'cookie';

@Controller('chatData')
export class ChatController {
    constructor(private jwt:JwtService ,private readonly channelsService: ChatService, private readonly UsersService: UsersService) {}

    @Get('allConversationsDm')
    async getAllConversations(@Req() req)
    {
        const decode = this.jwt.verify(req.cookies['cookie']);
        const user = await this.UsersService.findById(decode.id);
        return this.channelsService.getAllConversations(user.id_user);
    }

    @Get('get-conversations')
    async getAllMessages(@Req() req, @Body('data') data: any)
    {
        // const decode = this.jwt.verify(req.cookies['cookie']);
        // const user = await this.UsersService.findById(decode.id);
        // console.log(`all Mesages dm is ${data}`)
        console.log('================================================')
        console.log(data);
        console.log('================================================')
        return this.channelsService.getAllMessages(data);
        
    }
    @Get('allMessagesRoom')
    async getAllMessagesRoom(@Req() req, @Body() data: any)
    {
        // const decode = this.jwt.verify(req.cookies['cookie']);
        // const user = await this.UsersService.findById(decode.id);
        return this.channelsService.getAllMessagesRoom(data.idRoom); 
    }

}
