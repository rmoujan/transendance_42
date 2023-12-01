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
import { AuthGuard } from "@nestjs/passport";
import { JwtService } from "../auth/jwt/jwtservice.service";
import { JwtAuthGuard } from "../auth/jwt/JwtGuard";
import { PrismaService } from "src/prisma.service";
import { NumberDto } from "./utils/numberDto";
import { NumberDtoO } from "./utils/NumberDtoO";
import { ConfigService } from "@nestjs/config";

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
    try {
      const accessToken = this.jwt.sign(req.user);
      res
        .cookie(this.config.get("cookie"), accessToken, {
          httponly: true,
        })
        .status(200);
      const user = await this.prisma.user.findUnique({
        where: { id_user: req.user.id },
      });
      if (user.TwoFactor) {
        res.redirect(this.config.get("AuthenticationPath"));
        return req;
      }
      if (user.IsFirstTime) {
        await this.prisma.user.update({
          where: { id_user: req.user.id },
          data: { IsFirstTime: false },
        });
        res.redirect(this.config.get("settingsPath"));
      } else {
        res.redirect(this.config.get("homepath"));
      }
      return req;
    } catch (error) {}
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
    if (msg == null) return null;
    return msg.msg;
  }

  /************************************** */

  @Post("add-friends")
  async Insert_Friends(@Body() body: NumberDtoO, @Req() req) {
    try {
      const decoded = this.jwt.verify(req.cookies[this.config.get("cookie")]);
      await this.prisma.user.update({
        where: { id_user: decoded.id },
        data: {
          freind: {
            create: {
              id_freind: body.id_user,
            },
          },
        },
      });
      await this.prisma.user.update({
        where: { id_user: body.id_user },
        data: {
          freind: {
            create: {
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
    } catch (err) {}
  }

  /************************************** */

  @Post("remove-friends")
  async Remove_friends(@Body() Body: NumberDtoO, @Req() req) {
    try {
      const friendData = await this.prisma.user.findUnique({
        where: { id_user: Body.id_user },
      });
      const decoded = this.jwt.verify(req.cookies[this.config.get("cookie")]);
      const user = await this.prisma.freind.deleteMany({
        where: {
          AND: [{ userId: decoded.id }, { id_freind: Body.id_user }],
        },
      });
      await this.prisma.freind.deleteMany({
        where: {
          AND: [{ userId: Body.id_user }, { id_freind: decoded.id }],
        },
      });
    } catch (error) {}
  }

  /************************************** */

  @Post("Block-friends")
  async Block_friends(@Body() Body: NumberDtoO, @Req() req) {
    try {
      const friendData = await this.prisma.user.findUnique({
        where: { id_user: Body.id_user },
      });
      const decoded = this.jwt.verify(req.cookies[this.config.get("cookie")]);
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
    } catch (error) {}
  }

  @Post("DeBlock-friends")
  async DeBlock_friends(@Body() Body: NumberDtoO, @Req() req) {
    try {
      const decoded = this.jwt.verify(req.cookies[this.config.get("cookie")]);
      await this.prisma.blockedUser.deleteMany({
        where: {
          AND: [{ id_blocked_user: Body.id_user }, { userId: decoded.id }],
        },
      });
    } catch (error) {}
  }

  /************************************** */

  @Get("get-friendsList")
  async Get_FriendsList(@Req() req) {
    try {
      const decoded = this.jwt.verify(req.cookies[this.config.get("cookie")]);
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
        const OneFriend = await this.prisma.user.findUnique({
          where: { id_user: num },
        });

        const name = OneFriend.name;
        FriendList = { name: OneFriend };
      }
      const WantedObj = { AccountOwner: user, FriendList };
      const scoop = { FriendList };
      return scoop;
    } catch (error) {}
  }

  /************************************** */

  @Get("friends")
  @UseGuards(JwtAuthGuard)
  async only_friends(@Req() req) {
    try {
      const decoded = this.jwt.verify(req.cookies[this.config.get("cookie")]);
      const friends = await this.prisma.user.findUnique({
        where: { id_user: decoded.id },
        include: {
          freind: {
            select: { id_freind: true },
          },
        },
      });
      if (friends == null) return null;
      const obj = friends.freind;
      if (obj == null) return [];
      const idFriends = obj.map((scope) => scope.id_freind);
      if (idFriends.length == 0) return [];
      let array: any[] = [];

      for (const num of idFriends) {
        const OneFriend = await this.prisma.user.findUnique({
          where: { id_user: num },
          include: {
            history: true,
            achievments: true,
          },
        });
        array.push(OneFriend);
      }
      return array;
    } catch (error) {}
  }

  /************************************** */

  @Get("get-user")
  @UseGuards(JwtAuthGuard)
  async Get_User(@Req() req): Promise<any> {
    try {
      const decoded = this.jwt.verify(req.cookies[this.config.get("cookie")]);
      let obj: any[] = [];
      const user = await this.prisma.user.findUnique({
        where: { id_user: decoded.id },
      });
      obj.push(user);
      return obj;
    } catch (error) {}
  }

  /************************************** */

  @Get("get-all-users")
  @UseGuards(JwtAuthGuard)
  async Get_All_Users(@Req() req) {
    try {
      const users = await this.prisma.user.findMany({});
      return users;
    } catch (error) {}
  }

  /************************************** */

  @Post("TwoFactorAuth")
  async TwofactorAuth(@Body() body, @Req() req) {
    try {
      const decoded = this.jwt.verify(req.cookies[this.config.get("cookie")]);
      const user = await this.prisma.user.update({
        where: { id_user: decoded.id },
        data: {
          TwoFactor: body.enable,
        },
      });
    } catch (error) {}
  }
}
