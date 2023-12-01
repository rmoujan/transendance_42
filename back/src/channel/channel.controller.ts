// src/channels/channels.controller.ts
import { Controller, Get, Post, Req, Body, UseGuards, Patch, Delete, ValidationPipe } from '@nestjs/common';
import { ChannelsService } from './channel.service';
import { CreateChannelDto, CreateMemberDto, JoinChannelDto } from './dto/create-channel.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '../auth/jwt/jwtservice.service';
import * as cookieParser from 'cookie-parser';
import * as cookie from 'cookie';
import { ConfigService } from '@nestjs/config';

@Controller('channels')
export class ChannelsController {
  constructor(private jwt: JwtService,
    private readonly channelsService: ChannelsService,
    private readonly UsersService: UsersService,
    private config: ConfigService
    ) { }

  @Post('create')
  async create(@Req() req, @Body() data: any) {

    if (data)
    {
      if (!data.title || !data.members || !data.type)
      {
        return (false);
      }
      if (data.type === "protected")
      {
        if (!data.password)
        {
          return (false);
        }
      }
    }
    else
      return (false);
    try {
      const decode = this.jwt.verify(req.cookies[this.config.get('cookie')]);
      const user = await this.UsersService.findById(decode.id);
      if (user) {
        const channel = await this.channelsService.createChannel(data, user.id_user);
        if (channel)
          return (true);
        else
          return false;
      }
    } catch (error) {
      return { message: 'An error occurred', error: error.message };
    }
  }
  
  @Post('join')
  async join(@Req() req, @Body() data: any) {

    if (data)
    {
      if (!data.sendData.id_channel || !data.sendData.name || !data.sendData.visibility)
      {
        return (false);
      }
      if (data.sendData.visibility === "protected")
      {
        if (!data.sendData.password)
        {
          return (false);
        }
      }
    }
    else
      return (false);
    try {
      const decode = this.jwt.verify(req.cookies[this.config.get('cookie')]);
      const user = await this.UsersService.findById(decode.id);
      if (user) {
        const memberChannel = await this.channelsService.joinChannel(
          data,
          user.id_user,
        );
        if (memberChannel)
        {
          return (true);
        }
        else 
        {
          return (false);
        }
      }
      else
        return (false);
    } catch (error) {
      return (false);
    }
  }

  @Post('updatePass')
  async updatePass(@Req() req, @Body() data: any) {

    if (data)
    {
      if (!data.password || !data.channel_id || !data.user_id)
      {
        return (false);
      }
    }
    else
      return (false);
    try {
      const decode = this.jwt.verify(req.cookies[this.config.get('cookie')]);
      const user = await this.UsersService.findById(decode.id);

      if (user) {
        const updated = await this.channelsService.updatePass(data, user.id_user);
        if (updated)
          return (true);
        else
          return (false);
      }
      else  
        return (false);
    } catch (error) {
      return { message: 'An error occurred', error: error.message };
    }
  }

  @Post('removePass')
  async removePass(@Req() req, @Body() data: any) {

    if (data)
    {
      if (!data.id_channel || !data.user_id)
          return (false);
    }
    else
      return (false);
    try {
      const decode = this.jwt.verify(req.cookies[this.config.get('cookie')]);
      const user = await this.UsersService.findById(decode.id);

      if (user) {
        const remove = await this.channelsService.removePass(data, user.id_user);
        if (remove)
          return (true);
        else
          return (false);
      }
      else
        return (false);
    } catch (error) {
      return { message: 'An error occurred', error: error.message };
    }
  }


  @Post('setPass')
  async setPass(@Req() req, @Body() data: any) {

    if (data)
    {
      if (!data.password || !data.user_id || !data.channel_id)
      {
        return (false);
      }
    }
    else
      return (false);
    try {
      const decode = this.jwt.verify(req.cookies[this.config.get('cookie')]);
      const user = await this.UsersService.findById(decode.id);

      if (user) {
        const setch = await this.channelsService.setPass(data, user.id_user);
        if (setch)
        {
          return (true);
        }
        else
          return (false);
      }
      else
          return (false);
    } catch (error) {
      return { message: 'An error occurred', error: error.message };
    }
  }

  @Post('setAdmin')
  async setAdmin(@Req() req, @Body() data: any) {

    if (data)
    {
      if (!data.to || !data.channel_id || !data.from)
      {
        return (false);
      }
    }
    else
      return (false);
    try {
      const result = await this.channelsService.setAdmin(data);
      if (result)
        return (true);
      else
        return (false);
    } catch (error) {
      return { message: 'An error occurred', error: error.message };
    }
  }

  @Post('removeChannel')
  async removeChannel(@Req() req, @Body() data: any) {

    if (data)
    {
      if (!data.user_id || !data.channel_id)
      {
        return (false);
      }
    }
    else
      return (false);
    try {
      const user = await this.UsersService.findById(data.user_id);
      if (user) {
        const result = await this.channelsService.removeChannel(data, user.id_user);
        if (result)
          return (true);
        else
          return(false);
      }
    } catch (error) {
      return { message: 'An error occurred', error: error.message };
    }
  }

  @Get('allPublic')
  async getPublicChannels() {
    try {
      return this.channelsService.getPublicChannels();
    } catch (error) {
      return { message: 'An error occurred', error: error.message };
    }
  }

  @Get('allProtected')
  async getProtectedChannels() {
    try {
      return this.channelsService.getProtectedChannels();
    } catch (error) {
      return { message: 'An error occurred', error: error.message };
    }
  }

  @Get('allprivate')
  async getPrivateChannels() {
    try {
      return this.channelsService.getPrivateChannels();
    } catch (error) {
      return { message: 'An error occurred', error: error.message };
    }
  }

  @Get('allChannels')
  async getAllChannels(@Req() req, @Body() data: any) {
    try {

      const decode = this.jwt.verify(req.cookies[this.config.get('cookie')]);
      const user = await this.UsersService.findById(decode.id);
      const myAllChannels = await this.channelsService.getAllChannels(user.id_user);
      let message = "";
      let sent: Date | null = null;
      if (myAllChannels) {
        const arrayOfChannels = [];
        for (const channels of myAllChannels) {
          message = "";
          sent = null;
          const lastMsg = await this.channelsService.getTheLastMessageOfChannel(channels.channelId);
          if (lastMsg) {
            message = lastMsg.message;
            sent = lastMsg.dateSent;
          }
          const admins = await this.channelsService.getAllAdmins(channels.channelId);
          const memebers = await this.channelsService.getAllMembers(channels.channelId);
          const owners = await this.channelsService.getAllOwners(channels.channelId);
          const newCh = {
            channel_id: channels.channelId,
            image: channels.channel.img,
            name: channels.channel.name,
            owner: owners,
            admin: admins,
            members: memebers,
            last_messages: message,
            time: sent,
            unread: true,
            channel_type: channels.channel.visibility,
          };
          arrayOfChannels.push(newCh);
        }
        return arrayOfChannels;
      }
    } catch (error) {
      return { message: 'An error occurred', error: error.message };
    }
  }
}