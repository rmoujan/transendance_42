import { Injectable } from '@nestjs/common';
import { ExtractJwt , Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import * as jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

@Injectable()
export class JwtService extends PassportStrategy(Strategy, 'jwt') {

    constructor() {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        //   ignoreExpiration: false,
          secretOrKey: 'asddfsdf5456dsf45ds',
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

    private readonly secretKey = 'asddfsdf5456dsf45ds';

    sign(payload: User) {
        return jwt.sign(payload, this.secretKey, { expiresIn: '6h'}); // Adjust expiration as needed
    }

    verify(token: string): any {
        // console.log('nooot here');
        try {
            return jwt.verify(token, this.secretKey);
        } catch (err) {
            return null;
        }

    }
}
