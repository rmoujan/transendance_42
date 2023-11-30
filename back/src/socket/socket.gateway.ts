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
    try{
      let cookieHeader;
      cookieHeader = client.handshake.headers.cookie;
      if (cookieHeader == undefined) return null;
      const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
        const [name, value] = cookie.trim().split("=");
        acc[name] = value;
        return acc;
      }, {});
      const specificCookie = cookies["cookie"];
      const decoded = this.jwt.verify(specificCookie);
      return decoded;
    }catch(error){}
  }

  afterInit(server: Server) {}

  @UseGuards(JwtAuthGuard)
  async handleConnection(client: Socket) {
    try {
      const decoded = this.decodeCookie(client);
      if (decoded == null) return;
      let user_id: number = decoded.id;
      this.SocketContainer.set(user_id, client.id);
    } catch (e) {}
  }

  async handleDisconnect(client: Socket) {
    try {
      const decoded = this.decodeCookie(client);
      if (decoded == null) return;
      this.SocketContainer.delete(decoded.id);
      const user = await this.prisma.user.update({
        where: { id_user: decoded.id },
        data: {
          status_user: "offline",
        },
      });
      this.server.emit("offline", { id_user: decoded.id });
    } catch (e) {}
  }

  @SubscribeMessage("userOnline")
  async handleUserOnline(client: Socket) {
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
    try{
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
    }catch(error){}
  }

  @SubscribeMessage("invite-game")
  async invite_game(@ConnectedSocket() client: Socket, @MessageBody() body) {
    try{

      const decoded = this.decodeCookie(client);
      const data = await this.prisma.user.findUnique({
        where: { id_user: decoded.id },
      });
      const notify = await this.prisma.notification.findFirst({
        where: { userId: body.id_user, id_user: decoded.id },
      });
      if (notify == null) {
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
          const sock = this.SocketContainer.get(body.id_user);
          this.server.to(sock).emit("notification");
        }
      }
    }catch(error){}
  }

  @SubscribeMessage("add-friend")
  async add_friend(@ConnectedSocket() client: Socket, @MessageBody() body) {
    try{

      const decoded = this.decodeCookie(client);
      const data = await this.prisma.user.findUnique({
        where: { id_user: decoded.id },
      });
      const notify = await this.prisma.notification.findFirst({
        where: { userId: body.id_user, id_user: decoded.id },
      });
      if (notify == null) {
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
      const sock = this.SocketContainer.get(body.id_user);
      this.server.to(sock).emit("notification");
    }catch(error){}
  }

  @SubscribeMessage("newfriend")
  async NewFriend(@ConnectedSocket() client: Socket, @MessageBody() body) {
    try{
      const decoded = this.decodeCookie(client);
      const sockrecv = this.SocketContainer.get(decoded.id);
      const socksend = this.SocketContainer.get(body);
      this.server.to(sockrecv).emit("RefreshFriends");
      this.server.to(sockrecv).emit("friendsUpdateChat");
      this.server.to(socksend).emit("RefreshFriends");
      this.server.to(socksend).emit("friendsUpdateChat");
    }catch(error){}
  }

  @SubscribeMessage("friends-list")
  async friends_list(@ConnectedSocket() client: Socket, @MessageBody() body) {
    try{
      const decoded = this.decodeCookie(client);
      const sockrecv = this.SocketContainer.get(decoded.id);
      const socksend = this.SocketContainer.get(body);
      this.server.to(sockrecv).emit("list-friends");
      this.server.to(sockrecv).emit("friendsUpdateChat");
      this.server.to(socksend).emit("list-friends");
      this.server.to(socksend).emit("friendsUpdateChat");
    }catch(error){}
  }
}
