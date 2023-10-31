import { Headers } from '@nestjs/common';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server ,Socket} from 'socket.io';
import { JwtService } from 'src/jwt/jwtservice.service';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({namespace: 'users'})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect{
  
  constructor(private jwt :JwtService, private readonly prisma: PrismaService){}

  @WebSocketServer() server: Server;

  private SocketContainer 

  decodeCookie(client: Socket){
    let cookieHeader : string  = '';
    cookieHeader = client.handshake.headers.cookies.toString(); // Get the entire cookie header as a string
    // // You can now parse and manipulate the cookie data as needed
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      acc[name] = value;
      return acc;
    }, {});


    const specificCookie = cookies['cookie'];
    const decoded = this.jwt.verify(specificCookie);

    return (decoded);
  }

  async handleConnection(client: Socket) {

    console.log('client ' + client.id + ' has conected');
    const decoded = this.decodeCookie(client);
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
    const user = await this.prisma.user.update({
      where : {id_user : decoded.id},
      data :{
        status_user : "offline",
      },
    });
    console.log(user);
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