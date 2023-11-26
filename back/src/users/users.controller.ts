import { Controller, Get, Req, Body, Patch, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtService } from '../auth/jwt/jwtservice.service';
import * as cookieParser from 'cookie-parser';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('users')
export class UsersController {
    constructor(private jwt:JwtService,private readonly usersService: UsersService, private  cloudinaryService: CloudinaryService) {}

    @Get()
    findAllUsers() {
        return this.usersService.findAll();
    }
    @Get(':id')
    async findById(id:number) {

        const user = await this.usersService.findById(id);
        return (user);
    }
    @Get(':name')
    async findByName(name:string) {
        
        const user = await this.usersService.findByName(name);
        return (user.id_user);
    }
    // // hadhsi bash ytesta khaso front !!!
    // @Get('myFriend')
    // async getFreinds(@Req() req, @Body() data:any)
    // {
    //     const decode = this.jwt.verify(req.cookies['cookie']);
    //     const user = await this.findById(decode.id);
    //      const id = data;
    //       console.log(`Freinds  ${data}`);
    //     const Freinds = await this.usersService.getFreinds(
    //         id
    //       );
    // }


  @Patch('upload/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async updateUserDetails(
    @UploadedFile() file: Express.Multer.File,
  ) {
      try {
          const rest = await this.cloudinaryService.uploadImage(file);
            const avatarUrl = rest.secure_url;
          return avatarUrl;
        } catch (error) {
            console.log("error in uploading: ", error)
                return error;
        }
  }
}
