import {UseInterceptors, 
        UploadedFile,
        Controller,
        Req,
        Post,
        Get,
        Res,
        Body} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './nameDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from 'src/jwt/jwtservice.service';

@Controller('profile')
export class ProfileController {
    constructor (private Profile: ProfileService, private prisma: PrismaService, private jwt:JwtService) {}

    @Post('modify-name')
    async Name_Modification(@Body() data: CreateUserDto, @Req() req:any, @Res() res:any)
    {
      const result = await this.Profile.ModifyName(data, req, res);
      // console.log(data);
      // res.send('in profile modification route');
      // return `Received data: ${JSON.stringify(data)}`;
      // res.send('name well changed');
      // console.log('wssalt hna');
      if (result == 400)
        res.status(400).json({msg: "name already exists"});
      res.status(200).json({msg: "name well setted"});
      return({msg: 'i am in the pofile controller now'});
    }

  
    @Post('modify-photo')
    @UseInterceptors(FileInterceptor('photo'))
    Photo__Modification(@Body() data:any ,@UploadedFile() photo, @Req() req, @Res() res){

      // console.log(data.photo);
      this.Profile.ModifyPhoto(photo, req, res);
      console.log(photo);
      // res.status(200).json({msg: 'photo well setted'});
      // const filePath = 'uploads/' + photo.originalname; // Use the original name or generate a unique name
      // fs.writeFileSync(filePath, photo.buffer);

    }

    @Post('About')
    async About_me(@Body() data:any, @Req() req, @Res() res){

      console.log('about well setted');
      console.log(data);
      const payload = this.jwt.verify(req.cookies['cookie']);
      const ab :string = data.About;
      await this.prisma.user.update({
        where: {id_user: payload.id},
        data:{
          About: ab,
        },
      });
    }

    @Get('About')
    async Get_About(@Req() req, @Res() res) {
      
      const user = await this.Profile.About_me(req, res);
      console.log(user.About);
      return (user.About);
      
    }

}
