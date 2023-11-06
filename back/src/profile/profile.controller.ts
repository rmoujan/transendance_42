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
    constructor (private Profile: ProfileService, private prisma: PrismaService, private jwt: JwtService) {}

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
    Photo__Modification(@Body() data:any ,@UploadedFile() photo, @Req() req, @Res() res){

      // console.log(data.photo);
      this.Profile.ModifyPhoto(photo, req, res);
      console.log(photo);
      // res.status(200).json({msg: 'photo well setted'});
      // const filePath = 'uploads/' + photo.originalname; // Use the original name or generate a unique name
      // fs.writeFileSync(filePath, photo.buffer);

    }

	@Post('Bot-Pong')
	async VsBoot(@Req() req:any, @Body() body){
		console.log(body);
		const decoded = this.jwt.verify(req.cookies['cookie']);
		const user = await this.prisma.user.findUnique({where: {id_user: decoded.id}});
		if (body.won){
			await this.prisma.user.update({
				where : {id_user: decoded.id},
					data :{
						wins: user.wins++,
						games_played: user.games_played++,
						history:{
							create:{
								winner: true,
								userscore: body.userScore,
								enemyId: 9,
								enemyscore: body.botScore,
							},
						},
					},
			})
		}
		else {
			await this.prisma.user.update({
				where : {id_user: decoded.id},
					data :{
						losses: user.losses++,
						games_played: user.games_played++,
						history:{
							create:{
								winner: false,
								userscore: body.userScore,
								enemyId: 9,
								enemyscore: body.botScore,
							},
						},
					},
			})
		}
	}
}
