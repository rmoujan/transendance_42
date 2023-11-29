import { PassportSerializer } from '@nestjs/passport';
import { PrismaService } from 'src/prisma.service';
export declare class SessionSerializer extends PassportSerializer {
    private readonly prisma;
    constructor(prisma: PrismaService);
    serializeUser(user: any, done: Function): void;
    deserializeUser(payload: any, done: Function): Promise<any>;
}
