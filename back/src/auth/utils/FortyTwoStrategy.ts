import { Injectable , ExecutionContext, Res, Req} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-42';
import { AuthService } from "../auth.service";
import { JwtService } from "../jwt/jwtservice.service";
import axios from 'axios';
import { Response } from "express";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {

    constructor(private authservice:AuthService, private jwt: JwtService
                , private prisma: PrismaService){
        super({
            // clientID: 'u-s4t2ud-177f947b1919769eb745d968a57a1955703b6caa7ed71b46625b10cfbbd787ef',
            // clientID: 'u-s4t2ud-d9fed53f36349b40d82e57fc96436919282944d16170e23ebe8ba4c1a0194679',
            clientID: 'u-s4t2ud-7660428a75b234d92e16fe0f27a95abbc8a46a63f7c6ba0f3650f63e000a1031',
            // clientSecret: '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',
            // clientSecret: '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',
            clientSecret: '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',
            callbackURL: 'http://localhost:3000/auth/login/42/redirect',

            // scope: ['public'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, @Req() req, @Res() res){

        // const decodedToken = this.jwt.verify(req.cookies['cookie']);
        // if (!decodedToken){
        //     const user = await this.prisma.user.findUnique({where :{ id_user:req.user.id }})
        //     if (user.TwoFactor)
        //         res.redirect('http://localhost:3000/auth/')
        // }

        const payload = await this.authservice.ValidateUsers(profile._json, req, res);

        // console.log(res.Body);
        // res.req.session.token = payload;
        // console.log(payload);

        // axios.post('http://localhost:3000/auth/login/save-session', {session :payload});
        // console.log(this.jwt.verify(payload));
        // const jwtToken = await this.jwt.sign(payload);
        // console.log(profile);

        return payload;
    }
}