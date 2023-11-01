import {Res, Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { JwtService } from './jwtservice.service';
// import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaService } from '../prisma.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private prisma: PrismaService,private readonly JwtService : JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        // Extract the JWT token from cookies
        const token = request.cookies.cookie; // Replace 'jwt' with the name of your JWT cookie

        if (!token) {
            return false; // No JWT cookie found
        }

        try {
            const decoded = this.JwtService.verify(token);
            console.log(decoded);
            // const id_user = decoded.id;
            // const find = await this.prisma.user.findUnique({
            //     where: {id_user},
            // });
            
            // if (find.TwoFactor){
                
            // }
            
            // You can also add logic to check if the token is still valid (e.g., token expiration)
            
            // const tokenIsValid = this.isTokenNotExpired(decoded.exp); // Replace with your token validation logic
            // if (!tokenIsValid) {
                //     return false; // Token is not valid
                // }
                
                const response = context.switchToHttp().getResponse();
                // response.redirect('http://localhost:5173/login');
                if (!decoded){
                    response.redirect('http://localhost:5173/');
                    console.log('got here');
                    return true;
                }
                // If the token is valid and the user exists, attach the user or token payload to the request for further processing.
                request.user = decoded;

                return true;
        } catch (error) {
            // console.log(error);
            console.log('falsyyyyyy');
            // Handle token verification errors (e.g., expired or invalid tokens).
            return false;
        }
    }

    isTokenNotExpired(expirationTimestamp: number): boolean {
        console.log(expirationTimestamp);
        const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds

        // Check if the expiration timestamp is in the future
        return expirationTimestamp > currentTimestamp;
    }
    
    // private readonly secretKey = 'asddfsdf5456dsf45ds';

    // verify(token: string): any {
    //     try {
    //         // console.log(token);
    //         return jwt.verify(token, this.secretKey, { algorithms: ['HS256'] });
    //     } catch (err) {
    //         console.log(err);
    //         console.log('falsoooooo');
    //         return null;
    //     }

    // }

}
