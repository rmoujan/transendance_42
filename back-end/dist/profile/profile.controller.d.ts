import { ProfileService } from './profile.service';
import { CreateUserDto } from './nameDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from 'src/jwt/jwtservice.service';
export declare class ProfileController {
    private Profile;
    private prisma;
    private jwt;
    constructor(Profile: ProfileService, prisma: PrismaService, jwt: JwtService);
    Name_Modification(data: CreateUserDto, req: any, res: any): Promise<{
        msg: string;
    }>;
    Photo__Modification(data: any, photo: any, req: any, res: any): void;
    About_me(data: any, req: any, res: any): Promise<void>;
    Get_About(req: any, res: any): Promise<string>;
}
