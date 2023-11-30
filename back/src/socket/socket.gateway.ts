import { Headers, UseGuards } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JwtService } from "../auth/jwt/jwtservice.service";
import { PrismaService } from "src/prisma.service";
import { JwtAuthGuard } from "../auth/jwt/JwtGuard";

@WebSocketGateway({ namespace: "users" })
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private jwt: JwtService,
    private readonly prisma: PrismaService
  ) {}

  @WebSocketServer() server: Server;

  private SocketContainer = new Map();

  decodeCookie(client: any) {
    let cookieHeader;
    // console.log(client);
    cookieHeader = client.handshake.headers.cookie;
    if (cookieHeader == undefined) return null;
    // console.log(cookieHeader);
    const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split("=");
      acc[name] = value;
      return acc;
    }, {});
    const specificCookie = cookies["cookie"];
    // console.log(specificCookie);
    const decoded = this.jwt.verify(specificCookie);

    return decoded;
  }

  afterInit(server: Server) {}

  @UseGuards(JwtAuthGuard)
  async handleConnection(client: Socket) {
    // console.log('client ' + client.id + ' has conected');
    const decoded = this.decodeCookie(client);
    if (decoded == null) return;
    // console.log('hamdleconnection : ', decoded);
    let user_id: number = decoded.id;
    this.SocketContainer.set(user_id, client.id);
    try {
      // const user = await this.prisma.user.findUnique({where : {id_user : decoded.id},});
      // console.log(this.SocketContainer.keys());
      // this.server.emit("online", { id_user: decoded.id });
    } catch (e) {
      // console.log(e);
    }
    // console.log(user);
  }

  async handleDisconnect(client: Socket) {
    // console.log('client ' + client.id + ' has disconnected');
    const decoded = this.decodeCookie(client);
    if (decoded == null) return;
    // console.log('hamdleDisconnect : ', decoded);
    this.SocketContainer.delete(decoded.id);
    try {
      const user = await this.prisma.user.update({
        where: { id_user: decoded.id },
        data: {
          status_user: "offline",
        },
      });
      // console.log("ofliiiiiine" + user);
      this.server.emit("offline", { id_user: decoded.id });
      // console.log('hnaaaaa');
    } catch (e) {
      // console.log(e);
    }
    // console.log(user);
  }

  @SubscribeMessage("userOnline")
  async handleUserOnline(client: Socket) {
    // console.log('onliiiiiiiiiiiiiiine');
    try{
      const decoded = this.decodeCookie(client);
      if (decoded == null) return;
      await this.prisma.user.update({
        where: { id_user: decoded.id },
        data: {
          status_user: "online",
        },
      });
      this.server.emit("online", { id_user: decoded.id });
    }catch(error){}
  }

  @SubscribeMessage("userOffline")
  async handleUserOffline(client: Socket) {
    // console.log("offliiiiine");
    const decoded = this.decodeCookie(client);
    if (decoded == null) return;
    await this.prisma.user.update({
      where: { id_user: decoded.id },
      data: {
        status_user: "offline",
      },
    });
    const sockid = this.SocketContainer.get(decoded.id);

    this.server.emit("RefreshFriends");
    this.server.emit("list-friends");
  }

  @SubscribeMessage("message")
  handleMessage(@MessageBody() body): string {
    // console.log(body);
    return "Hello world!";
  }

  @SubscribeMessage("invite-game")
  async invite_game(@ConnectedSocket() client: Socket, @MessageBody() body) {
    const decoded = this.decodeCookie(client);
    console.log("inviiiiite to play");
    const data = await this.prisma.user.findUnique({
      where: { id_user: decoded.id },
    });
    // console.log("in game ", data.InGame);
    const notify = await this.prisma.notification.findFirst({
      where: { userId: body.id_user, id_user: decoded.id },
    });
    // const verify = notify.find((element) => { ((element.userId == body.id_user) && (element.GameInvitation == true)) })
    console.log('notiiify : ', notify);
    if (notify == null) {
      console.log('ingame : ', data.InGame);
      if (data.InGame == false) {
        const user = await this.prisma.user.update({
          where: { id_user: body.id_user },
          data: {
            notification: {
              create: {
                AcceptFriend: false,
                GameInvitation: true,
                id_user: decoded.id,
                avatar: data.avatar,
                name: data.name,
              },
            },
          },
        });
        console.log("bodyyyyy ", body);
        const sock = this.SocketContainer.get(body.id_user);
        console.log("sooock ", sock);
        this.server.to(sock).emit("notification");
      }
    }
  }

  @SubscribeMessage("add-friend")
  async add_friend(@ConnectedSocket() client: Socket, @MessageBody() body) {
    const decoded = this.decodeCookie(client);
    // console.log("hhdhdhdh"+body.id_user);
    const data = await this.prisma.user.findUnique({
      where: { id_user: decoded.id },
    });
    // console.log('hehehe');
    const notify = await this.prisma.notification.findFirst({
      where: { userId: body.id_user, id_user: decoded.id },
    });
    // console.log(notify);
    if (notify == null) {
      // console.log('heeeeere');
      const user = await this.prisma.user.update({
        where: { id_user: body.id_user },
        data: {
          notification: {
            create: {
              AcceptFriend: true,
              GameInvitation: false,
              id_user: decoded.id,
              avatar: data.avatar,
              name: data.name,
            },
          },
        },
      });
    }
    // console.log('hehehe');
    // const payload = await this.prisma.notification.findMany({where:{userId: body.id_user}});
    const sock = this.SocketContainer.get(body.id_user);
    this.server.to(sock).emit("notification");
  }
  //updat name

  @SubscribeMessage("newfriend")
  async NewFriend(@ConnectedSocket() client: Socket, @MessageBody() body) {
    // console.log(body);
    const decoded = this.decodeCookie(client);
    const sockrecv = this.SocketContainer.get(decoded.id);
    // const user = await this.prisma.user.findUnique({where:{id_user: decoded.id},include:{freind:true}});
    // const usersend = await this.prisma.user.findUnique({where:{id_user: body.id_user},include:{freind:true}});
    // console.log('newfriend recv : ' , user.freind, "newfriend send : ", usersend.freind);
    // console.log("right bar gatway ", body);
    const socksend = this.SocketContainer.get(body);
    this.server.to(sockrecv).emit("RefreshFriends");
    this.server.to(sockrecv).emit("friendsUpdateChat");
    this.server.to(socksend).emit("RefreshFriends");
    this.server.to(socksend).emit("friendsUpdateChat");
  }

  @SubscribeMessage("friends-list")
  async friends_list(@ConnectedSocket() client: Socket, @MessageBody() body) {
    const decoded = this.decodeCookie(client);
    // console.log("friends list : ", body);

    const sockrecv = this.SocketContainer.get(decoded.id);
    const socksend = this.SocketContainer.get(body);
    this.server.to(sockrecv).emit("list-friends");
    this.server.to(sockrecv).emit("friendsUpdateChat");

    this.server.to(socksend).emit("list-friends");
    this.server.to(socksend).emit("friendsUpdateChat");

  }
}
