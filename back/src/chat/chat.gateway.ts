import { SubscribeMessage, WebSocketGateway, MessageBody, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { Logger, OnModuleInit, ValidationPipe } from '@nestjs/common';
import { JwtService } from '../auth/jwt/jwtservice.service';
import { ChatService } from './chat.service';
import { UsersService } from 'src/users/users.service';
import { ChannelsService } from 'src/channel/channel.service';
import { ChatDto } from './dtoChat/chat.dto';
// it is like cntroller,  ghi instead of working with api endpoints, we working
//  on Events
//I give to my gatway a name , in case there are alots of gatways, in this way I can separate between my gatways
//in front u need just to mention the name of the gatway.
//when calling a specific handler.
// @WebSocketGateway()
// @WebSocketGateway({
//   cors: {
//     origin: '*',
//   },
// })
@WebSocketGateway({
  namespace: "chat",
  cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] },
})

// @WebSocketGateway({ cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] } })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private jwt: JwtService, private readonly ChatService: ChatService, private readonly UsersService: UsersService, private readonly ChannelsService: ChannelsService) { }


  // Assuming you have a map of connected clients with user IDs
  // private connectedClients = new Map<string, Socket>();
  // private i: number = 70;
  // private connectedClients = new Map<number, Socket>();
  private connectedClients: Map<number, Socket> = new Map();
  private roomsDm: string[] = [];

  // private clientsChannel: Socket[] = [];
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AppGateway');
  afterInit(server: any) {
    this.logger.log("Initialized by Reshe");
  }

  decodeCookie(client: any) {
    let cookieHeader;
    // console.log(client);
    cookieHeader = client.handshake.headers.cookie;
    if (cookieHeader == undefined) return null;
    //
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


  //it gets automatically called each time a client connects to the WebSocket server. 
  //it logs the socket ID of the connected client using NestJS's logger.
  handleConnection(client: Socket) {

    if (client)
    {
      const decoded = this.decodeCookie(client);
      console.log(`decoded is ===========  ${decoded}`);
      if (decoded)
      {
        if (decoded.id)
        {
          this.logger.log(` ********  User  Connected : ${decoded.id} and its sockets is ${client.id}`);
          this.connectedClients.set(decoded.id, client);
          console.log("------------------------------- OUTPUT MAP OF CONNECTE CLIENTS ----------------------------------");
          for (const [key, value] of this.connectedClients) {
            console.log(`Key: ${key}, Value: ${value}`);
          }
        }

      }
    }
  }

  handleDisconnect(client: Socket) {


    if (client)
    {
      const decoded = this.decodeCookie(client);
      console.log(`decoded is ===========  ${decoded}`);
      if (decoded)
      {
        if (decoded.id)
        {
          this.logger.log(` ******   Client Disconnect : ${decoded.id}`);
          this.connectedClients.delete(decoded.id);
          console.log("------------------ Client Disconnection :: OUTPUT MAP OF CONNECTE CLIENTS");
          for (const [key, value] of this.connectedClients) {
            console.log(`Key: ${key}, Value: ${value}`);
          }
        }
      }
    }
  }

  // I think u don't need to save those roomNames, just create aroom then use it.
  createRoom(senderId: string, recieverId: string) {
    console.log(`From Create Room Server Side : sender is ${senderId} and reciever is ${recieverId}`);
    const roomName1 = `room_${senderId}_${recieverId}`;
    const roomName2 = `room_${recieverId}_${senderId}`;

    // console.log(`roomName1 is ${roomName1} and roomName2 is ${roomName2}`);
    const check1: number = this.roomsDm.indexOf(roomName1);

    const check2: number = this.roomsDm.indexOf(roomName2);
    // console.log(`From create room server side after check `);
    // check if the both name are not exist in database ? 
    if (check1 === -1 && check2 === -1) {
      this.roomsDm.push(roomName1);
      return roomName1;
    }
    if (check1 !== -1)
      return this.roomsDm[check1];
    else
      return this.roomsDm[check2];
  }
  // leave a room:
  // qst  when must call this function ????
  leaveRoom(client: Socket, roomName: string) {
    client.leave(roomName);
  }
  // Join a client to a room
  joinRoom(client: Socket, roomName: any) {
    if (client)
      client.join(roomName);
  }

  async handling_joinRoom_dm(room: string, senderId: number, receiverId: number, message: string) {


    const senderClient: Socket = this.connectedClients.get(senderId);
    const receiverClient: Socket = this.connectedClients.get(receiverId);



    console.log("*************   handling_joinRoom_dm");
    // I think hena khaski t cheaki wash wahd mb loki lakhor .
    const result = await this.ChatService.cheakBlockedUser(senderId, receiverId);
    if (result) {
      console.log("u are blocked from the reciever");
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
        console.log(`¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤`);
        this.server.to(room).emit('chatToDm', data);
      }
    }
  }

  // ERRor li kaytra f dm que reciever ma3ndisssshhh !!!!!!!
    // weslt hena f protection !!! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  @SubscribeMessage('direct_message')
  process_dm(@ConnectedSocket() client: Socket, @MessageBody() data: any){
    let room;
    // { message: 'salan', from: 90652, to: 62669 }
    try {
      
      if (data)
      {
        if (!data.message || !data.from || !data.to)
        {
          console.log("channel false 11");
          return (false);
        }  
      }
      else
      {
        console.log("channel fals1e   22");
        return (false);

      }
    console.log("*************   direct_message");
    console.log(data);
    room = this.createRoom(data.from, data.to);
    this.handling_joinRoom_dm(room, data.from, data.to, data.message);
    }
    catch (error) {
      console.log("error");
    }
  }


  // protection done !!!
  async handling_joinRoom_group(data: any, users: any) {

    // u need more check 
    console.log("*************   handling_joinRoom_group");

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
  // protection done !!!
  @SubscribeMessage('channel_message')
  async sendInChannel(@ConnectedSocket() client: Socket, @MessageBody() data: any) {

    console.log("-------------------------------------- channel_message -----------------------------");
    console.log(data);
    // { message: 'ss', from: 90652, to: 2 }
    try {
      
      if (data)
      {
        if (!data.message || !data.from || !data.to)
        {
          console.log("channel false 11");
          return (false);
        }  
      }
      else
      {
        console.log("channel fals1e   22");
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

  // I emitted to room + user id to target just this user who doing this request.
  // all dms.
  // done with protection.
  @SubscribeMessage('allConversationsDm')
  async allConversationsDm(@ConnectedSocket() client: Socket, @MessageBody() data: any) {

    console.log("*************   allConversationsDm");
    console.log(data);

    try {
    const decoded = this.decodeCookie(client);
    const user = await this.UsersService.findById(decoded.id);
    const dms = await this.ChatService.getAllConversations(user.id_user);
    console.log(`##################################### DMS of ${user.id_user}`);
    console.log(dms);
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
    console.log("error");
    client.emit('response', false);
}
  }

  // history dm between two users.
   // protection done .
  @SubscribeMessage('allMessagesDm')
  async getAllMessages(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    // I need the id of room (dm).
    // console.log("*************   allMessagesDm");
    // { room_id: 113162, user_id: 90652 }
    console.log("---------------------- allMessagesDm -----------------------------");
    console.log(data);
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
      console.log("error");
      client.emit('historyDms', false);
  }

}

  // data incoming is id channel and id user.
  // History (all messages in a specific Channel ):
  // protection done .
  @SubscribeMessage('allMessagesRoom')
  async getAllMessagesRoom(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    // I need the id of room (dm).
    console.log("********************** allMessagesRoom");
    console.log(data);
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
      console.log("error");
      client.emit('hostoryChannel', false);
    }
  }

  @SubscribeMessage('leaveChannel')
  async leavingRoom(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    console.log("-------------------------- leave from this Channel -------------------------- ");
    console.log(data);
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
          console.log(`User with ${data.user_id} is leaving room with id ${data.channel_id}`);
          client.emit('ResponseLeaveUser', true);
        }
        else
        {
          client.emit('ResponseLeaveUser', false);
        }
      }
    }
    catch (error) {
      console.log("error");
      client.emit('ResponseLeaveUser', false);
    }
  }

  @SubscribeMessage('banUserFRomChannel')
  async bannedUser(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    // { to: 90351, from: 90652, channel_id: 19 }
    console.log("-------------------------- banUser from this Channel -------------------------- ");
    console.log(data);
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

      console.log(`checking id of clients and user are ${decoded.id} --- ${data.from}`);
      if (user1) {
        if (user1.id_user == data.from) {
          if (user1 && user2) {
            // data.id is id of channel.
            const bannedUser = await this.ChannelsService.banUser(data.channel_id, data.from, data.to);
            if (bannedUser) {
              // const result = "User with ${data.bannedUs} is banned from room with id ${data.id} by the ${data.user_id}";
              const result = "operation accomplished successfully";
              console.log(result);
              console.log(bannedUser);
              client.emit('ResponseBannedUser', true);
            }
            else
            {
              const result = "operation does not accomplished successfully";
              console.log(result);
              // console.log(bannedUser);
              client.emit('ResponseBannedUser', false);
            }
          }
        }
      }
    }
  }
  catch (error) {
    console.log("error");
    client.emit('ResponseBannedUser', false);
  }

  }

  @SubscribeMessage('kickUserFromChannel')
  async kickUser(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    console.log("-------------------------- kickUser from this Channel -------------------------- ");
    console.log(data);
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
              console.log("kick user 1");
              client.emit('ResponsekickUser', true);
            }
            else
            {
              console.log("kick user 2");
              client.emit('ResponsekickUser', false);
            }
          }
        }
      }
    }
  }
  catch (error) {
    console.log("error");
    client.emit('ResponsekickUser', false);
  }
  }

  // data from makysifthash !!!
  // fiha error
  @SubscribeMessage('muteUserFromChannel')
  async muteUser(@ConnectedSocket() client: Socket, @MessageBody() data: ChatDto) {
    console.log("-------------------------- MUTEUSER from this Channel -------------------------- ");
    // { to: 62669, from: 90652, channel_id: 19 }
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
    console.log(data);
    const user1 = await this.UsersService.findById(data.from);
    const user2 = await this.UsersService.findById(data.to);
    if (client) {
      const decoded = this.decodeCookie(client);

      if (user1) {
        if (user1.id_user == decoded.id) {
          if (user1 && user2) {
            // data.id is id of channel.
            const muteUser = await this.ChannelsService.muteUser(data, user1.id_user, data.to);
            if (muteUser) {
              // const result = "User with ${data.to} is muted from room with id ${data.channel_id} by the ${data.from}";
              // const result = "operation accomplished successfully";
              console.log("mute user 1");
              client.emit('ResponsemuteUser', true);
            }
            else
            {
              console.log("mute user 2");
              client.emit('ResponsemuteUser', false);
            }
          }
        }
      }
    }
  }
  catch (error) {
    console.log("error");
    client.emit('ResponsemuteUser', false);
  }
  }


  @SubscribeMessage('unmuteUserFromChannel')
  async unmuteUser(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    console.log("-------------------------- UNMUTEUSER from this Channel -------------------------- ");
    // { to: 62669, from: 90652, channel_id: 19 }
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
    console.log(data);
    // matching the client with iduser :

    const user1 = await this.UsersService.findById(data.from);
    const user2 = await this.UsersService.findById(data.to);
    if (client) {
      const decoded = this.decodeCookie(client);
      if (user1) {
        if (user1.id_user == decoded.id) {
          if (user1 && user2) {
            // data.id is id of channel.
            const unmuteUser = await this.ChannelsService.unmuteUser(data, user1.id_user, data.to);
            if (unmuteUser) {
              // const result = "operation accomplished successfully";
              console.log("mute user 1");
              client.emit('ResponsunmutekUser', true);
            }
            else
            {
              console.log("mute user 2");
              client.emit('ResponsunmutekUser', false);
            }
          }
        }
      }
    }
  }
  catch (error) {
    console.log("error");
    client.emit('ResponsunmutekUser', false);
  }
}
}