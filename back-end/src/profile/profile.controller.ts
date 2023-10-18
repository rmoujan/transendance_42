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

@Controller('profile')
export class ProfileController {
    constructor (private Profile: ProfileService) {}

    @Post('modify-name')
    Name_Modification(@Body() data: CreateUserDto, @Req() req:any, @Res() res:any)
    {
      this.Profile.ModifyName(data, req, res);
      // console.log(data);
      // res.send('in profile modification route');
      // return `Received data: ${JSON.stringify(data)}`;
      // res.send('name well changed');
      // console.log('wssalt hna');
      res.status(200).json({msg: "name well setted"});
      return({msg: 'i am in the pofile controller now'});
    }

    @Post('modify-photo')
    @UseInterceptors(FileInterceptor('photo'))
    Photo__Modification(@UploadedFile() photo, @Req() req, @Res() res){
      
      this.Profile.ModifyPhoto(photo, req, res);
      console.log(photo);
      res.status(200).json({msg: 'photo well setted'});
      // const filePath = 'uploads/' + photo.originalname; // Use the original name or generate a unique name
      // fs.writeFileSync(filePath, photo.buffer);

    }

}
