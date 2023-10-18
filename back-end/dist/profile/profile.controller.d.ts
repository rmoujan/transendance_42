import { ProfileService } from './profile.service';
import { CreateUserDto } from './nameDto';
export declare class ProfileController {
    private Profile;
    constructor(Profile: ProfileService);
    Name_Modification(data: CreateUserDto, req: any, res: any): {
        msg: string;
    };
    Photo__Modification(photo: any, req: any, res: any): void;
}
