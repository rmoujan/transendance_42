// src/channels/channels.controller.ts
import { Controller, Get,Post, Req,Body, UseGuards, Patch, Delete, ValidationPipe } from '@nestjs/common';
import { ChannelsService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '../jwt/jwtservice.service';
import * as cookieParser from 'cookie-parser';
import * as cookie from 'cookie';
// import { Request, Response } from 'express';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // You might have an authentication guard.
// req.cookies is epmty
// the shape of data that sent from fron when creating new channel:
// {
  // title: 'morocoo',
  // members: [ 'name 1', 'name 2', 'name 3' ],
  // type: 'public'
// }
// 

@Controller('channels')
export class ChannelsController {
  constructor(private jwt:JwtService ,private readonly channelsService: ChannelsService, private readonly UsersService: UsersService) {}

  // @UseGuards(JwtAuthGuard) // Secure this endpoint with authentication.
  @Post('create')
  async create(@Req() req, @Body() data: any) {
    
    // the req decorator will contain the authenticated user.
    // Assuming you have a user service to get the authenticated user.
    //const user = await this.UsersService.findById(req.user.userId);
    // console.log(req.cookies); 
    // const id = req.cookies['me']; it show me undefined.
    console.log("------ Starting Creating a Channel ");
    console.log(data);
    console.log(data.title);
    console.log(data.password);
    console.log(data.type);
    console.log(`length of data.memebers is ${data.members.length}`);
    console.log(data.members[0]);
    console.log(req.cookies); 
    console.log("--------------------------");
   
    //to decode the req and get the id.
    const decode = this.jwt.verify(req.cookies['cookie']);
    console.log(decode);
    console.log(`id is ${decode.id}`);

    console.log("*****************");
    const user = await this.UsersService.findById(decode.id);
    console.log("##################");
    const channel = await this.channelsService.createChannel(data,user.id_user);
    // I think hena u must return a boolean true if the creation of channel is passed correct.
    console.log("End of Creating A Channel ");
    return true;
  }
  @Post('join')
  async join(@Req() req, @Body() data: any) {

    console.log("------ Starting Joining a Channel ");
    console.log(data.name);
    //to decode the req and get the id.
    const decode = this.jwt.verify(req.cookies['cookie']);
    console.log(decode);
    console.log(`id is ${decode.id}`);
    console.log("*****************");
    const user = await this.UsersService.findById(decode.id);
    const name = "Assila";
    const memberChannel = await this.channelsService.joinChannel(
      data,
      user.id_user,
    );

    return memberChannel;
  }
// must add DTO UPDATED.
  @Patch('updatePass')
  async updatePass(@Req() req, @Body() data: any)
  {
    // data that I expect are iduser , namechannel and newpass.

    const decode = this.jwt.verify(req.cookies['cookie']);
    const user = await this.UsersService.findById(decode.id);
    await this.channelsService.updatePass(data, user.id_user);

  }

  @Patch('removePass')
  async removePass(@Req() req, @Body() data: any)
  {
    console.log("removePass");
    // data that I expect are iduser , namechannel and newpass.

    const decode = this.jwt.verify(req.cookies['cookie']);
    const user = await this.UsersService.findById(decode.id);
    await this.channelsService.removePass(data, user.id_user);

  }
  @Patch('setPass')
  async setPass(@Req() req, @Body() data: any)
  {
    // I expect the password , namechannel and iduser.
    const decode = this.jwt.verify(req.cookies['cookie']);
    const user = await this.UsersService.findById(decode.id);

    await this.channelsService.setPass(data, user.id_user);

  }

  @Patch('setAdmin')
  async setAdmin(@Req() req, @Body() data: any)
  {
    // data I expect, iduser, secondiduser, namechannel.
    const decode = this.jwt.verify(req.cookies['cookie']);
    const user = await this.UsersService.findById(decode.id);
    
    const decode2 = this.jwt.verify(data.updated_user);
    const updatedUser = await this.UsersService.findById(decode2.id);

    await this.channelsService.setAdmin(data, user.id_user, updatedUser.id_user);

  }

  @Delete('kickUser')
  async kickUser(@Req() req, @Body() data: any){
    console.log("kickUser");
     // data I expect, iduser, secondiduser, namechannel.
    const decode = this.jwt.verify(req.cookies['cookie']);
    const user = await this.UsersService.findById(decode.id);
    
    const decode2 = this.jwt.verify(data.updated_user);
    const updatedUser = await this.UsersService.findById(decode2.id);
    await this.channelsService.kickUser(data, user.id_user, updatedUser.id_user);
  }

  @Patch('banUser')
  async banUser(@Req() req, @Body() data: any){

    console.log("bannedUser");
    // data I expect, iduser, secondiduser, namechannel.
    const decode = this.jwt.verify(req.cookies['cookie']);
    const user = await this.UsersService.findById(decode.id);
    
    const decode2 = this.jwt.verify(data.updated_user);
    const updatedUser = await this.UsersService.findById(decode2.id);
    await this.channelsService.banUser(data, user.id_user, updatedUser.id_user);
  }
  
  @Patch('muteUser')
  async muteUser(@Req() req, @Body() data: any){

    // data that I expect name channel , iduser secondiduser, duration of muting 
    console.log("mutedUser");
    const decode = this.jwt.verify(req.cookies['cookie']);
    const user = await this.UsersService.findById(decode.id);
    
    const decode2 = this.jwt.verify(data.updated_user);
    const updatedUser = await this.UsersService.findById(decode2.id);
    const period : Date = new Date();
    await this.channelsService.muteUser(data, user.id_user, updatedUser.id_user);
  }

  @Get('allPublic')
  async getPublicChannels()
  {
    return this.channelsService.getPublicChannels();
  }
  @Get('allProtected')
  async getProtectedChannels()
  {
    return this.channelsService.getProtectedChannels();
  }
}
