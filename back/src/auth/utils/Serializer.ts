import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly prisma: PrismaService,
  ) {
    super();
  }

  serializeUser(user: any, done: Function) {
    console.log('Serializer User');
    done(null, user);
  }

  async deserializeUser(payload: any, done: Function) {
    const user = await this.prisma.user.findUnique(payload.id);
    console.log('Deserialize User');
    // console.log(user);
    return user ? done(null, user) : done(null, null);
  }
}
