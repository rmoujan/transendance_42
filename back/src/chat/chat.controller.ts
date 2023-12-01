import { Controller, Get,Post, Req,Body, UseGuards, Patch, Delete, ValidationPipe } from '@nestjs/common';
import { ChatService } from './chat.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '../auth/jwt/jwtservice.service';
import * as cookieParser from 'cookie-parser';
import * as cookie from 'cookie';
import { ConfigService } from '@nestjs/config';

@Controller('chatData')
export class ChatController {
    constructor(private jwt:JwtService ,
        private readonly chatService: ChatService,
        private readonly UsersService: UsersService,
        private config: ConfigService
        ) {}

    @Get('allConversationsDm')
    async getAllConversations(@Req() req)
    {
        try{

            const decode = this.jwt.verify(req.cookies[this.config.get('cookie')]);
            if (decode)
            {
                if (!decode.id)
                    return (false);
                const user = await this.UsersService.findById(decode.id);
                return this.chatService.getAllConversations(user.id_user);
            }
            else
                return (false);
        }
        catch (error) {
            return { message: 'An error occurred', error: error.message };
          }
    }

    @Get('allMessagesDm')
    async getAllMessages(@Req() req, @Body() data: any)
    {
        try{
            if (data)
            {
                if (!data.idDm)
                    return (false);
            }
            else
                return (false);
            return this.chatService.getAllMessages(data.idDm);   
        }
        catch (error) {
            return { message: 'An error occurred', error: error.message };
        }
    }
    @Get('allMessagesRoom')
    async getAllMessagesRoom(@Req() req, @Body() data: any)
    {
        try{
            if (data)
            {
                if (!data.idRoom)
                    return (false);
            }
            else
                return (false);
            return this.chatService.getAllMessagesRoom(data.idRoom); 
        }
        catch (error) {
            return { message: 'An error occurred', error: error.message };
        }
    }

}
