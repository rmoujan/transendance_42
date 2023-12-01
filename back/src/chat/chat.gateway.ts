import { SubscribeMessage, WebSocketGateway, MessageBody, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { Logger, OnModuleInit, ValidationPipe } from '@nestjs/common';
import { JwtService } from '../auth/jwt/jwtservice.service';
import { ChatService } from './chat.service';
import { UsersService } from 'src/users/users.service';
import { ChannelsService } from 'src/channel/channel.service';
import { ChatDto } from './dtoChat/chat.dto';

@WebSocketGateway({
  namespace: "chat",
  cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] },
})

export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private jwt: JwtService, 
              private readonly ChatService: ChatService, 
              private readonly UsersService: UsersService, 
              private readonly ChannelsService: ChannelsService) { }


  private connectedClients: Map<number, Socket> = new Map();
  private roomsDm: string[] = [];

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AppGateway');
  afterInit(server: any) {
    this.logger.log("Initialized by Reshe");
  }

  decodeCookie(client: any) {
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
    return (decoded);
  }

  handleConnection(client: Socket) {

    if (client)
    {
      const decoded = this.decodeCookie(client);
      if (decoded)
      {
        if (decoded.id)
        {
          this.connectedClients.set(decoded.id, client);
        }

      }
    }
  }

  handleDisconnect(client: Socket) {


    if (client)
    {
      const decoded = this.decodeCookie(client);
      if (decoded)
      {
        if (decoded.id)
        {
          this.connectedClients.delete(decoded.id);
        }
      }
    }
  }

  createRoom(senderId: string, recieverId: string) {

    const roomName1 = `room_${senderId}_${recieverId}`;
    const roomName2 = `room_${recieverId}_${senderId}`;

    const check1: number = this.roomsDm.indexOf(roomName1);

    const check2: number = this.roomsDm.indexOf(roomName2);

    if (check1 === -1 && check2 === -1) {
      this.roomsDm.push(roomName1);
      return roomName1;
    }
    if (check1 !== -1)
      return this.roomsDm[check1];
    else
      return this.roomsDm[check2];
  }

  leaveRoom(client: Socket, roomName: string) {
    if (client)
      client.leave(roomName);
  }

  joinRoom(client: Socket, roomName: any) {
    if (client)
      client.join(roomName);
  }

  async handling_joinRoom_dm(room: string, senderId: number, receiverId: number, message: string) {


    const senderClient: Socket = this.connectedClients.get(senderId);
    const receiverClient: Socket = this.connectedClients.get(receiverId);


    const result = await this.ChatService.cheakBlockedUser(senderId, receiverId);
    if (result) 
    {
      console.log();
    }
    else {
      this.joinRoom(senderClient, room);
      this.joinRoom(receiverClient, room);
      const dm = await this.ChatService.checkDm(
        senderId,
        receiverId,
      );
      if (dm)
      {
        const insertDm = await this.ChatService.createMsg(
          senderId,
          receiverId,
          dm,
          message,
          "text"
        );
        const data = {
          id: dm.id_dm,
          message: message,
          send: senderId,
          recieve: receiverId
        };
        this.server.to(room).emit('chatToDm', data);
      }
    }
  }

  @SubscribeMessage('direct_message')
  process_dm(@ConnectedSocket() client: Socket, @MessageBody() data: any){
    let room;
    try {
      
      if (data)
      {
        if (!data.message || !data.from || !data.to)
        {
          return (false);
        }  
      }
      else
      {
        return (false);

      }
    room = this.createRoom(data.from, data.to);
    this.handling_joinRoom_dm(room, data.from, data.to, data.message);
    }
    catch (error) {

    }
  }

  async handling_joinRoom_group(data: any, users: any) {


    const room = `room_${data.id}`;
    for (const user of users) {
      const client: Socket = this.connectedClients.get(user.userId);
      this.joinRoom(client, room);
    }
    const checkmutedUser = await this.ChatService.checkmuted(data.from, data.to);
    if (checkmutedUser) {
      if (checkmutedUser.muted == false) {
        const save = await this.ChatService.createDiscussion(data.from, data.message, data.to)
        const result = {
          id: data.to,
          sender_id: data.from,
          type: "msg",
          subtype: "",
          message: data.message,
        };
        this.server.to(room).emit('chatToGroup', result);
      }
    }
  }

  @SubscribeMessage('channel_message')
  async sendInChannel(@ConnectedSocket() client: Socket, @MessageBody() data: any) {

    try {
      
      if (data)
      {
        if (!data.message || !data.from || !data.to)
        {
          return (false);
        }  
      }
      else
      {
        return (false);
      }
  
      const channel = await this.ChatService.findChannel(data.to);
      if (channel) {
        const users = await this.ChatService.getUsersInChannel(
          data.to
        );
        this.handling_joinRoom_group(data, users);
      }
    }
    catch (error) {
      console.error("Error");
  }

  }

  @SubscribeMessage('allConversationsDm')
  async allConversationsDm(@ConnectedSocket() client: Socket, @MessageBody() data: any) {

    try {
    const decoded = this.decodeCookie(client);
    const user = await this.UsersService.findById(decoded.id);
    const dms = await this.ChatService.getAllConversations(user.id_user);

    let recv;
    let send;
    let namerecv;
    let avatarrecv;
    let statusrecv;
    let msg = "";
    let sent: Date | null = null;
    if (dms) {
      const arrayOfDms = [];
      for (const dmm of dms) {

        const getRecvUser = await this.UsersService.findById(dmm.receiverId);
        const getSendUser = await this.UsersService.findById(dmm.senderId);
        const lastMsg = await this.ChatService.getTheLastMessage(dmm.id_dm);
        recv = dmm.receiverId;
        send = dmm.senderId;
        namerecv = getRecvUser.name;
        statusrecv = getRecvUser.status_user;
        avatarrecv = getRecvUser.avatar;

        if (user.id_user === dmm.receiverId) {
          recv = dmm.senderId;
          send = dmm.receiverId;
          namerecv = getSendUser.name;
          avatarrecv = getSendUser.avatar;
          statusrecv = getSendUser.status_user;

        }
        if (lastMsg) {
          msg = lastMsg.text;
          sent = lastMsg.dateSent;
        }
        const newDm = {
          id_room: dmm.id_dm,
          id: recv,
          user_id: send,
          name: namerecv,
          online: statusrecv,
          img: avatarrecv,
          msg: msg,
          time: sent,
          unread: dmm.unread,
          pinned: dmm.pinned,
        };
        arrayOfDms.push(newDm);
      }
      client.emit('response', arrayOfDms);
    }
  }
  catch (error) {
    client.emit('response', false);
}
}

  @SubscribeMessage('allMessagesDm')
  async getAllMessages(@ConnectedSocket() client: Socket, @MessageBody() data: any) {

    try {
      if (data)
      {
        if (!data.room_id || !data.user_id)
        {
          return (false);
        }  
      }
      else
        return (false);
      
      if (client)
      {
        const decoded = this.decodeCookie(client);
        const user = await this.UsersService.findById(decoded.id);
        if (user) {
          const existDm = await this.ChatService.getDm(data.user_id, data.room_id);
          if (existDm) {
            const messages = await this.ChatService.getAllMessages(existDm.id_dm);
            client.emit('historyDms', messages);
          }
          else {
            client.emit('historyDms', []);
          }
        }
      }
    }
     catch (error) {

      client.emit('historyDms', false);
  }

}

  @SubscribeMessage('allMessagesRoom')
  async getAllMessagesRoom(@ConnectedSocket() client: Socket, @MessageBody() data: any) {

    try {
      if (data)
      {
        if (!data.user_id || !data.id)
        {
          return (false);
        }  
      }
      else
        return (false);
        const user = await this.UsersService.findById(data.user_id);
        if (user) {
          const messages = await this.ChatService.getAllMessagesRoom(data.id);
          if (client) {
            client.emit('hostoryChannel', messages);
          }
        }
    }
    catch (error) {
      client.emit('hostoryChannel', false);
    }
  }

  @SubscribeMessage('leaveChannel')
  async leavingRoom(@ConnectedSocket() client: Socket, @MessageBody() data: any) {

    try {
      
      if (data)
      {
        if (!data.user_id || !data.channel_id)
        {
          return (false);
        }  
      }
      else
        return (false);
      const user = await this.UsersService.findById(data.user_id);
      if (user) {
        const leave = await this.ChatService.getLeavingRoom(data.user_id, data.channel_id);
        if (leave) {
          client.emit('ResponseLeaveUser', true);
        }
        else
        {
          client.emit('ResponseLeaveUser', false);
        }
      }
    }
    catch (error) {
      client.emit('ResponseLeaveUser', false);
    }
  }

  @SubscribeMessage('banUserFRomChannel')
  async bannedUser(@ConnectedSocket() client: Socket, @MessageBody() data: any) {

    try{
    if (data)
    {
      if (!data.to || !data.from || !data.channel_id)
      {
        return (false);
      }  
    }
    else
      return (false);

    const user1 = await this.UsersService.findById(data.from);
    const user2 = await this.UsersService.findById(data.to);
    if (client) {
      const decoded = this.decodeCookie(client);

      if (user1) {
        if (user1.id_user == data.from) {
          if (user1 && user2) {
            const bannedUser = await this.ChannelsService.banUser(data.channel_id, data.from, data.to);
            if (bannedUser) {
              client.emit('ResponseBannedUser', true);
            }
            else
            {
              client.emit('ResponseBannedUser', false);
            }
          }
        }
      }
    }
  }
  catch (error) {
    client.emit('ResponseBannedUser', false);
  }
  }

  @SubscribeMessage('kickUserFromChannel')
  async kickUser(@ConnectedSocket() client: Socket, @MessageBody() data: any) {

    try {
    if (data)
    {
      if (!data.to || !data.from || !data.channel_id)
      {
        return (false);
      }  
    }
    else
      return (false);
    const user1 = await this.UsersService.findById(data.from);
    const user2 = await this.UsersService.findById(data.to);
    if (client) {

      const decoded = this.decodeCookie(client);
      if (user1) {
        if (user1.id_user == decoded.id) {
          if (user1 && user2) {
            const kickUser = await this.ChannelsService.kickUser(data, data.from, data.to);
            if (kickUser) {
              client.emit('ResponsekickUser', true);
            }
            else
            {
              client.emit('ResponsekickUser', false);
            }
          }
        }
      }
    }
  }
  catch (error) {
    client.emit('ResponsekickUser', false);
  }
  }

  @SubscribeMessage('muteUserFromChannel')
  async muteUser(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    
    try {
    if (data)
    {
      if (!data.to || !data.from || !data.channel_id)
      {
        return (false);
      }  
    }
    else
      return (false);
    const user1 = await this.UsersService.findById(data.from);
    const user2 = await this.UsersService.findById(data.to);
    if (client) {
      const decoded = this.decodeCookie(client);

      if (user1) {
        if (user1.id_user == decoded.id) {
          if (user1 && user2) {
            const muteUser = await this.ChannelsService.muteUser(data, user1.id_user, data.to);
            if (muteUser) {
              client.emit('ResponsemuteUser', true);
            }
            else
            {
              client.emit('ResponsemuteUser', false);
            }
          }
        }
      }
    }
  }
  catch (error) {
    client.emit('ResponsemuteUser', false);
  }
  }


  @SubscribeMessage('unmuteUserFromChannel')
  async unmuteUser(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    try {
    if (data)
    {
      if (!data.to || !data.from || !data.channel_id)
      {
        return (false);
      }  
    }
    else
      return (false);


    const user1 = await this.UsersService.findById(data.from);
    const user2 = await this.UsersService.findById(data.to);
    if (client) {
      const decoded = this.decodeCookie(client);
      if (user1) {
        if (user1.id_user == decoded.id) {
          if (user1 && user2) {
            const unmuteUser = await this.ChannelsService.unmuteUser(data, user1.id_user, data.to);
            if (unmuteUser) {
              client.emit('ResponsunmutekUser', true);
            }
            else
            {
              client.emit('ResponsunmutekUser', false);
            }
          }
        }
      }
    }
  }
  catch (error) {
    client.emit('ResponsunmutekUser', false);
  }
}
}