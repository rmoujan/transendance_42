// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(userId: number) {
    if (userId)
    {
      const user = await this.prisma.user.findUnique({
        where: { id_user: userId },
      });
  
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
  
      return user;
    }
  }
  async findAll() {
    return this.prisma.user.findMany();
  }
  
  async findByName(name: string) {
    if (name)
    {
      const user = await this.prisma.user.findUnique({
        where: { name: name },
      });
      
  
      if (!user) {
        throw new NotFoundException(`User with ${name} not found`);
      }
      return user;
    }
  }

}
