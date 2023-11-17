// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id_user: userId },
    });

    if (!user) {
      console.log("user not found\n");
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }
  async findAll() {
    return this.prisma.user.findMany();
  }
  
  async findByName(name: string) {
    const user = await this.prisma.user.findUnique({
      where: { name: name },
    });

    if (!user) {
      throw new NotFoundException(`User with ${name} not found`);
    }
    return user;
  }

  // async getFreinds(id: number) {

  //     console.log("Call FRom userService");
  //   const userWithFriends = await this.prisma.user.findUnique({
  //     where: { id_user: id },
  //     include: {
  //       freind: true,
  //     },
  //   });
    
  //   if (userWithFriends) {
  //     const friends = userWithFriends.freind;
  //     console.log(friends);
  //   } else {
  //       throw new NotFoundException(`User with ${id}} not found`);
  //     }
    
  //   return userWithFriends;
  // }
}
