import { Headers , UseGuards} from '@nestjs/common';
import {ConnectedSocket, MessageBody, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server ,Socket} from 'socket.io';
import { JwtService } from 'src/jwt/jwtservice.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from 'src/jwt/JwtGuard';

@WebSocketGateway({namespace: 'users'})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  
  constructor(private jwt :JwtService, private readonly prisma: PrismaService){}

  @WebSocketServer() server: Server;

  private SocketContainer = new Map();

	decodeCookie(client: any) {
		let cookieHeader;
    // console.log(client);
		cookieHeader = client.handshake.headers.cookie;
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

  afterInit(server: Server) {
  
  }

  @UseGuards(JwtAuthGuard)
  async handleConnection(client: Socket) {

    console.log('client ' + client.id + ' has conected');
    const decoded = this.decodeCookie(client);
    // console.log(decoded);
    let user_id:number = decoded.id;
    this.SocketContainer.set(user_id, client.id);
    const user = await this.prisma.user.update({
      where : {id_user : decoded.id},
      data :{
        status_user : "online",
      },
    });
    console.log(this.SocketContainer.keys());
    // console.log(user);
  }

  async handleDisconnect(client: Socket) {
    console.log('client ' + client.id + ' has disconnected');
    const decoded = this.decodeCookie(client);
    this.SocketContainer.delete(decoded.id);
    const user = await this.prisma.user.update({
      where : {id_user : decoded.id},
      data :{
        status_user : "offline",
      },
    });
    // console.log(user);
  }

  @SubscribeMessage('userOnline')
  handleUserOnline(client: Socket) {
    // this.handleConnection(client);
    // Handle when a user comes online
  }

  @SubscribeMessage('userOffline')
  handleUserOffline(client: Socket) {
    // this.handleDisconnect(client);
    // this.handleConnection(client);
    // console.log(decoded);
    // console.log('lawaaal');
    // return (decoded);
    // Handle when a user goes offline
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() body): string {
    console.log(body);
    return 'Hello world!';
  }


  @SubscribeMessage('add-friend')
  async add_friend(@ConnectedSocket() client: Socket ,@MessageBody() body){
    const decoded = this.decodeCookie(client);
    // console.log("hhdhdhdh"+body.id_user);
    const data = await this.prisma.user.findUnique({where:{id_user:decoded.id}});

    const notify = await this.prisma.notification.findFirst({where:{userId: body.id_user, id_user: decoded.id}});
    console.log(notify);
    if (notify == null){
      console.log('heeeeere');
      const user = await this.prisma.user.update({
        where:{id_user: body.id_user},
        data:{
          notification:{
            create:{
              AcceptFriend: true,
              GameInvitation: false,
              id_user: decoded.id,
              avatar: data.avatar,
              name: data.name,
            }
          }
        }
      });
    }
    console.log('hehehe');
    // const payload = await this.prisma.notification.findMany({where:{userId: body.id_user}});
    const sock = this.SocketContainer.get(body.id_user);
    this.server.to(sock).emit('notification');
  }
}