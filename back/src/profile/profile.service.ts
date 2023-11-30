import { Injectable} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '../auth/jwt/jwtservice.service';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProfileService {
    constructor(private prisma: PrismaService,
        private jwt:JwtService,
        private config: ConfigService
        ){}

    async ModifyName(dat :any, req :any, res :any): Promise<any>{
        try{
            const Token = req.cookies[this.config.get('cookie')];
            const verifyToekn = this.jwt.verify(Token);
            const user = await this.prisma.user.update({
                where: {id_user : verifyToekn.id},
                data: {
                    name : dat.name,
                },
            });
        }catch(error){
            if (error.code == 'P2002')
                return ('P2002');
        }
    }

    async ModifyPhoto(photo:any, req:any, res:any) {
        try{
            const verifyToken = this.jwt.verify(req.cookies[this.config.get('cookie')]);
            const filePath = '/home/mmanouze/Desktop/last/front/public/uploads/' + photo.originalname; // Use the original name or generate a unique name
            const rightPath = '/public/uploads/' + photo.originalname;//path to store in db
            fs.writeFileSync(filePath, photo.buffer);
            await this.prisma.user.update({
                where: {id_user : verifyToken.id},
                data: {
                    avatar : rightPath,
                },
            });
        }catch(error){}
    }

    async About_me(req) {
        try{
            const payload = this.jwt.verify(req.cookies[this.config.get('cookie')]);
            const user = await this.prisma.user.findUnique({
                where: { id_user: payload.id },
            });
            return (user);
        }catch(error){}
    }
}
