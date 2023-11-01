import { PrismaService } from '../prisma.service';
import { JwtService } from 'src/jwt/jwtservice.service';
export declare class ProfileService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    ModifyName(dat: any, req: any, res: any): Promise<void>;
    ModifyPhoto(photo: any, req: any, res: any): Promise<void>;
}
