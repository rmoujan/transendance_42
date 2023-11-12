import {Res, Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { JwtService } from './jwtservice.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private prisma: PrismaService,private readonly JwtService : JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        // Extract the JWT token from cookies
        const token = request.cookies.cookie;

        if (!token) {
            response.send("false").status(401);
            return false;
        }

        try {
            const decoded = this.JwtService.verify(token);
            // console.log(decoded);
            if (!decoded){
                response.send("false").status(401);
                return false;
            }
            // const user = await this.prisma.user.findUnique({where : {id_user: decoded.id}});
            // if (user.TwoFactor){ 
            //     response.send("redirect to 2fa");
            //     return false;
            //  }            
            return true;
        } catch (error) {
            console.log('falsyyyyyy');
            return false;
        }
    }


    isTokenNotExpired(expirationTimestamp: number): boolean {
        console.log(expirationTimestamp);
        const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds

        // Check if the expiration timestamp is in the future
        return expirationTimestamp > currentTimestamp;
    }
}