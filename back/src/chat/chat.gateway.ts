import { SubscribeMessage, WebSocketGateway, MessageBody, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { Logger, OnModuleInit } from '@nestjs/common';
import { JwtService } from '../auth/jwt/jwtservice.service';
import { ChatService } from './chat.service';
import { UsersService } from 'src/users/users.service';
import { ChannelsService } from 'src/channel/channel.service';
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
@WebSocketGateway({namespace: "chat", cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] } })
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

    const decoded = this.decodeCookie(client);
    // console.log(decoded);
    // start my code 
    this.logger.log(client.handshake.query.user_id);
    console.log(client.handshake.query?.user_id);
    // this.logger.log(`Client Connected : ${this.i}`);
    // const id: string = client.handshake.query.user_id[0];
    // const id: number = this.decodeCookie(client);
    this.logger.log(` ********  User  Connected : ${decoded.id} and its sockets is ${client.id}`);
    // this.logger.log(` ********  Client Connected : ${client.id}`);


    // console.log(typeof id);
    this.connectedClients.set(decoded.id, client);
    // this.connectedClients.set(this.i,client);
    console.log("####### First connection :: OUTPUT MAP OF CONNECTE CLIENTS");
    for (const [key, value] of this.connectedClients) {
      console.log(`Key: ${key}, Value: ${value}`);
    }
    //  end my code 
  }

  handleDisconnect(client: Socket) {
    // Handle disconnection event
    // this.logger.log(`Client Connected : ${this.i}`);
    // const id: number = Number(client.handshake.query.user_id);
    const decoded = this.decodeCookie(client);
    this.logger.log(` ******   Client Disconnect : ${decoded.id}`);
    this.connectedClients.delete(decoded.id);
    console.log("***** Client Disconnection :: OUTPUT MAP OF CONNECTE CLIENTS");
    for (const [key, value] of this.connectedClients) {
      console.log(`Key: ${key}, Value: ${value}`);
    }
    // this.connectedClients.delete(this.i);
    // this.i--;
    //call for leave room :
    // leave_room();

  }

  // I think u don't need to save those roomNames, just create aroom then use it.
  createRoom(senderId: string, recieverId: string) {
    console.log(`From Create Room Server Side : sender is ${senderId} and reciever is ${recieverId}`);
    const roomName1 = `room_${senderId}_${recieverId}`;
    const roomName2 = `room_${recieverId}_${senderId}`;

    console.log(`roomName1 is ${roomName1} and roomName2 is ${roomName2}`);
    const check1: number = this.roomsDm.indexOf(roomName1);

    const check2: number = this.roomsDm.indexOf(roomName2);
    console.log(`From create room server side after check `);
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


    // console.log("####### :: OUTPUT MAP OF CONNECTE CLIENTS");
    //   for (const [key, value] of this.connectedClients) {
    //    console.log(`Key: ${key}, Value: ${value}`);
    // //  }
    //   console.log(`***** From Dm handlingRoom Dm : sender is ${senderId} and reciver is ${receiverId}`);

    //   console.log(`***** From Dm handlingRoom Dm : Socketsender is ${senderClient} and Socketreciver is ${receiverClient}`);
    // const size = this.connectedClients.size;

    // console.log(`****** size of map of clients connected is ${size}`);
    // if (senderClient && receiverClient) {
    // Send the message to the specified room

    console.log("*************   handling_joinRoom_dm");
    // I think hena khaski t cheaki wash wahd mb loki lakhor .
    const result = await this.ChatService.cheakBlockedUser(senderId, receiverId);
    if (result) {
      console.log("u are blocked from the reciever");
    }
    else {
      this.joinRoom(senderClient, room);
      this.joinRoom(receiverClient, room);
      // chatTodm is the name of event li ana mn back kansifto lfront (li khaso yb9a yelisteni elih)

      console.log("starting sending");
      // start cheaking database :
      console.log(senderId);
      console.log(receiverId);
      // had line be3d lmerat kaytera fih error !!!
      const dm = await this.ChatService.checkDm(
        senderId,
        receiverId,
      );
      console.log(`FROM gatways value of Dm is ${dm}`);
      // console.log(dm);
      console.log(`^^^  SENDER IS ${senderId} REciver is ${receiverId}`);
      const insertDm = await this.ChatService.createMsg(
        senderId,
        receiverId,
        dm,
        message,
        "text"
      );
      // console.log(`value of insertDm is ${insertDm}`);
      const data = {
        id: dm.id_dm,
        message: message,
        send: senderId,
        recieve: receiverId
      };
      console.log(`¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤`);
      this.server.to(room).emit('chatToDm', data);
      // console.log("after sending");

    }

  }

  // ERRor li kaytra f dm que reciever ma3ndisssshhh !!!!!!!

  @SubscribeMessage('direct_message')
  process_dm(@ConnectedSocket() client: Socket, @MessageBody() data: any): string {
    // Business logic to save the message to the database
    // I need to check if this sender is already exist in conversatin table or not :
    // const senderId = "71";
    // const receiverId = "72";
    let room;
    console.log("*************   direct_message");

    //  room = this.createRoom(senderId, receiverId);
    // hafid makysiftsh liya reciever !!!!!!!!!!!!!!!!!
    // console.log(data);
    room = this.createRoom(data.from, data.to);
    this.handling_joinRoom_dm(room, data.from, data.to, data.message);
    //  console.log("####### OUTPUT MAP OF CONNECTE CLIENTS");
    //  for (const [key, value] of this.connectedClients) {
    //   console.log(`Key: ${key}, Value: ${value}`);
    // }
    // console.log(`FRom websockets DM ==== ${data.message}`);
    // console.log()
    // console.log(`client connected is ${client.id}`);
    // decodeCookie(client)
    return 'Hello world!';
  }



  async handling_joinRoom_group(data: any, users: any) {

    // u need more check 
    console.log("*************   handling_joinRoom_group");

    const room = `room_${data.id}`;
    for (const user of users) {
      // Access and process individual user properties
      // clientsChannel.push(this.connectedClients[user.userId]);
      // const client = this.connectedClients[user.userId];
      console.log("Inside sockets of groups");
      const client: Socket = this.connectedClients.get(user.userId);
      console.log("11111111111111111111111111111111");
      this.joinRoom(client, room);
      console.log("22222222222222222222222222222222222222");
      // saving into databases :
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

        console.log("befoor emiting in groups");
        this.server.to(room).emit('chatToGroup', result);
        console.log("ENDING JOINGROUP ");
      }
    }
  }

  @SubscribeMessage('channel_message')
  async sendInChannel(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    // Business logic to save the message to the database 
    // output the map :
    // I think I do need just the id of channel and the message.
    // first of all check is id channel is valid by checking the table of channel:
    // get all users Id they are in in this channel.
    // match the socket with id users then join them in room under name id_channel.
    // console.log("output the map ");
    // for (const [key, value] of this.connectedClients) {
    //   console.log(`Key: ${key}, Value: ${value}`);
    // }
    // const id = 1;
    // data must contain :
    // 1-sender and message 
    // 2 -idChannel.
    // Create a new channel.
    // check is the channel is exist :
    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
    console.log("*************   channel_message");
    // console.log(data);
    const channel = await this.ChatService.findChannel(data.to);
    if (channel) {
      const users = await this.ChatService.getUsersInChannel(
        data.to
      );
      console.log("########################################## 00");
      console.log(users);

      this.handling_joinRoom_group(data, users);
    }

    return "OK";
  }

  // I emitted to room + user id to target just this user who doing this request.
  // all dms.
  @SubscribeMessage('allConversationsDm')
  async allConversationsDm(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    // I need the id of current User :
    // data.id = 
    console.log("*************   allConversationsDm");
    console.log(data);
    // const userId: number = Number(client.handshake.query.user_id);
    const decoded = this.decodeCookie(client);
    // console.log(`Socket from allDms is ${client.id}`);
    // console.log(`User id from hansshake is ${userId}`);
    // console.log(`id coming from front is ${data._id}`);
    // console.log(`From allConversationsDm ${userId}`);

    const user = await this.UsersService.findById(decoded.id);
    const dms = await this.ChatService.getAllConversations(user.id_user);
    // console.log("|||||||||||||||||||||||||");
    console.log(`##################################### DMS of ${user.id_user}`);
    console.log(dms);
    let recv;
    let send;
    let namerecv;
    let avatarrecv;
    let statusrecv;
    let msg = "";
    let sent: Date | null = null;
    // let unread = 0;
    // let pinned = false;
    if (dms) {
      const arrayOfDms = [];
      for (const dmm of dms) {

        const getRecvUser = await this.UsersService.findById(dmm.receiverId);
        const getSendUser = await this.UsersService.findById(dmm.senderId);
        const lastMsg = await this.ChatService.getTheLastMessage(dmm.id_dm);
        // console.log(`Last message is ${lastMsg.text}`);
        // console.log(dmm.id_dm);
        // console.log(lastMsg);
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
      // console.log("ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ");
      // console.log(arrayOfDms);
      client.emit('response', arrayOfDms);
    }
    // console.log(`Lensth is ${dms.length}`);
    // must loop on each dm :
    // const room = `room_${userId}`;
    // this.server.to(room).emit('Response_allDms', dms);
    // sending response to this client :
    // preparing data for front :

    // console.log("after allconDms");
  }

  // history dm
  @SubscribeMessage('allMessagesDm')
  async getAllMessages(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    // I need the id of room (dm).
    // console.log("*************   allMessagesDm");

    // const userId: number = Number(client.handshake.query.user_id);
    const decoded = this.decodeCookie(client);

    const user = await this.UsersService.findById(decoded.id);
    // console.log(data);
    if (user) {
      // // start old version
      // const messages = await  this.ChatService.getAllMessages(data.room_id);
      // const room = `room_${data.room_id}`;
      // client.emit('historyDms', messages); 
      // //end old version
      // start new :
      const existDm = await this.ChatService.getDm(data.user_id, data.room_id);
      if (existDm) {
        const messages = await this.ChatService.getAllMessages(existDm.id_dm);
        // const room = `room_${existDm.id_dm}`;
        // console.log(messages);
        client.emit('historyDms', messages);

      }
      else {
        // console.log('empty')
        client.emit('historyDms', []);
      }

      // this.server.to(room).emit('Response_messages_Dms', messages);
      // console.log("after sending");
    }
    else
      console.log("Error user does not exist");
  }

  // for channels
  // EXpecting the id room(channel)
  // History of Channel :
  @SubscribeMessage('allMessagesRoom')
  async getAllMessagesRoom(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    // I need the id of room (dm).
    // console.log("********************** allMessagesRoom");
    // const userId: number = Number(client.handshake.query.user_id);
    // console.log(data)
    const user = await this.UsersService.findById(data.user_id);
    if (user) {
      // data.id is id of channel.
      const messages = await this.ChatService.getAllMessagesRoom(data.id);
      const room = `room_${data.id}`;

      // console.log(messages)
      if (client) {
        client.emit('hostoryChannel', messages);  // way 1
      }
      // this.server.to(room).emit('hostoryChannel', messages); way 2
      // console.log("after sending");
    }
    else
      console.log("Error user does not exist");
  }

  @SubscribeMessage('leaveChannel')
  async leavingRoom(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    // I need the id of room (dm). and rhe user.
    console.log("********************** leaveChannel");
    // const userId: number = Number(client.handshake.query.user_id);
    // { user_id: 62669, channel_id: 19 }
    console.log(data)
    const user = await this.UsersService.findById(data.user_id);
    if (user) {
      // data.id is id of channel.
      const leave = await this.ChatService.getLeavingRoom(data.user_id, data.channel_id);
      if (leave) {
        console.log("User with ${data.user_id} is leaving room with id ${data.id}");
        return true;
      }
    }
    else
      console.log("Error user does not exist");
  }

  @SubscribeMessage('banUserFRomChannel')
  async bannedUser(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    // { to: 90351, from: 90652, channel_id: 19 }
    console.log("bannedUser");
    console.log(data);
    // matching the client with iduser :

    const user1 = await this.UsersService.findById(data.from);
    const user2 = await this.UsersService.findById(data.to);
    if (client) {
      const id: number = Number(client.handshake.query.user_id);
      console.log(`checking id of clients and user are ${id} --- ${data.from}`);
      if (user1) {
        if (user1.id_user == data.from) {
          if (user1 && user2) {
            // data.id is id of channel.
            const bannedUser = await this.ChannelsService.banUser(data.channel_id, data.from, data.to);
            if (bannedUser) {
              const result = "User with ${data.bannedUs} is banned from room with id ${data.id} by the ${data.user_id}";
              console.log(`banned user is ================== `);
              console.log(bannedUser);
              // client.emit('ResponseBannedUser', result);
            }
          }
        }
      }
    }
    else
      console.log("ERRROR ");

    // if (user1 && user2)
    // {
    //   // data.id is id of channel.
    //   const bannedUser =   await this.ChannelsService.banUser(data.id, data.user.id_user, data.bannedUs);
    //   if (bannedUser)
    //   {
    //    const result =  "User with ${data.bannedUs} is banned from room with id ${data.id} by the ${data.user_id}";
    //     client.emit('ResponseBannedUser', result);

    //     // return true;
    //   }
    // }
    // else
    //   console.log("Error user does not exist");
  }

  @SubscribeMessage('kickUserFromChannel')
  async kickUser(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    console.log("kickUser =======================");
    console.log(data);
    console.log("###############################################");
    // matching the client with iduser :
    // kickUser =======================
    // { to: 98853, from: 90652, channel_id: 19 }
    // must protect data .
    const user1 = await this.UsersService.findById(data.from);
    const user2 = await this.UsersService.findById(data.to);
    if (client) {
      const id: number = Number(client.handshake.query.user_id);
      if (user1) {
        if (user1.id_user == id) {
          if (user1 && user2) {
            // data.id is id of channel.
            const kickUser = await this.ChannelsService.kickUser(data, data.from, data.to);
            if (kickUser) {
              const result = "User with ${data.kickUser} is kickUser from room with id ${data.id} by the ${data.user_id}";
              client.emit('ResponsekickUser', result);
            }
          }
        }
      }
    }
    else
      console.log("error");
  }

  @SubscribeMessage('muteUserFromChannel')
  async muteUser(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ MUUTE USER @@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    // { to: 62669, from: 90652, channel_id: 19 }
    console.log(data);
    // matching the client with iduser :

    const user1 = await this.UsersService.findById(data.from);
    const user2 = await this.UsersService.findById(data.to);
    if (client) {
      const id: number = Number(client.handshake.query.user_id);
      if (user1) {
        if (user1.id_user == id) {
          if (user1 && user2) {
            // data.id is id of channel.
            const muteUser = await this.ChannelsService.muteUser(data, user1.id_user, data.to);
            if (muteUser) {
              const result = "User with ${data.to} is muted from room with id ${data.channel_id} by the ${data.from}";
              client.emit('ResponsekickUser', result);
            }
          }
        }
      }
    }
    else
      console.log("error");
  }


  @SubscribeMessage('unmuteUserFromChannel')
  async unmuteUser(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ UNMUUTE USER @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    // { to: 62669, from: 90652, channel_id: 19 }
    console.log(data);
    // matching the client with iduser :

    const user1 = await this.UsersService.findById(data.from);
    const user2 = await this.UsersService.findById(data.to);
    if (client) {
      const id: number = Number(client.handshake.query.user_id);
      if (user1) {
        if (user1.id_user == id) {
          if (user1 && user2) {
            // data.id is id of channel.
            const unmuteUser = await this.ChannelsService.unmuteUser(data, user1.id_user, data.to);
            if (unmuteUser) {
              const result = "User with ${data.to} is muted from room with id ${data.channel_id} by the ${data.from}";
              client.emit('ResponsekickUser', result);
            }
          }
        }
      }
    }
    else
      console.log("error");
  }


}