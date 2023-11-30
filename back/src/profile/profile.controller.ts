import {
  UseInterceptors,
  UploadedFile,
  Controller,
  Req,
  Post,
  Get,
  Res,
  Body,
} from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateUserDto } from "./nameDto";
import { PrismaService } from "src/prisma.service";
import { JwtService } from "../auth/jwt/jwtservice.service";
import { ProfileDto } from "./AboutDto";
import { MixedDto } from "./BotDto";
import { BooleanDto } from "./ingameDto";
import { Infos } from "./infosDto";
import { ConfigService } from '@nestjs/config';

@Controller("profile")
export class ProfileController {
  constructor(
    private Profile: ProfileService,
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  @Post("modify-name")
  async Name_Modification(
    @Body() data: CreateUserDto,
    @Req() req: any,
    @Res() res: any
  ) {
    try{
      const value = await this.Profile.ModifyName(data, req, res);
      if (value == "P2002")
        res.status(400).json({ error: "name already exists" });
      else res.status(200).json({ msg: "name well setted" });
      return { msg: "i am in the pofile controller now" };
    }catch(error){}
  }

  @Post("modify-photo")
  @UseInterceptors(FileInterceptor("photo"))
  Photo__Modification(@UploadedFile() photo, @Req() req, @Res() res) {
    this.Profile.ModifyPhoto(photo, req, res);
  }

  @Post("About")
  async About_me(@Body() data: ProfileDto, @Req() req, @Res() res) {
    try{
      const payload = this.jwt.verify(req.cookies[this.config.get('cookie')]);
      const ab: string = data.About;
      await this.prisma.user.update({
        where: { id_user: payload.id },
        data: {
          About: ab,
        },
      });
    }catch(error){}
  }

  @Get("About")
  async Get_About(@Req() req) {
    try{
      const user = await this.Profile.About_me(req);
      return user.About;
    }catch(error){}
  }

  @Post("Bot-Pong")
  async VsBoot(@Req() req: any, @Body() body: MixedDto) {
    try{
      const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
      const user = await this.prisma.user.findUnique({
        where: { id_user: decoded.id },
      });
      let winspercent: number;
      let lossespercent: number;
      let progress: number;
      let gameP: number = user.games_played + 1;
      let gameW: number = user.WonBot;
      let gameL: number = user.LoseBot;
      let avatar: string = user.avatar;
      let name: string = user.name;
      if (body.won) {
        gameW++;
        progress = ((gameW - gameL) / gameP) * 100;
        progress = progress < 0 ? 0 : progress;
        winspercent = (gameW / gameP) * 100;
        lossespercent = (gameL / gameP) * 100;
        await this.prisma.user.update({
          where: { id_user: decoded.id },
          data: {
            WonBot: gameW,
            wins: gameW,
            games_played: gameP,
            Progress: progress,
            Wins_percent: winspercent,
            Losses_percent: lossespercent,
            history: {
              create: {
                winner: true,
                username: name,
                userscore: body.userScore,
                useravatar: avatar,
                enemyId: 9,
                enemyscore: body.botScore,
              },
            },
          },
        });
      } else {
        gameL++;
        progress = ((gameW - gameL) / gameP) * 100;
        progress = progress < 0 ? 0 : progress;
        winspercent = (gameW / gameP) * 100;
        lossespercent = (gameL / gameP) * 100;
        await this.prisma.user.update({
          where: { id_user: decoded.id },
          data: {
            LoseBot: gameL,
            losses: gameL,
            games_played: gameP,
            Progress: progress,
            Wins_percent: winspercent,
            Losses_percent: lossespercent,
            history: {
              create: {
                winner: false,
                username: name,
                userscore: body.userScore,
                useravatar: avatar,
                enemyId: 9,
                enemyscore: body.botScore,
              },
            },
          },
        });
      }
      if (gameW == 1) {
        await this.prisma.user.update({
          where: { id_user: decoded.id },
          data: {
            achievments: {
              create: {
                achieve: "won Bot",
                msg: "Wliti Bot",
              },
            },
          },
        });
      }
    }catch(error){}
  }

  @Get("NotFriends")
  async NotFriendsUsers(@Req() req) {
    try{
      const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
      if (decoded == null) return;
      const users = this.prisma.user.findMany({
        where: {
          NOT: {
            freind: {
              some: {
                id_freind: decoded.id,
              },
            },
          },
        },
      });
      const FinalUsers = (await users).filter((scope) => {
        if (scope.id_user != decoded.id) {
          return scope;
        }
      });
      return FinalUsers;
    }catch(error){}
  }

  @Get("Notifications")
  async GetNotifications(@Req() req) {
    try{
      const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
      if (decoded == null) return;
      const user = await this.prisma.user.findUnique({
        where: { id_user: decoded.id },
        include: {
          notification: true,
        },
      });
      if (user.notification == null) return [];
      return user.notification;
    }catch(error){}
  }

  @Get("TopThree")
  async TopThree(@Req() req) {
    try{
      const topUsers = await this.prisma.user.findMany({
        orderBy: [
          {
            Wins_percent: "desc",
          },
        ],
        take: 3,
      });
      return topUsers;
    }catch(error){}
  }

  @Get("Achievments")
  async Achievments(@Req() req) {
    try{
      const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
      if (decoded == null) return;
  
      const userAchievements = await this.prisma.achievments.findMany({
        where: {
          userId: decoded.id,
        },
      });
  
      return userAchievements;
    }catch(error){}
  }

  @Get("History")
  async History(@Req() req) {
    try{
      const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
      if (decoded == null) return;
  
      const user = await this.prisma.history.findMany({
        where: { userId: decoded.id },
      });
  
      return user;
    }catch(error){}
  }

  @Get("avatar")
  async GetAvatar(@Req() req) {
    try{
      const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
      if (decoded == null) return;
  
      const user = await this.prisma.user.findUnique({
        where: { id_user: decoded.id },
      });
      return user.avatar;
    }catch(error){}
  }

  @Post("Gamestatus")
  async Gamestatus(@Req() req, @Body() body: BooleanDto) {
    try{
      const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
      if (decoded == null) return;
  
      await this.prisma.user.update({
        where: { id_user: decoded.id },
        data: {
          InGame: body.status,
        },
      });
    }catch(error){}
  }

  @Post("gameinfos")
  async gameinfos(@Req() req, @Body() body: Infos) {
    try{
      const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
      if (decoded == null) return;
  
      await this.prisma.user.update({
        where: { id_user: decoded.id },
        data: {
          homies: body.homies,
          invited: body.invited,
          homie_id: body.homie_id,
        },
      });
      if (body.homies == true && body.invited == true) {
        await this.prisma.notification.deleteMany({
          where: {
            AND: [{ userId: decoded.id }, { GameInvitation: true }],
          },
        });
      }
    }catch(error){}
  }

  @Get("returngameinfos")
  async Returngameinfos(@Req() req) {
    try{
      const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
      if (decoded == null) return;
  
      const user = await this.prisma.user.findUnique({
        where: { id_user: decoded.id },
      });
      const obj = {
        homies: user.homies,
        invited: user.invited,
        homie_id: user.homie_id,
      };
      return obj;
    }catch(error){}
  }

  @Get("Logout")
  async Logout(@Req() req, @Res() res) {
      try{
        const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
        if (decoded == null) return;
    
        await this.prisma.user.update({
          where: { id_user: decoded.id },
          data: {
            status_user: "offline",
          },
        });
      }catch(error){}
    }

  @Get("deletecookie")
  deletecookie(@Res() res) {
    res.clearCookie("cookie");
    res.status(200).json({ msg: "cookie deleted" });
  }

  @Post("verifyOtp")
  async verify_Otp(@Body() body:any, @Req() req){
    try {
      const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
      await this.prisma.user.update({
        where:{id_user: decoded.id},
        data:{
          ISVERIDIED: body.verify,
        }
      });
    }
    catch(error){}
  }

  @Get("verifyOtp")
  async Get_Otp(@Req() req){
    try {
      const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
      const user = await this.prisma.user.findUnique({
        where:{id_user: decoded.id},
      });
      return ({verified: user.ISVERIDIED, TFA: user.TwoFactor});
    }
    catch(error){}
  }

  @Post('GameFlag')
  async GameFlag(@Req() req:any, @Body() body:any){
    try{
      const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
      await this.prisma.user.update({
        where:{id_user: decoded.id},
        data:{
          GameFlag: body.flag,
        },
      })
    }
    catch(error){}
  }

  @Get('GameFlag')
  async GetFalg(@Req() req:any){
    try{
      const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
      const user = await this.prisma.user.findUnique({where:{id_user: decoded.id}});
      return ({flag: user.GameFlag});
    }
    catch(error){}
  }

  @Get('ingame')
  async ingame(@Req() req){
    try {
      const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
      const user = await this.prisma.user.findUnique({where:{id_user: decoded.id}});
      return ({ingame: user.InGame});
    }catch(error){}
  }
}
