import { JwtService } from 'src/jwt/jwtservice.service';
import { PrismaService } from '../prisma.service';
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    LoginToFortyTwo(): {
        msg: string;
    };
    ValidateUsers(infos: any, req: any, res: any): Promise<{
        id: any;
        login: any;
        fullname: any;
        image: any;
        email: any;
    }>;
    GenerateQrCode(req: any): Promise<any>;
    Verify_QrCode(body: any, req: any): Promise<{
        msg: string;
    }>;
}
