import { Injectable, ExecutionContext, Res, Req } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-42';
import { AuthService } from "../auth.service";
import { JwtService } from "../jwt/jwtservice.service";
import axios from 'axios';
import { Response } from "express";
import { PrismaService } from "src/prisma.service";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {


    constructor(private authservice: AuthService, private jwt: JwtService
        , private prisma: PrismaService,private config: ConfigService) {
        super({
            clientID: config.get('clientID'),
            clientSecret: config.get('clientSecret'),
            callbackURL: config.get('callbackURL'),
        });
    }

    
    async validate(accessToken: string, refreshToken: string, profile: any, @Req() req, @Res() res) {
        try {
            const payload = await this.authservice.ValidateUsers(profile._json, req, res);
            return payload;
        }
        catch(error){}
    }
}