import { SubscribeMessage, WebSocketGateway, MessageBody, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { Logger, OnModuleInit } from '@nestjs/common';
import { JwtService } from 'src/jwt/jwtservice.service';
import { ChatService } from './chat.service';
import { UsersService } from 'src/users/users.service';
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
@WebSocketGateway({ cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] } })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private jwt: JwtService, private readonly ChatService: ChatService, private readonly UsersService: UsersService) { }

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

  //it gets automatically called each time a client connects to the WebSocket server. 
  //it logs the socket ID of the connected client using NestJS's logger.
  handleConnection(client: Socket) {

    this.logger.log(client.handshake.query.user_id);
    // this.logger.log(`Client Connected : ${this.i}`);
    // const id: string = client.handshake.query.user_id[0];
    const id: number = Number(client.handshake.query.user_id);
    this.logger.log(` ********  User  Connected : ${id} and its sockets is ${client.id}`);
    // this.logger.log(` ********  Client Connected : ${client.id}`);

    // console.log(typeof id);
    this.connectedClients.set(id, client);
    // this.connectedClients.set(this.i,client);
    console.log("####### First connection :: OUTPUT MAP OF CONNECTE CLIENTS");
    for (const [key, value] of this.connectedClients) {
      console.log(`Key: ${key}, Value: ${value}`);
    }
  }

  handleDisconnect(client: Socket) {
    // Handle disconnection event
    // this.logger.log(`Client Connected : ${this.i}`);
    const id: number = Number(client.handshake.query.user_id);
    this.logger.log(` ******   Client Disconnect : ${id}`);
    this.connectedClients.delete(id);
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
    this.joinRoom(senderClient, room);
    this.joinRoom(receiverClient, room);
    // chatTodm is the name of event li ana mn back kansifto lfront (li khaso yb9a yelisteni elih)

    console.log("starting sending");
    // start cheaking database :
    const dm = await this.ChatService.checkDm(
      senderId,
      receiverId,
    );
    console.log(`FROM gatways value of Dm is ${dm}`);
    // console.log(dm);
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
    this.server.to(room).emit('chatToDm', data);
    console.log("after sending");
    // process o database .

    // } else {
    //   console.error(`Sender or receiver is not connected.`);
    // }
  }


  @SubscribeMessage('direct_message')
  process_dm(@ConnectedSocket() client: Socket, @MessageBody() data: any): string {
    // Business logic to save the message to the database
    // I need to check if this sender is already exist in conversatin table or not :
    // const senderId = "71";
    // const receiverId = "72";
    let room;

    //  room = this.createRoom(senderId, receiverId);
    console.log(data);
    room = this.createRoom(data.from, data.to);
    this.handling_joinRoom_dm(room, data.from, data.to, data.message);
    //  console.log("####### OUTPUT MAP OF CONNECTE CLIENTS");
    //  for (const [key, value] of this.connectedClients) {
    //   console.log(`Key: ${key}, Value: ${value}`);
    // }
    console.log(`FRom websockets DM ==== ${data.message}`);
    console.log()
    console.log(`client connected is ${client.id}`);
    // decodeCookie(client)
    return 'Hello world!';
  }



  handling_joinRoom_group(data: any, users: any) {

    // u need more check 
    const room = `room_${data.id}`;
    for (const user of users) {
      // Access and process individual user properties
      // clientsChannel.push(this.connectedClients[user.userId]);
      // const client = this.connectedClients[user.userId];
      const client: Socket = this.connectedClients.get(user.userId);
      this.joinRoom(client, room);
      // saving into databases :

      const save = this.ChatService.createDiscussion(data.senderId, data.message, data.id)
      const result = {
        id: data.id,
        message: data.message,
        send: data.senderId,
      };
      this.server.to(room).emit('chatToGroup', result);
    }
  }

  @SubscribeMessage('channel_message')
  async sendInChannel(@ConnectedSocket() client: Socket, @MessageBody() data: any): Promise<any> {
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
    const channel = await this.ChatService.findChannel(data.id);
    if (channel) {
      const users = await this.ChatService.getUsersInChannel(
        data.id
      );

      this.handling_joinRoom_group(data, users);
    }

    return "OK";
  }

  // I emitted to room + user id to target just this user who doing this request.
  @SubscribeMessage('allConversationsDm')
  async allConversationsDm(@ConnectedSocket() client: Socket, @MessageBody() data: any) {

    console.log["*"];
    const userId: number = Number(client.handshake.query.user_id);
    console.log(`Socket from allDms is ${client.id}`);
    console.log(`User id from allDms is ${data._id}`);

    const user = await this.UsersService.findById(userId);
    const dms = await this.ChatService.getAllConversations(user.id_user);
    console.log("|||||");

    if (dms) {
      const arrayOfDms = [];
      for (const dmm of dms) {

        const getUser = await this.UsersService.findById(dmm.receiverId);
        const lastMsg = await this.ChatService.getTheLastMessage(dmm.id_dm);
        console.log(`Last message is ${lastMsg.text}`);
        console.log(dmm.id_dm);
        const newDm = {
          id: dmm.receiverId,
          user_id: dmm.senderId,
          name: getUser.name,
          online: getUser.status_user,
          img: user.avatar,
          msg: lastMsg.text,
          time: lastMsg.dateSent,
          unread: dmm.unread,
          pinned: dmm.pinned,
        };
        arrayOfDms.push(newDm);
      }
      // console.log("ZZZZZZZZZZZZZZ");
      console.log(arrayOfDms);
      client.emit('response', arrayOfDms);
    }

    console.log("after allconDms");
  }

  @SubscribeMessage('allMessagesDm')
  async getAllMessages(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    // I need the id of room (dm).
    const userId: number = Number(client.handshake.query.user_id);

    const user = await this.UsersService.findById(userId);
    if (user) {
      const messages = this.ChatService.getAllMessages(data.id);
      const room = `room_${data.id}`;
      this.server.to(room).emit('Response_messages_Dms', messages);
      console.log("after sending");
    }
    else
      console.log("Error user does not exist");
  }

  // for channels
  // EXpecting the id room(channel)
  @SubscribeMessage('allMessagesRoom')
  async getAllMessagesRoom(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    // I need the id of room (dm).
    const userId: number = Number(client.handshake.query.user_id);

    const user = await this.UsersService.findById(userId);
    if (user) {
      // data.id is id of channel.
      const messages = this.ChatService.getAllMessagesRoom(data.id);
      const room = `room_${data.id}`;
      this.server.to(room).emit('Response_messages_Channel', messages);
      console.log("after sending");
    }
    else
      console.log("Error user does not exist");
  }

  // @SubscribeMessage('findAllMessages')
  // findAll()
  // {
  //   return "All messages f dm";
  // }
  // // add new message to tables
  // @SubscribeMessage('createMessage')
  // create(@MessageBody() msg : String)
  // {
  //   return " create new msg and pushi f database";
  // }

  // @SubscribeMessage('typing')
  // async typing()
  // {

  // }

  // @SubscribeMessage('join')
  // joinRoom(@MessageBody() msg: string, @ConnectedSocket() client: Socket)
  // {
  //   console.log(msg);
  //   console.log(`client id from join event: ${client.id}`);
  // }

}

// plan of afternon :::
// watch that forst : https://www.youtube.com/watch?v=atbdpX4CViM&t=280s&ab_channel=MariusEspejo
// then had playlist :
// https://www.youtube.com/playlist?list=PLBHzlq7ILbsaL1sZxJIxrc4ofSPAMSTzr
// then start by asking chatgpt.
// NOte you will need just this gatways  and service, gatways will handle events and connections
//while service will handle busness logic .
// you  will need to specify namspace to separate sockets of chat and ganme. 



// 3/10/23
// Notte : tefrji f had playlist bash tefhmi rooms mzzzzzzn (indeed)
// https://www.youtube.com/watch?v=3V1DBEUoImo&list=PLBHzlq7ILbsaL1sZxJIxrc4ofSPAMSTzr&index=5
// then hadi mn b3d :
// https://www.youtube.com/watch?v=atbdpX4CViM

// then 9eray hadshi : https://www.joshmorony.com/creating-a-simple-live-chat-server-with-nestjs-websockets/