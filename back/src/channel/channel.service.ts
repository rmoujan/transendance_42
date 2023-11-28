import { Injectable, NotFoundException, HttpStatus, HttpException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService, private userService: UsersService) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  async verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

  async getPublicChannels()
  {
    try{

      const publicChannelsWithUsers = await this.prisma.channel.findMany({
        where: {
          visibility: 'public',
        },
        include: {
          users: {
            include: {
              user: true,
            },
          },
        },
      });
      return publicChannelsWithUsers;
    }
    catch (error) {
      throw new NotFoundException(`we have no public channels`);
    }
  }
  async getProtectedChannels()
  {
    try{

      const protectedChannelsWithUsers = await this.prisma.channel.findMany({
        where: {
          visibility: 'protected',
        },
        include: {
          users: {
            include: {
              user: true,
            },
          },
        },
      });
      return protectedChannelsWithUsers;
    }
    catch (error) {
      throw new NotFoundException(`we have no protected channels`);
    }
  }
  async createChannel(data: any,userId: number) {

    try {
      if (data.password){
        const hashedPassword = await this.hashPassword(data.password);
        data.password = hashedPassword;
      }
      const channel = await this.prisma.channel.create({
        data: {
          name: data.title,
          visibility: data.type,
          password:data.password,
          img:data.avatar
        },
      });
      const memberchannel = await this.prisma.memberChannel.create({
      data: {
        userId:userId,
        channelId:channel.id_channel,
        status_UserInChannel:'owner',
        muted:false,
      },
    });
    for (let i = 0; i < data.members.length; i++) {
      try{
          let idMbr =  await this.userService.findByName(data.members[i]);
          const memberchannel = await this.prisma.memberChannel.create({
            data: {
              userId:idMbr.id_user,
              channelId:channel.id_channel,
              status_UserInChannel:'member',
              muted:false,
            },
          });
        } catch (error) {
          throw new NotFoundException(`Error inserting records of Members in this Channel`);
        }
      }
      return (true);
    }
    catch (error) {
      throw new NotFoundException(`Channel does not created successfully`);
    }
  }

  async getChannelByName(nameVar:string)
  {
    try {

      const channel = await this.prisma.channel.findUnique({
        where: { name: nameVar },
      });
  
      if (!channel) {
        throw new NotFoundException(`channel with  ${nameVar} not found`);
      }
      return channel;
    }  catch (error) {
      throw new NotFoundException(`Channel does not created successfully`);
    }
  }

  async joinChannel(data : any, usid : number)
  {
    try {
      
      let join = 0;
      const ch = await this.getChannelByName(data.sendData.name);
      const cheak = await this.prisma.saveBanned.findFirst({
        where: {
          bannedUserId: usid,
          channelId: ch.id_channel,
          status_User: 'banned',
        },
      });
      if (cheak)
      {
        throw new NotFoundException(`your not allowed to join this channel ${ch.name} cuz  you are banned`);
      }
      if (ch)
      {
        console.log(ch);
        console.log("¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤ 1");
        if (ch.visibility === "protected")
        {
          console.log("¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤ 2");
          let test = await this.verifyPassword(data.sendData.password, ch.password);
          if (test)
          {
            join = 1;
          }
        }
          if (join == 1 || ch.visibility === "public")
          {
            console.log("¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤ 3");
              const memberchannel = await this.prisma.memberChannel.create({
                data: {
                    userId:usid,
                    channelId:ch.id_channel,
                    status_UserInChannel:'member',
                    muted:false,
                    },
                });
                console.log("############### AFTER JOINGING ");
                return true;
          }
      }
    }  catch(error)
    {
      console.log("ERRRRRRRRRRRRROR JOIN CHANNEL");
      throw new NotFoundException(`Error occured when joining this channel`);
      //  console.error('Error occured when joining this channel', error);
    } 
  }

  async updatePass(data : any, usid : number)
  {
    try {

    const ch = await this.getChannelById(data.channel_id);
    if (ch)
    {
      const record = await this.prisma.memberChannel.findUnique({
        where : {

          userId_channelId: {
            userId: usid, 
            channelId: ch.id_channel,
          },
          },
      });
      if (record)
      {
          if (record.status_UserInChannel == "owner")
          {
            if (ch.visibility == "protected")
            {
              const hashedPassword = await this.hashPassword(data.password);

              const updateChannel = await this.prisma.channel.update({
                where: {
                  id_channel: ch.id_channel,
                },
                data: {
                  password: hashedPassword,
                },
              })
              return updateChannel;
            }
          }
          else
          {
            throw new NotFoundException(`your not allowed to change the password of ${ch.name}, or the channel is not protected`);
          }
      }
      else 
      {
        throw new NotFoundException(`the user with id ${usid} is not belong to this channel ${ch.name}`);
      }
    }
    else 
    {
      throw new NotFoundException(`this Channel with Name ${ch.name} not found`);
    }
  } catch(error)
  {
    // console.error('Error occured when updating password of this channel', error);
    throw new NotFoundException('Error occured when updating password of this channel');
  } 
}


  // End !!
  async removePass(data : any, usid : number)
  {
    try{

    const ch = await this.getChannelById(data.id_channel);
    if (ch)
    {
      const record = await this.prisma.memberChannel.findUnique({
      where : {

        userId_channelId: {
          userId: usid, 
          channelId: ch.id_channel,
        },
        },
    });
    if (record)
    {
        if (record.status_UserInChannel == "owner")
        {
          if (ch.visibility == "protected")
          {
            const updateChannel = await this.prisma.channel.update({
              where: {
                id_channel: ch.id_channel,
              },
              data: {
                visibility:"public",
                password: null,
              },
            })
            return updateChannel;
          }
        }
        else
        {
          throw new NotFoundException(`your not allowed to remove the password of ${ch.name}, or the channel is not protected`);
        }
    }
    else 
    {
      throw new NotFoundException(`the user with id ${usid} is not belong to this channel ${ch.name}`);
    }
  }
  else 
  {
    throw new NotFoundException(`this Channel with Name ${ch.name} not found`);
  }
} catch(error)
  {
    // console.error('Error occured when Removing password of this channel', error);
    throw new NotFoundException('Error occured when Removing password of this channel');
  } 
}

  async setPass(data : any, usid : number)
  {
    try{

    const ch = await this.getChannelById(data.channel_id);
    if (ch)
    {
    const record = await this.prisma.memberChannel.findUnique({
      where : {
        userId_channelId: {
          userId: usid, 
          channelId: ch.id_channel,
        },
        },
    });
    if (record)
    {
        if (record.status_UserInChannel == "owner")
        {
          if (ch.visibility == "public" || ch.visibility == "privat")
          {
            const hashedPassword = await this.hashPassword(data.password);
            const updateChannel = await this.prisma.channel.update({
              where: {
                id_channel: ch.id_channel,
              },
              data: {
                visibility:"protected",
                password: hashedPassword,
              },
            })
            return (updateChannel);
          }
        }
        else
        {
          throw new NotFoundException(`your not allowed to set the password of ${ch.name}, or the channel is already protected`);

        }
    }
    else 
    {
      throw new NotFoundException(`the user with id ${usid} is not belong to this channel ${ch.name}`);
    }
  }
  else
  {
    throw new NotFoundException(`this Channel with Name ${ch.name} not found`);
  }
} catch(error)
  {
    // console.error('Error occured when setting password of this channel', error);
    throw new NotFoundException('Error occured when setting password of this channel');
  } 
}




  // END. belaan d muted kifesh andir lih hnea !!
  async setAdmin(data : any)
  {
    try {
    const ch = await this.getChannelById(data.channel_id);
    if (ch)
    {

    const record = await this.prisma.memberChannel.findUnique({
      where : {

        userId_channelId: {
          userId: data.from, 
          channelId: ch.id_channel,
        },
        },
    });

    const record2 = await this.prisma.memberChannel.findUnique({
      where : {

        userId_channelId: {
          userId: data.to, 
          channelId: ch.id_channel,
        },
        },
    });

    if (record && record2)
    {
        if (record.status_UserInChannel === "owner")
        {

          const updateChannel = await this.prisma.memberChannel.update({
            where: {
              userId_channelId: {
                userId: data.to, 
                channelId: ch.id_channel,
              },
            },
            data: {
              status_UserInChannel:"admin",
            },
          })
          return updateChannel;
        }
        else
        {
          throw new NotFoundException(`your not  the  owner of ${ch.name}`);
        }
    }
    else
    {
      // hena diri name instead of id !!!
      throw new NotFoundException(`the user with ${data.from} or ${data.to} is not belong to this channel ${ch.name}`);
    }
  }
  else
  {
    throw new NotFoundException(`this Channel with Name ${ch.name} not found`);
  }   
  } catch(error)
  {
    throw new NotFoundException('Error occured when setting admin in this channel');
    // console.error('Error occured when setting admin in this channel', error);
  } 
}

  // weslt hena f trycatch

  async kickUser(data:any, idus:number, kickcus:number)
  {
    try{

    const ch = await this.getChannelById(data.channel_id);
    if (ch)
    {
      const record = await this.prisma.memberChannel.findUnique({
        where : {

          userId_channelId: {
            userId: idus, 
            channelId: ch.id_channel,
          },
          },

      });

      const record2 = await this.prisma.memberChannel.findUnique({
        where : {

          userId_channelId: {
            userId: kickcus, 
            channelId: ch.id_channel,
          },
          },
      });
    if (record && record2)
    {
      if (record.status_UserInChannel === "owner" || record.status_UserInChannel === "admin")
      {
        if (record2.status_UserInChannel !== "owner" && record2.status_UserInChannel !== "admin")
        {
          // delete all messages of this user from channel first :
          const deleteMsg = await this.prisma.discussion.deleteMany({
            where: {
              userId: record2.userId,
              channelId: ch.id_channel,
            },
          });
          // then delete this user from channel.
          const updateChannel = await this.prisma.memberChannel.delete({
            where: {
              userId_channelId: {
                userId: record2.userId,
                channelId: ch.id_channel,
              },
            },
          })

          // save this banned user in saveBanned :
          const memberchannel = await this.prisma.saveBanned.create({
            data: {
              bannedUserId:record2.userId,
              channelId:ch.id_channel,
              status_User:'kicked',
            },
          });
          console.log(`AFTER KICKING THIS USER ${updateChannel}`);
          return updateChannel;
        }
        else
        {
          throw new NotFoundException(`you can't kicked an owner or an admin`);
        }
      }
      else
      {
        throw new NotFoundException(`your not  the  owner or admin of ${ch.name}`);
      }
    }
    else
    {
      throw new NotFoundException(`the user with ${idus} or ${kickcus} is not belong to this channel ${ch.name}`);
    }
  }
    else
    {
      throw new NotFoundException(`this Channel with Name ${ch.name} not found`);
    }
  } catch(error)
  {
    throw new NotFoundException(`Error occured when kickUser in this channel`);
  } 
}


// END

  async getChannelById(nameVar:number)
  {
 

    const channel = await this.prisma.channel.findUnique({
      where: { id_channel: nameVar },
    });

    if (!channel) {
      throw new NotFoundException(`Channel with  ${nameVar} not found`);
    }
    return channel;
  }

  async banUser(idch:number, idus:number, user_banned:number)
  {
    try{

    const ch = await this.getChannelById(idch);
    if (ch)
    {
    const record = await this.prisma.memberChannel.findUnique({
      where : {

        userId_channelId: {
          userId: idus, 
          channelId: ch.id_channel,
        },
        },
    });

    const record2 = await this.prisma.memberChannel.findUnique({
      where : {

        userId_channelId: {
          userId: user_banned, 
          channelId: ch.id_channel,
        },
        },
    });
    if (record && record2)
    {
      if (record.status_UserInChannel === "owner" || record.status_UserInChannel === "admin")
      {
        if (record2.status_UserInChannel !== "owner" && record2.status_UserInChannel !== "admin")
        {
          // delete all messages of this user from channel first :
          const deleteMsg = await this.prisma.discussion.deleteMany({
            where: {
              userId: record2.userId,
              channelId: ch.id_channel,
            },
          });
          // then delete this user from channel.
          const updateChannel = await this.prisma.memberChannel.delete({
            where: {
              userId_channelId: {
                userId: record2.userId,
                channelId: ch.id_channel,
              },
            },
          })
          // save this banned user in saveBanned :
          const memberchannel = await this.prisma.saveBanned.create({
            data: {
              bannedUserId:record2.userId,
              channelId:ch.id_channel,
              status_User:'banned',
            },
          });
          return updateChannel;
        }
        else
        {
          throw new NotFoundException(`you can't banned an owner or an admin`);
        }
      }
      else
      {
        throw new NotFoundException(`your not  the  owner or admin of ${ch.name}`);
      }
    }
    else
    {
      throw new NotFoundException(`the user with ${idus} or ${user_banned} is not belong to this channel ${ch.name}`);
    }
  }
    else
    {
      throw new NotFoundException(`this Channel with Name ${ch.name} not found`);
    }
  } catch(error)
  {
    throw new NotFoundException(`Error occured when banUser in this channel`);
  } 
  }

// END
  async muteUser(data:any, idus:number, user_muted:number)
  {
    try {
    const ch = await this.getChannelById(data.channel_id);
    if (ch)
    {
      const record = await this.prisma.memberChannel.findUnique({
        where : {

          userId_channelId: {
            userId: idus, 
            channelId: ch.id_channel,
          },
          },
      });

      const record2 = await this.prisma.memberChannel.findUnique({
        where : {
          userId_channelId: {
            userId: user_muted, 
            channelId: ch.id_channel,
          },
          },
      });
      if (record && record2)
      {
        if (record.status_UserInChannel === "owner" || record.status_UserInChannel === "admin")
        {
          if (record2.status_UserInChannel !== "owner")
          {
            
              const updateChannel = await this.prisma.memberChannel.update({
                where: {
                  userId_channelId: {
                    userId: record2.userId, 
                    channelId: record2.channelId,
                  },
                },
                  data: {
                    muted:true,
                  },
              })
              return updateChannel;
          }
          else
          {
            throw new NotFoundException(`you can't muted an owner or an admin`);
          }
        }
        else
        {
          throw new NotFoundException(`your not  the  owner or admin of ${ch.name}`);
        }
      }
      else
      {
        throw new NotFoundException(`the user with ${idus} or ${user_muted} is not belong to this channel ${ch.name}`);
      }
  }
  else
  {
    throw new NotFoundException(`this Channel with Name ${ch.name} not found`);
  }
} catch(error)
  {
    throw new NotFoundException(`Error occured when muteUser in this channel`);
  }
}


    // get all Channels of current user that has joined them:
    async getAllChannels(idUser : number )
    {
      try{
        
          const channels = await this.prisma.memberChannel.findMany({
          where: {
              userId: idUser,
                },
          include: {
              channel: true,
      },
      });
          return channels;
      }
      catch(error)
      {
        
        // console.error('Error occured when getting all channels', error);
        throw new NotFoundException(`Error occured when getting all channels`);
      }
    }
    
        async getAllAdmins(idch : number )
        {
          try{
            const usersInAdminChannel = await this.prisma.memberChannel.findMany({
              where: {
                channelId: idch,
                status_UserInChannel: 'admin',
              },
              include: {
                user: true,
                channel: true,
              },
            });

      
              let Names: string[] = [];
              if (usersInAdminChannel)
              {
                Names = usersInAdminChannel.map(member => member.user.name);
              }
              return Names;
          } 
           catch(error)
          {
            throw new NotFoundException(`Error occured  when getting all admins in this channel`);
            // console.error('Error occured when getting all admins in this channel', error);
          }
        }

        // get all Channels of current user that has joined them:
        async getAllMembers(idch : number )
        {
          try {
          const usersInAdminChannel = await this.prisma.memberChannel.findMany({
            where: {
              channelId: idch,
              status_UserInChannel: 'member',
            },
            include: {
              user: true,
              channel: true,
            },
          });

          let Names: string[] = [];
          if (usersInAdminChannel)
          {
            Names = usersInAdminChannel.map(member => member.user.name);
          
          }
          return Names;
        } catch(error)
        {
          throw new NotFoundException(`Error occured when getting all members in this channel`);
          // console.error('Error occured when getting all members in this channel', error);
        }
        }

        async getAllOwners(idch : number )
        {
    
          try {
          const usersInAdminChannel = await this.prisma.memberChannel.findMany({
            where: {
              channelId: idch,
              status_UserInChannel: 'owner',
            },
            include: {
              user: true,
              channel: true,
            },
          });
    
          let Names: string[] = [];
          if (usersInAdminChannel)
          {
            Names = usersInAdminChannel.map(member => member.user.name);
          
          }
          return Names;
         } catch(error)
          {
            throw new NotFoundException(`Error occured when getting all owners in this channel`);
            // console.error('Error occured when getting all owners in this channel', error);
          }
        }


        async getTheLastMessageOfChannel(idch : number )
        {
    
          try{
          
            const lastMessage = await this.prisma.discussion.findFirst({
              where: {
                channelId: idch
              },
              orderBy: {
                dateSent: 'desc' // or 'desc' for descending order
              }
            });
            return lastMessage;
            }
            catch (error) {
                  // console.error('we have no messages on this channel', error);
              throw new NotFoundException(`we have no messages on this channel`);
            }
        }

        // END
  async unmuteUser(data:any, idus:number, user_muted:number)
  {
    try{
    const ch = await this.getChannelById(data.channel_id);
    if (ch)
    {
      const record = await this.prisma.memberChannel.findUnique({
        where : {

          userId_channelId: {
            userId: idus, 
            channelId: ch.id_channel,
          },
          },
      });

      const record2 = await this.prisma.memberChannel.findUnique({
        where : {
          userId_channelId: {
            userId: user_muted, 
            channelId: ch.id_channel,
          },
          },
      });
      if (record && record2)
      {
        if (record.status_UserInChannel === "owner" || record.status_UserInChannel === "admin")
        {
          if (record2.status_UserInChannel !== "owner")
          {
            
              const updateChannel = await this.prisma.memberChannel.update({
                where: {
                  userId_channelId: {
                    userId: record2.userId, 
                    channelId: record2.channelId,
                  },
                },
                  data: {
                    muted:false,
                  },
              })
              return updateChannel;
          }
          else
          {
            throw new NotFoundException(`you can't muted an owner or an admin`);
          }
        }
        else
        {
          throw new NotFoundException(`your not  the  owner or admin of ${ch.name}`);
        }
      }
      else
      {
        throw new NotFoundException(`the user with ${idus} or ${user_muted} is not belong to this channel ${ch.name}`);
      }
  }
  else
  {
    throw new NotFoundException(`this Channel with Name ${ch.name} not found`);
  } 
  } catch(error)
  {
    throw new NotFoundException(`Error occured when unmute this user in this channel`);
  }
}



    async removeChannel(data: any, idus: number)
    {
      try{
      const ch = await this.getChannelById(data.channel_id);
      if (ch)
      {
          const record = await this.prisma.memberChannel.findUnique({
            where : {
    
              userId_channelId: {
                userId: idus, 
                channelId: ch.id_channel,
              },
              },
          });
          if (record)
          {
              if (record.status_UserInChannel === "owner")
              {
                // delete all messages of channel 
                const deleteMsg = await this.prisma.discussion.deleteMany({
                  where: {
                    channelId: ch.id_channel,
                  },
                });
                // // delete all members of channel 
                const users = await this.prisma.memberChannel.deleteMany({
                  where: {
                    channelId: ch.id_channel,
                  },
                });
                const chan = await this.prisma.channel.delete({
                  where: {
                    id_channel: ch.id_channel,
                  },
                });
                return true;
              }
              else
              {
                throw new NotFoundException(`your not  the  owner  of ${ch.name}`);
              }
          }
          else
          {
            throw new NotFoundException(`the user with ${idus} is not belong to this channel ${ch.name}`);
          }
      }
      else
      {
        throw new NotFoundException(`this Channel with Name ${ch.name} not found`);
      }
    }
   catch(error)
  {
    // console.error('Error occured when remove this channel', error);
    throw new NotFoundException(`Error occured when remove this channel`);
  }
  }
  
  
  // end 
}