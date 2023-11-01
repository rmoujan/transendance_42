import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';


@Injectable()
export class ChatService {

    constructor(private prisma: PrismaService) {}
    // Find a CHANNEL By ID
    async findChannel( idch : number )
    {
        const channel = await this.prisma.channel.findUnique({
        where: {
            id_channel: idch,
        },
        })
        return (channel);
    }
    // get all users in a specific channel :
    async getUsersInChannel( idch : number )
    {
        const users = await this.prisma.memberChannel.findMany({
            where: {
                channelId: idch,
            },
          })

        return (users);
    }

}
