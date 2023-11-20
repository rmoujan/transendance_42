// src/channels/channels.controller.ts
import { Controller, Get, Post, Req, Body, UseGuards, Patch, Delete, ValidationPipe } from '@nestjs/common';
import { ChannelsService } from './channel.service';
import { CreateChannelDto, CreateMemberDto, joinDto } from './dto/create-channel.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '../auth/jwt/jwtservice.service';
import * as cookieParser from 'cookie-parser';
import * as cookie from 'cookie';

@Controller('channels')
export class ChannelsController {
  constructor(private jwt: JwtService, private readonly channelsService: ChannelsService, private readonly UsersService: UsersService) { }

  @Post('create')
  async create(@Req() req, @Body() data: any) {

    // console.log("-------------------------- Starting Creating a Channel -------------------------- ");
    // console.log(data);
    try {
      const decode = this.jwt.verify(req.cookies['cookie']);
      // console.log(decode);
      const user = await this.UsersService.findById(decode.id);
      if (user) {
        const channel = await this.channelsService.createChannel(data, user.id_user);
      }
      return (true);
    } catch (error) {
      console.log(error.message);
      return { message: 'An error occurred', error: error.message };
    }

  }
  @Post('join')
  async join(@Req() req, @Body() data: any) {
    // if (!CreateMemberDto.name) {
    //   throw new Error('Name is required');
    // }
    // console.log("-------------------------- Starting Joining a Channel  -------------------------- ");
    // console.log(data);
    // {
    //     // sendData: {
    //     //   id_channel: 16,
    //     //   name: '1337geeks',
    //     //   visibility: 'public',
    //     //   password: null
    //     // }
    // }
    try {
      const decode = this.jwt.verify(req.cookies['cookie']);
      const user = await this.UsersService.findById(decode.id);
      if (user) {
        const memberChannel = await this.channelsService.joinChannel(
          data,
          user.id_user,
        );
        // console.log("end joing chanel 1");

        return (true);
      }
    } catch (error) {
      // console.log(error.message);
      // console.log("ooooooooooooooooooooooooooooooooooooooooooooo");
      return { message: 'An error occurred', error: error.message };
    }
    // console.log("end joing chanel 2");
  }

  @Post('updatePass')
  async updatePass(@Req() req, @Body() data: any) {

    // console.log("-------------------------- UPDATE PASSWORD  -------------------------- ");
    // console.log(data);

    try {
      const decode = this.jwt.verify(req.cookies['cookie']);
      const user = await this.UsersService.findById(decode.id);

      if (user) {
        await this.channelsService.updatePass(data, user.id_user);
        return (true);
      }
    } catch (error) {
      console.log(error.message);
      return { message: 'An error occurred', error: error.message };
    }
  }

  @Post('removePass')
  async removePass(@Req() req, @Body() data: any) {
    // console.log("-------------------------- REMOVE PASSWORD  -------------------------- ");
    // console.log(data);
    try {
      const decode = this.jwt.verify(req.cookies['cookie']);
      const user = await this.UsersService.findById(decode.id);

      if (user) {
        await this.channelsService.removePass(data, user.id_user);
        return (true);
      }
    } catch (error) {
      console.log(error.message);
      return { message: 'An error occurred', error: error.message };
    }
  }


  @Post('setPass')
  async setPass(@Req() req, @Body() data: any) {
    console.log("-------------------------- SET PASSWORD  -------------------------- ");
    console.log(data);

    try {
      const decode = this.jwt.verify(req.cookies['cookie']);
      const user = await this.UsersService.findById(decode.id);

      if (user) {
        await this.channelsService.setPass(data, user.id_user);
        return (true);
      }
    } catch (error) {
      console.log(error.message);
      return { message: 'An error occurred', error: error.message };
    }
  }

  @Post('setAdmin')
  async setAdmin(@Req() req, @Body() data: any) {
    console.log("-------------------------- SET ADMIN  -------------------------- ");
    console.log(data);

    try {
      await this.channelsService.setAdmin(data);
      return (true);
    } catch (error) {
      console.log(error.message);
      return { message: 'An error occurred', error: error.message };
    }
  }

  @Post('removeChannel')
  async removeChannel(@Req() req, @Body() data: any) {

    console.log("-------------------------- SET ADMIN  -------------------------- ");
    console.log(data);

    try {
      const user = await this.UsersService.findById(data.user_id);
      if (user) {
        const result = await this.channelsService.removeChannel(data, user.id_user);
        return (true);
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

  // all channels , that a user inside them .
  @Get('allChannels')
  async getAllChannels(@Req() req, @Body() data: any) {
    // console.log("-------------------------- all channels that a user inside them -------------------------- ");
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
      console.log(error.message);
      return { message: 'An error occurred', error: error.message };
    }
  }
  //  ENNNND OF END POINTS !!!!!
}