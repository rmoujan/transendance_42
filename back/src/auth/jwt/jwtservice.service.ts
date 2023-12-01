import { Injectable } from '@nestjs/common';
import { ExtractJwt , Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import * as jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService extends PassportStrategy(Strategy, 'jwt') {

    constructor(private config: ConfigService) {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: config.get('secretOrKey'),
        });
      }

    async validate(payload: any) {
        return {
            id: payload.sub,
            username: payload.username,
            email: payload.email,
            image: payload.profileImage,
            token: payload.token,
        };
    }

    private readonly secretKey = this.config.get('cookiesecretKey');

    sign(payload: User) {
        return jwt.sign(payload, this.secretKey, { expiresIn: '6h'}); // Adjust expiration as needed
        // NOTE(XENOBAS): HARD CODED MAGIC VALUE 6h SHOULD BE ENV VARIABLE
    }

    verify(token: string): any {
        try {
            return jwt.verify(token, this.secretKey);
        } catch (err) {
            return null;
        }
    }
}
