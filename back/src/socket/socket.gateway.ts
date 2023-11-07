import { Headers } from '@nestjs/common';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server ,Socket} from 'socket.io';
import { JwtService } from 'src/jwt/jwtservice.service';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({namespace: 'users'})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect{
  
  constructor(private jwt :JwtService, private readonly prisma: PrismaService){}

  @WebSocketServer() server: Server;

  private SocketContainer = new Map();

	decodeCookie(client: Socket) {
		let cookieHeader;

		cookieHeader = client.handshake.headers.cookie;
		const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
			const [name, value] = cookie.trim().split("=");
			acc[name] = value;
			return acc;
		}, {});

		const specificCookie = cookies["cookie"];
    console.log(specificCookie);
		const decoded = this.jwt.verify(specificCookie);

		return decoded;
	}

  async handleConnection(client: Socket) {

    console.log('client ' + client.id + ' has conected');
    const decoded = this.decodeCookie(client);
    console.log(decoded);
    let user_id:number = decoded.id;
    this.SocketContainer.set(user_id, client.id);
    const user = await this.prisma.user.update({
      where : {id_user : decoded.id},
      data :{
        status_user : "online",
      },
    });
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
    this.handleConnection(client);
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
}