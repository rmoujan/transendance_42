import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

import { Dm } from '@prisma/client';
import { receiveMessageOnPort } from 'worker_threads';


@Injectable()
export class ChatService {

  constructor(private prisma: PrismaService) { }
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

  async checkDm(idSend: number, idRecv: number) {
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
      return (dms);
    }
    catch (error) {
      throw new NotFoundException(`there is no dms , error`);
    }
  }



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
    }
    catch (error) {
      throw new NotFoundException(`we have no dm for those users`);
    }
  }

  async getAllMessages(id: number) {
    try {

      const messages = await this.prisma.conversation.findMany({
        where: {
          idDm: id
        },
        orderBy: {
          dateSent: 'asc'
        }
      });
      return (messages);
    }
    catch (error) {
      throw new NotFoundException(`we have no messages`);
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
          dateSent: 'asc'
        }
      });
      return (messages);
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
          dateSent: 'desc'
        }
      });
      return (lastMessage);
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
        return (result);
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
        return (true);
      }
      return (false);
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

