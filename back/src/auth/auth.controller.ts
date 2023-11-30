import {
  Controller,
  Get,
  UseGuards,
  Redirect,
  Post,
  Body,
  Res,
  Req,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { FortyTwoGuard } from "./utils/Guards";
import { AuthGuard } from "@nestjs/passport";
import { JwtService } from "../auth/jwt/jwtservice.service";
import { JwtAuthGuard } from "../auth/jwt/JwtGuard";
import { PrismaService } from "src/prisma.service";
import { authenticator } from "otplib";
import * as qrcode from "qrcode";
import { NumberDto } from "./utils/numberDto";
import { NumberDtoO } from "./utils/NumberDtoO";
import { ConfigService } from '@nestjs/config';

@Controller("auth")
export class AuthController {
  constructor(
    private service: AuthService,
    private jwt: JwtService,
    private readonly prisma: PrismaService,
    private config: ConfigService
  ) {}

  @Get("login/42")
  @UseGuards(AuthGuard("42"))
  Login() {}

  /************************************** */

  @Get("login/42/redirect")
  @UseGuards(AuthGuard("42"))
  async redirect(@Req() req: any, @Res() res: any) {
    console.log('alright');
    const accessToken = this.jwt.sign(req.user);
    // console.log(req.user);
    res
      .cookie(this.config.get('cookie'), accessToken /*, { maxage: 99999 , secure: false}*/, {
        httponly: true,
      })
      .status(200);
    const user = await this.prisma.user.findUnique({
      where: { id_user: req.user.id },
    });
    if (user.TwoFactor) {
      res.redirect(this.config.get('AuthenticationPath'));
      return req;
    }
    if (user.IsFirstTime) {
      //   console.log('first time');
      await this.prisma.user.update({
        where: { id_user: req.user.id },
        data: { IsFirstTime: false },
      });
      res.redirect(this.config.get('settingsPath'));
    } else {
      // console.log('not first time');
      res.redirect(this.config.get('homepath'));
    }
    // res.send('cookie well setted');
    return req;
  }
  /************************************** */

  @Get("get-session-token")
  // @UseGuards(JwtAuthGuard)
  getSessionToken(@Req() req) {
    const sessionToken = this.jwt.verify(req.cookies[this.config.get('cookie')]);
    return `Session Token: ${sessionToken}`;
  }

  /************************************** */

  @Get("get-qrcode")
  async GenerateQrCode(@Req() req) {
    const qrCodeDataURL = await this.service.GenerateQrCode(req);
    return qrCodeDataURL;
  }

  /************************************** */

  @Post("verify-qrcode")
  async Verify_QrCode(@Body() body: NumberDto, @Req() req) {
    const msg = await this.service.Verify_QrCode(body, req);
    if (msg == null)
      return (null);
    // if (msg.msg == "true") {
    //   const accessToken = this.jwt.sign(req.user);
    //   // console.log(req.user);
    //   res
    //     .cookie("cookie", accessToken /*, { maxage: 99999 , secure: false}*/, {
    //       httponly: true,
    //     })
    //     .status(200);
    // }
    return msg.msg;
  }


  // @Post("verify-2fa")
  // async Verify_2fa(@Body() body, @Req() req) {
  //   const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
  //   await this.prisma.user.update({
  //     where: { id_user: decoded.id },
  //     data: {
  //       ISVERIDIED: body.verify,
  //     },
  //   });
  // }

  /************************************** */

  @Post("add-friends")
  async Insert_Friends(@Body() body: NumberDtoO, @Req() req) {
    const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
    // console.log(body.id_user);
    try {
      await this.prisma.user.update({
        where: { id_user: decoded.id /*decoded.id*/ },
        data: {
          freind: {
            create: {
              // name: body.name,
              id_freind: body.id_user /* body.friend_id */,
            },
          },
        },
      });
      await this.prisma.user.update({
        where: { id_user: body.id_user },
        data: {
          freind: {
            create: {
              // name: body.name,
              id_freind: decoded.id,
            },
          },
        },
      });
      await this.prisma.notification.deleteMany({
        where: {
          AND: [{ userId: decoded.id }, { id_user: body.id_user }],
        },
      });
      const user = await this.prisma.user.findUnique({
        where: { id_user: decoded.id },
        include: { freind: true },
      });
      const otherUser = await this.prisma.user.findUnique({
        where: { id_user: body.id_user },
        include: { freind: true },
      });
      // console.log("adding friends");
      // console.log(user.freind);
      // console.log(otherUser.freind);
    } catch (err) {
      // console.log(err);
    }
  }

  /************************************** */

  @Post("remove-friends")
  async Remove_friends(@Body() Body: NumberDtoO, @Req() req) {
    const friendData = await this.prisma.user.findUnique({
      where: { id_user: Body.id_user },
    });
    const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
    // console.log(decoded);
    // console.log(friendData);
    const user = await this.prisma.freind.deleteMany({
      where: {
        AND: [{ userId: decoded.id }, { id_freind: /*2002*/ Body.id_user }], // leila needs to store the id of every single friend to use em
        // when removing some one from a user's data base
      },
    });
    await this.prisma.freind.deleteMany({
      where: {
        AND: [{ userId: Body.id_user }, { id_freind: decoded.id }],
      },
    });

    // console.log(user);
  }

  /************************************** */

  @Post("Block-friends")
  async Block_friends(@Body() Body: NumberDtoO, @Req() req) {
    const friendData = await this.prisma.user.findUnique({
      where: { id_user: Body.id_user },
    });
    const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
    // console.log(decoded);
    // console.log(friendData);
    const user = await this.prisma.user.update({
      where: { id_user: decoded.id },
      data: {
        blockedUser: {
          create: {
            id_blocked_user: Body.id_user,
          },
        },
      },
    });
    this.Remove_friends(Body, req);
    // console.log(user);
  }

  @Post("DeBlock-friends")
  async DeBlock_friends(@Body() Body: NumberDtoO, @Req() req) {
    const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);

    await this.prisma.blockedUser.deleteMany({
      where: {
        AND: [{ id_blocked_user: Body.id_user }, { userId: decoded.id }],
      },
    });
  }

  /************************************** */

  @Get("get-friendsList")
  async Get_FriendsList(@Req() req) {
    const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
    const user = await this.prisma.user.findUnique({
      where: { id_user: decoded.id },
    });

    const friends = await this.prisma.user.findUnique({
      where: { id_user: decoded.id },
      include: {
        freind: {
          select: { id_freind: true },
        },
      },
    });

    const obj = friends.freind;
    let FriendList = {};

    const idFriends = obj.map((scope) => scope.id_freind);
    for (const num of idFriends) {
      // console.log(num);
      const OneFriend = await this.prisma.user.findUnique({
        where: { id_user: num },
      });

      const name = OneFriend.name;
      FriendList = { name: OneFriend };
    }
    const WantedObj = { AccountOwner: user, FriendList };
    const scoop = { FriendList };
    // console.log(scoop);
    return scoop;
  }

  /************************************** */

  @Get("friends")
  @UseGuards(JwtAuthGuard)
  async only_friends(@Req() req) {
    const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
    // const user = await this.prisma.user.findUnique({where:{id_user : decoded.id},});

    const friends = await this.prisma.user.findUnique({
      where: { id_user: decoded.id },
      include: {
        freind: {
          select: { id_freind: true },
        },
      },
    });
    // if No friend at first return (NULL)
    // console.log(friends);
    if (friends == null) return null;
    const obj = friends.freind;
    if (obj == null) return [];
    const idFriends = obj.map((scope) => scope.id_freind);
    if (idFriends.length == 0) return [];
    let array: any[] = [];
    // console.log('idFriends : ' + idFriends);

    for (const num of idFriends) {
      // console.log('num : ' + num);
      const OneFriend = await this.prisma.user.findUnique({
        where: { id_user: num },
        include: {
          history: true,
          achievments: true,
        },
      });
      // console.log(OneFriend);
      array.push(OneFriend);
    }
    // console.log(array);
    return array;
  }

  /************************************** */

  @Get("get-user")
  @UseGuards(JwtAuthGuard)
  async Get_User(@Req() req): Promise<any> {
    const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
    // console.log(req.cookies[this.config.get('cookie')]);

    //   console.log(decoded);
    // console.log('hnaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    let obj: any[] = [];
    const user = await this.prisma.user.findUnique({
      where: { id_user: decoded.id },
    });
    obj.push(user);
    return obj;
  }
  /************************************** */
  //get all users except the one who is logged in
  @Get("get-all-users")
  @UseGuards(JwtAuthGuard)
  async Get_All_Users(@Req() req) {
    // const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
    // console.log(req.cookies[this.config.get('cookie')]);
    const users = await this.prisma.user.findMany({});
    // console.log('useeeeeeeeers');
    // console.log(users);
    return users;
  }
  /************************************** */

  @Post("TwoFactorAuth")
  async TwofactorAuth(@Body() body, @Req() req) {
	// if not cookie redirect
    const decoded = this.jwt.verify(req.cookies[this.config.get('cookie')]);
    const user = await this.prisma.user.update({
      where: { id_user: decoded.id },
      data: {
        TwoFactor: body.enable,
      },
    });
    // console.log(body.TwoFactor);
  }
}
