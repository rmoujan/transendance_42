import { User } from '@prisma/client';
declare const JwtService_base: new (...args: any[]) => any;
export declare class JwtService extends JwtService_base {
    constructor();
    validate(payload: any): Promise<{
        id: any;
        username: any;
        email: any;
        image: any;
        token: any;
    }>;
    private readonly secretKey;
    sign(payload: User): string;
    verify(token: string): any;
}
export {};
