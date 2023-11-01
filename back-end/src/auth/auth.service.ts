import { ExecutionContext, Injectable, Res } from '@nestjs/common';
import { JwtService } from 'src/jwt/jwtservice.service';
// import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaService } from '../prisma.service';

import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService, private jwt: JwtService){}

    LoginToFortyTwo(){
        return ({msg: 'we will finish this at the right time'});
    }

    async ValidateUsers(infos :any, req:any, res:any){
        try{

            const {id, email, login, first_name, last_name , displayname ,image} = infos;
            const obj = {id: id, login: login, fullname: displayname, image: image.link, email: email};

            const id_user = id;
            const find = await this.prisma.user.findUnique({
                where: {id_user},
            });
            if (find)
            {
                // if (find.TwoFactor)
                //     res.redirect('http://localhost:3000/auth/get-qrcode');
                // console.log('when we found the user in the data base');
                // console.log(find);
                const obj = {id: id, login: login, fullname: displayname, image: image.link, email: email};

                return obj;
            }
            await this.prisma.user.create({
                data : {
                    id_user : id,
                    name : login,
                    avatar : image.link,
                    TwoFactor : false,
                    status_user: "online",
                    IsFirstTime: true,
                },
            });
            return obj;

        }catch(error){

            console.log(error);
        }
    }

    async GenerateQrCode(req:any){
        const sKey = authenticator.generateSecret();

        const decoded = this.jwt.verify(req.cookies['cookie']);
        const user =  await this.prisma.user.update({
            where: {id_user: decoded.id},
          data: { secretKey: sKey },
        });
        console.log(user);
        const otpAuthURL = authenticator.keyuri(decoded.email, 'YourAppName', sKey);
        
        const qrCodeOptions = {
            errorCorrectionLevel: 'L', // You can customize this option as needed
            width: 250, // Specify the desired width
            height: 250, // Specify the desired height
            margin: 1,
            color: {
                dark: "#3D3C65",
                light: "#B7B7C9"
            }
        };

        const qrCodeDataURL =  qrcode.toDataURL(otpAuthURL, qrCodeOptions);
        
        return qrCodeDataURL;
    }

    async Verify_QrCode(body:any, req:any){
    /* 98853 mmanouze */
    // console.log(body);
    //   const { code } = body;
      const decoded = this.jwt.verify(req.cookies['cookie']);
      const user =  await this.prisma.user.findUnique({where: {id_user: decoded.id}});
    //   const user = await this.prisma.user.findUnique({where: {id_user: decoded.id}});
    // console.log(user);
      if (authenticator.verify({token:body.inputValue, secret: user.secretKey}))
        return ({msg: 'true'});
      else
        return ({msg: 'false'});
    }

}
