import { UsersService } from './users.service';
import { JwtService } from '../jwt/jwtservice.service';
export declare class UsersController {
    private jwt;
    private readonly usersService;
    constructor(jwt: JwtService, usersService: UsersService);
    findAllUsers(): Promise<{
        id_user: number;
        name: string;
        avatar: string;
        TwoFactor: boolean;
        IsFirstTime: boolean;
        secretKey: string;
        status_user: string;
    }[]>;
    findById(id: number): Promise<{
        id_user: number;
        name: string;
        avatar: string;
        TwoFactor: boolean;
        IsFirstTime: boolean;
        secretKey: string;
        status_user: string;
    }>;
    findByName(name: string): Promise<number>;
}
