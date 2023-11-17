import { Injectable, Req, Body ,ForbiddenException} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '../auth/jwt/jwtservice.service';
import { CreateUserDto } from './nameDto';
import * as fs from 'fs';
//import from vite.config.ts
@Injectable()
export class ProfileService {
    constructor(private prisma: PrismaService, private jwt:JwtService){}

    async ModifyName(dat :any, req :any, res :any): Promise<any>{
        // console.log('name : ' + dat.name);
        const Token = req.cookies['cookie'];
        const verifyToekn = this.jwt.verify(Token);
        // console.log(verifyToekn);
        try{
            const user = await this.prisma.user.update({
                where: {id_user : verifyToekn.id},
                data: {
                    name : dat.name,
                },
            });
           
            // verifyToekn.login = dat.name;
            // console.log(user);
            // res.cookie('cookie', this.jwt.sign(verifyToekn));

        }catch(error){
            if (error.code == 'P2002')
                return ('P2002');
                // res.status(400).json({error: 'name already exists'});
        }
    }

    async ModifyPhoto(photo:any, req:any, res:any) {

        const verifyToken = this.jwt.verify(req.cookies['cookie']);
        console.log('orginal name : ', photo.originalname);

        const filePath = '/goinfre/lelbakna/freez/last_transendance/front/public/uploads/' + photo.originalname; // Use the original name or generate a unique name
        const rightPath = '/public/uploads/' + photo.originalname;//path to store in db
        // console.log("filePath");
        console.log(photo.originalname);
        fs.writeFileSync(filePath, photo.buffer);
        console.log('tswiraaaaaaa');
        try{
            await this.prisma.user.update({
                where: {id_user : verifyToken.id},
                data: {
                    avatar : rightPath,//update avatar
                },
            });
            // verifyToken.avatar = rightPath;//update avatar
            // console.log(userInfos);
            // res.cookie('cookie', this.jwt.sign(verifyToken));
        }catch(error){
            console.log(error);
            // if (error.code == 'P2002')
                // res.status(400).json({error: 'name already exists'});
        }
    }
    async About_me(req, res) {
        const payload = this.jwt.verify(req.cookies['cookie']);
        const user = await this.prisma.user.findUnique({
            where: { id_user: payload.id },
        });
        return (user);
    }
}

