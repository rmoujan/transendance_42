import { Controller,
     Get,
      UseGuards,
       Redirect ,
        Post,
         Body,
          Res,
           Req} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FortyTwoGuard } from './utils/Guards';
import { AuthGuard } from "@nestjs/passport";
import { JwtService } from 'src/jwt/jwtservice.service';
import { JwtAuthGuard } from 'src/jwt/JwtGuard';
// import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaService } from '../prisma.service';

import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';

@Controller('auth')
export class AuthController {

    constructor(private service : AuthService, 
      private jwt:JwtService,
      private readonly prisma: PrismaService){}

    @Get('login/42')
    @UseGuards(AuthGuard('42'))
    Login(){}

    /************************************** */

    @Get('login/42/redirect')
    @UseGuards(AuthGuard('42'))
    async redirect(@Req() req:any, @Res() res:any){

      const accessToken = this.jwt.sign(req.user);
      // console.log(req.user);
      res.cookie('cookie', accessToken/*, { maxage: 99999 , secure: false}*/).status(200);
      const user = await this.prisma.user.findUnique({
        where : {id_user: req.user.id},
      });
      if (user.TwoFactor){
        res.redirect('http://localhost:5173/Authentication');
        return (req);
      }
      if (user.IsFirstTime){
        {
          console.log('first time');
          await this.prisma.user.update({where : { id_user : req.user.id }, data: {IsFirstTime: false}});
          res.redirect('http://localhost:5173/setting');
        }
      }
      else
      {
        console.log('not first time');
        res.redirect('http://localhost:5173/home');
      }
        // res.send('cookie well setted');

      return (req);
    }

    /************************************** */

    @Get('get-session-token')
    // @UseGuards(JwtAuthGuard)
    getSessionToken(@Req() req) {
      const sessionToken = this.jwt.verify(req.cookies['cookie']);
      return `Session Token: ${sessionToken}`;
    }

    /************************************** */

    @Get('get-qrcode')
    async GenerateQrCode(@Req() req){
      const qrCodeDataURL = await this.service.GenerateQrCode(req);
      return qrCodeDataURL;
    }

    /************************************** */

    @Post('verify-qrcode')
    async Verify_QrCode(@Body() body, @Req() req){

      const msg = await this.service.Verify_QrCode(body, req);
      return (msg.msg);

    }

    /************************************** */


    @Post('add-friends')
    async Insert_Friends(@Body() body, @Req() req){

      const decoded = this.jwt.verify(req.cookies['cookie']);

      const user = await this.prisma.user.update({
        where: {id_user: 90240/*decoded.id*/},
        data: {
          freind:{
            create:{
              // name : body.name,
              id_freind: 98853/* body.friend_id */,
            },
          },
        },
      });
    }


    /************************************** */


    @Post('remove-friends')
    async Remove_friends(@Body() Body, @Req() req){

      const friendData = await this.prisma.user.findUnique({where: {id_user: Body.id_user}});
      const decoded = this.jwt.verify(req.cookies['cookie']);
      // console.log(decoded);
      console.log(friendData);
      const user = await this.prisma.freind.deleteMany({
        where: {
          AND: [
            {userId: decoded.id},
            {id_freind: /*2002*/ Body.id_user},
          ] // leila needs to store the id of every single friend to use em 
            // when removing some one from a user's data base
         },
      })
      // console.log(user);
    }


    /************************************** */


    @Post('Block-friends')
    async Block_friends(@Body() Body, @Req() req){
      
        const friendData = await this.prisma.user.findUnique({where: {id_user: Body.id_user}});
        const decoded = this.jwt.verify(req.cookies['cookie']);
        // console.log(decoded);
        // console.log(friendData);
        const user = await this.prisma.user.update({
          where: {id_user: decoded.id},
          data :{
            blockedUser:{
              create:{
                id_blocked_user: Body.id_user,
              },
            },
            },
        });
        this.Remove_friends(Body, req);
        // console.log(user);
    }


    /************************************** */


    @Get('get-friendsList')
    async Get_FriendsList(@Req() req){

      const decoded = this.jwt.verify(req.cookies['cookie']);
      const user = await this.prisma.user.findUnique({where:{id_user : decoded.id},});

      const friends = await this.prisma.user.findUnique({
        where:{id_user : decoded.id},
        include: {
          freind: {
              select: {id_freind :true},
          }
        }
      });

      const obj = friends.freind;
      let FriendList = {};

      const idFriends = obj.map((scope => scope.id_freind));
      for (const num of idFriends){
        // console.log(num);
        const OneFriend = await this.prisma.user.findUnique({
          where: {id_user: num},
        });
        const name = OneFriend.name;
        FriendList = { name : OneFriend};
      }
      const WantedObj = {AccountOwner: user, FriendList}; 
      const scoop = {FriendList};
      // console.log(scoop);
      return (scoop);
    }


    /************************************** */


    @Get('friends')
    // @UseGuards(JwtAuthGuard)
    async only_friends(@Req() req){

      const decoded = this.jwt.verify(req.cookies['cookie']);
      // const user = await this.prisma.user.findUnique({where:{id_user : decoded.id},});

      const friends = await this.prisma.user.findUnique({
        where:{id_user : decoded.id},
        include: {
          freind: {
              select: {id_freind :true},
          }
        }
      });
      const obj = friends.freind;
      const idFriends = obj.map((scope => scope.id_freind));

      let array: any[] = [];

      for (const num of idFriends){
        // console.log(num);
        const OneFriend = await this.prisma.user.findUnique({
          where: {id_user: num},
        });
        // console.log(OneFriend);
        array.push(OneFriend);
      }
      // console.log(array);
      return array;

    }

    /************************************** */

    @Get('get-user')
    // @UseGuards(JwtAuthGuard)
    async Get_User(@Req() req){

      const decoded = this.jwt.verify(req.cookies['cookie']);
      // console.log(req.cookies['cookie']);

      // console.log(decoded);
      let obj: any[] = []
      const user = await this.prisma.user.findUnique({where:{id_user : decoded.id},});
      obj.push(user);
      return obj;
    }

    /************************************** */


    @Post('TwoFactorAuth')
    async TwofactorAuth(@Body() body, @Req() req){

      const decoded = this.jwt.verify(req.cookies['cookie']);
      const user = await this.prisma.user.update({
        where : {id_user : decoded.id},
        data :{
          TwoFactor: body.enable,
        },
      });
      // console.log(body.TwoFactor);
    }
}
