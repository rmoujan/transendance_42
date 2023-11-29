import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

import { Dm } from '@prisma/client';
import { receiveMessageOnPort } from 'worker_threads';


@Injectable()
export class ChatService {

  constructor(private prisma: PrismaService) { }
  // Find a CHANNEL By ID
  async findChannel(idch: number) {
    try {
      const channel = await this.prisma.channel.findUnique({
        where: {
          id_channel: idch,
        },
      })
      return (channel);
    }
    catch (error) {
      throw new NotFoundException(`no channel`);
    }
  }
  // get all users in a specific channel :
  async getUsersInChannel(idch: number) {
    try
    {
      const users = await this.prisma.memberChannel.findMany({
        where: {
          channelId: idch,
          muted: false
        },
      })
      return (users);
    }
    catch (error) {
      throw new NotFoundException(`no users`);
    }
  }

  // gcheck is this dm is already exist in database, otherwise create one and return it.
  async checkDm(idSend: number, idRecv: number) {
    // let result: Dm;
    try {
    const dm1 = await this.prisma.dm.findUnique({
      where: {
        senderId_receiverId: {
          senderId: idSend,
          receiverId: idRecv,
        },
      },
    });

    if (dm1) {
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
    return (result);
  }
  catch (error) {
    throw new NotFoundException(`Error occured when checking dm`);
  }
  }
  // get all users in a specific channel :
  async createMsg(idSend: number, idRecv: number, dmVar: Dm, msg: string, typeMsg: string) {
    try {
      const result = await this.prisma.conversation.create({
        data: {
          text: msg,
          outgoing: idSend,
          incoming: idRecv,
          type: typeMsg,
          idDm: dmVar.id_dm,
        },
      })
      return (result);
    }
    catch (error) {
      throw new NotFoundException(`Error occured when creating a message`);
    }
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
      throw new NotFoundException(`there is no dms , error`);
    }
  }


  // get All Conversations of currently User Dm :
  // getDm based on idReciever and idSEnder .
  async getDm(idSend: number, idRecv: number) {
    try {
      const dm1 = await this.prisma.dm.findUnique({
        where: {
          senderId_receiverId: {
            senderId: idSend,
            receiverId: idRecv,
          },
        },
      });
      if (dm1) {
        console.log(`get Dm1 |${dm1}|`);
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
        console.log(`get dm2 |${dm2}|`);
        return dm2;
      }
    }
    catch (error) {
      throw new NotFoundException(`we have no dm for those users`);
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
      throw new NotFoundException(`we have no messages`);
      // console.error('we have no public channels', error);
    }
  }

  async createDiscussion(idSend: number, msg: string, idCh: number) {
    try {
      const result = await this.prisma.discussion.create({
        data: {
          message: msg,
          userId: idSend,
          channelId: idCh,
        },
      })
      return (result);
    }
    catch (error) {
      throw new NotFoundException(`Error occured when creating a discussion`);
    }
  }

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
      throw new NotFoundException(`Error getting messages in this Channel`);
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
      throw new NotFoundException(`There is no last message`);
    }
  }


  async getLeavingRoom(idUs: number, idch: number) {
    try {

      const record = await this.prisma.memberChannel.findUnique({
        where: {

          userId_channelId: {
            userId: idUs,
            channelId: idch,
          },
        },
      });
      if (record) {
        console.log("DELETING USER \n");
        // delete all messages of this user from channel first :
        const deleteMsg = await this.prisma.discussion.deleteMany({
          where: {
            userId: idUs,
            channelId: idch,
          },
        });
        const result = await this.prisma.memberChannel.delete({
          where: {

            userId_channelId: {
              userId: idUs,
              channelId: idch,
            },
          },
        });
        return result;
      }
    }
    catch (error) {
      throw new NotFoundException(`Error occured when leave user in this channel`);
    }

  }

  async cheakBlockedUser(idSend: number, idRecv: number) {

    try {
      const block = await this.prisma.blockedUser.findMany({
        where: {
          userId: idRecv,
          id_blocked_user: idSend,
        },
      });
      const block2 = await this.prisma.blockedUser.findMany({
        where: {
          userId: idSend,
          id_blocked_user: idRecv,
        },
      });
      if (block.length > 0 || block2.length > 0) {
        return true;
      }
      return false;
    }
    catch (error) {
      throw new NotFoundException(`Error occured when check blocked user`);
    }
  }

  async checkmuted(idSend: number, idch: number) {

    try{
      
      const record = await this.prisma.memberChannel.findUnique({
        where: {
          userId_channelId: {
            userId: idSend,
            channelId: idch,
          },
        }
      });
  
      return (record);
    }
    catch (error) {
      throw new NotFoundException(`Error occured when checking muted user`);
    }
  }
}

