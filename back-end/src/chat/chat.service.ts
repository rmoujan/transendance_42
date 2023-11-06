import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
// import { CreateDmDto } from '../channel/dto/create-channel.dto';
// import { dm } from '../prisma.service';
import { Dm } from '@prisma/client';


@Injectable()
export class ChatService {

  constructor(private prisma: PrismaService) { }
  // Find a CHANNEL By ID
  async findChannel(idch: number) {
    const channel = await this.prisma.channel.findUnique({
      where: {
        id_channel: idch,
      },
    })
    return (channel);
  }
  // get all users in a specific channel :
  async getUsersInChannel(idch: number) {
    const users = await this.prisma.memberChannel.findMany({
      where: {
        channelId: idch,
      },
    })

    return (users);
  }

  // gcheck is this dm is already exist in database, otherwise create one and return it.
  async checkDm(idSend: number, idRecv: number) {
    // let result: Dm;
    const dm1 = await this.prisma.dm.findUnique({
      where: {
        senderId_receiverId: {
          senderId: idSend,
          receiverId: idRecv,
        },
      },
    });

    if (dm1) {
      console.log(`FRom dm1 |${dm1}|`);
      return dm1;
    }

    const dm2 = await this.prisma.dm.findUnique({
      where: {
        senderId_receiverId: {
          senderId: idRecv,
          receiverId: idSend,
        },
      },
    });
    if (dm2) {
      console.log(`FRom dm2 |${dm2}|`);
      return dm2;
    }

    const result = await this.prisma.dm.create({
      data: {
        senderId: idSend,
        receiverId: idRecv,
        unread: 0,
        pinned: false,
      },
    })
    console.log(`Result is ${result}`);
    return (result);
  }
  // get all users in a specific channel :
  async createMsg(idSend: number, idRecv: number, dmVar: Dm, msg: string, typeMsg: string) {
    let var1 = false;
    let var2 = false;
    console.log(`FRom create msg , ${dmVar}, ${dmVar.senderId}`)
    if (dmVar.senderId === idSend) {
      var1 = true;
    }
    else {
      var2 = true;
    }
    const result = await this.prisma.conversation.create({
      data: {
        text: msg,
        outgoing: var1,
        incoming: var2,
        type: typeMsg,
        idDm: dmVar.id_dm,
      },
    })
    return (result);
  }
  // get All Conversations of currently User :
  async getAllConversations(id: number) {
    try {

      const dms = await this.prisma.dm.findMany({
        where: {
          OR: [
            { senderId: id },
            { receiverId: id }
          ]
        }
      });
      console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  :: ${dms}`);
      return dms;
    }
    catch (error) {
      console.error('there is no dms , error');
    }
  }

  // get All Conversations of currently User Dm :
  async getAllMessages(id: number) {
    try {

      const messages = await this.prisma.conversation.findMany({
        where: {
          idDm: id
        },
        orderBy: {
          dateSent: 'asc' // or 'desc' for descending order
        }
      });
      return messages;
    }
    catch (error) {
      console.error('we have no public channels', error);
    }
  }

  async createDiscussion(idSend: number, msg: string, idCh: number) {
    const result = await this.prisma.discussion.create({
      data: {
        message: msg,
        userId: idSend,
        channelId: idCh,
      },
    })
    return (result);
  }

  // get All message within a room of currently User :
  // ma3rftsh wash ghadi y7tak semiyat d users wela ghi id ??
  // ila kan ta semiyat f rah I think khasni shi qwery b7al li diha include : true.
  async getAllMessagesRoom(id: number) {
    try {

      const messages = await this.prisma.discussion.findMany({
        where: {
          channelId: id
        },
        orderBy: {
          dateSent: 'asc' // or 'desc' for descending order
        }
      });
      return messages;
    }
    catch (error) {
      console.error('we have no public channels', error);
    }
  }
  async getTheLastMessage(id: number) {
    try {

      const lastMessage = await this.prisma.conversation.findFirst({
        where: {
          idDm: id
        },
        orderBy: {
          dateSent: 'desc' // or 'desc' for descending order
        }
      });
      return lastMessage;
    }
    catch (error) {
      console.error('we have no public channels', error);
    }
  }

}

