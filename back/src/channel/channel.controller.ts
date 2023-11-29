// src/channels/channels.controller.ts
import { Controller, Get, Post, Req, Body, UseGuards, Patch, Delete, ValidationPipe } from '@nestjs/common';
import { ChannelsService } from './channel.service';
import { CreateChannelDto, CreateMemberDto, JoinChannelDto } from './dto/create-channel.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '../auth/jwt/jwtservice.service';
import * as cookieParser from 'cookie-parser';
import * as cookie from 'cookie';

@Controller('channels')
export class ChannelsController {
  constructor(private jwt: JwtService, private readonly channelsService: ChannelsService, private readonly UsersService: UsersService) { }

  @Post('create')
  async create(@Req() req, @Body() data: CreateChannelDto) {

    console.log("-------------------------- Starting Creating a Channel -------------------------- ");
    console.log(data);

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
      const decode = this.jwt.verify(req.cookies['cookie']);
      // console.log(decode);
      const user = await this.UsersService.findById(decode.id);
      if (user) {
        const channel = await this.channelsService.createChannel(data, user.id_user);
        console.log(channel)
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
    console.log("-------------------------- Starting Joining a Channel  -------------------------- ");
    console.log(data);
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
      const decode = this.jwt.verify(req.cookies['cookie']);
      // console.log(decode);
      // console.log("----------------");
      const user = await this.UsersService.findById(decode.id);
      if (user) {
        // console.log(user);
        const memberChannel = await this.channelsService.joinChannel(
          data,
          user.id_user,
        );
        // console.log(memberChannel);
        // console.log("end joing chanel 1");
        if (memberChannel)
        {
          console.log("operation accomplished successfully");
          return (true);
        }
        else 
        {
          console.log("operation does not accomplished successfully");
          return (false);
        }
      }
      else
        return (false);
    } catch (error) {
      // console.log(error.message);
      // console.log("ooooooooooooooooooooooooooooooooooooooooooooo");
      // return { message: 'An error occurred', error: error.message };
      return (false);
    }
  }

  @Post('updatePass')
  async updatePass(@Req() req, @Body() data: any) {

    console.log("-------------------------- UPDATE PASSWORD  -------------------------- ");
    console.log(data);
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
      const decode = this.jwt.verify(req.cookies['cookie']);
      const user = await this.UsersService.findById(decode.id);

      if (user) {
        const updated = await this.channelsService.updatePass(data, user.id_user);
        if (updated)
          return (true);
        else
          return false;
      }
      else  
        return false;
    } catch (error) {
      console.log(error.message);
      return { message: 'An error occurred', error: error.message };
    }
  }

  @Post('removePass')
  async removePass(@Req() req, @Body() data: any) {
    console.log("-------------------------- REMOVE PASSWORD  -------------------------- ");
    console.log(data);
    // { id_channel: 10, user_id: 90652 }
    if (data)
    {
      if (!data.id_channel || !data.user_id)
          return (false);
    }
    else
      return (false);
    try {
      const decode = this.jwt.verify(req.cookies['cookie']);
      const user = await this.UsersService.findById(decode.id);

      if (user) {
        const remove = await this.channelsService.removePass(data, user.id_user);
        if (remove)
          return (true);
        else
          return false;
      }
      else
        return false;
    } catch (error) {
      // console.log(error.message);
      return { message: 'An error occurred', error: error.message };
    }
  }


  @Post('setPass')
  async setPass(@Req() req, @Body() data: any) {
    console.log("-------------------------- SET PASSWORD  -------------------------- ");
    console.log(data);
    if (data)
    {
      if (!data.password || !data.user_id || !data.channel_id)
      {
        console.log("inside false");
        return (false);
      }
    }
    else
      return (false);
    try {
      const decode = this.jwt.verify(req.cookies['cookie']);
      const user = await this.UsersService.findById(decode.id);

      if (user) {
        const setch = await this.channelsService.setPass(data, user.id_user);
        if (setch)
        {
          console.log("set ch true", setch);
          return (true);
        }
        else
          return (false);
      }
      else
          return (false);
    } catch (error) {
      // console.log(error.message);
      return { message: 'An error occurred', error: error.message };
    }
  }
// weslt hena !!!!
  @Post('setAdmin')
  async setAdmin(@Req() req, @Body() data: any) {
    console.log("-------------------------- SET ADMIN  -------------------------- ");
    console.log(data);
    if (data)
    {
      if (!data.to || !data.channel_id || !data.from)
      {
        console.log("inside false");
        return (false);
      }
    }
    else
      return (false);
    // data li katsift ha hiya : { to: 90652, channel_id: 2 }
    try {
      const result = await this.channelsService.setAdmin(data);
      if (result)
        return (true);
      else
        return (false);
    } catch (error) {
      console.log(error.message);
      return { message: 'An error occurred', error: error.message };
    }
  }

  @Post('removeChannel')
  async removeChannel(@Req() req, @Body() data: any) {

    console.log("-------------------------- Remove Channel  -------------------------- ");
    console.log(data);
    // { user_id: 90652, channel_id: 28 }
    if (data)
    {
      if (!data.user_id || !data.channel_id)
      {
        console.log("inside false");
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
      console.log(error.message);
      return { message: 'An error occurred', error: error.message };
    }
  }

  @Get('allPublic')
  async getPublicChannels() {
    try {
      return this.channelsService.getPublicChannels();
    } catch (error) {
      console.log(error.message);
      return { message: 'An error occurred', error: error.message };
    }
  }

  @Get('allProtected')
  async getProtectedChannels() {
    try {
      return this.channelsService.getProtectedChannels();
    } catch (error) {
      console.log(error.message);
      return { message: 'An error occurred', error: error.message };
    }
  }

  @Get('allprivate')
  async getPrivateChannels() {
    try {
      return this.channelsService.getPrivateChannels();
    } catch (error) {
      console.log(error.message);
      return { message: 'An error occurred', error: error.message };
    }
  }

  // all channels , that a user inside them .
  @Get('allChannels')
  async getAllChannels(@Req() req, @Body() data: any) {
    console.log("-------------------------- all channels that a user inside them -------------------------- ");
    try {

      const decode = this.jwt.verify(req.cookies['cookie']);
      const user = await this.UsersService.findById(decode.id);
      const myAllChannels = await this.channelsService.getAllChannels(user.id_user);
      // console.log(myAllChannels);
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
        // console.log("¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤");
        // console.log(arrayOfChannels);
        return arrayOfChannels;
      }
    } catch (error) {
      // console.log(error.message);
      return { message: 'An error occurred', error: error.message };
    }
  }
  //  ENNNND OF END POINTS !!!!!
}