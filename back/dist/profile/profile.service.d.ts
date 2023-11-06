import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from 'src/jwt/jwtservice.service';
export declare class ProfileService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    ModifyName(dat: any, req: any, res: any): Promise<Number>;
    ModifyPhoto(photo: any, req: any, res: any): Promise<void>;
    About_me(req: any, res: any): Promise<{
        id_user: number;
        name: string;
        avatar: string;
        TwoFactor: boolean;
        IsFirstTime: boolean;
        secretKey: string;
        About: string;
        status_user: string;
    }>;
}
