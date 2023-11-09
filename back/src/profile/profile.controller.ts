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
	
	@Post('Bot-Pong')
	async VsBoot(@Req() req:any, @Body() body){
		console.log(body);
		const decoded = this.jwt.verify(req.cookies['cookie']);
		const user = await this.prisma.user.findUnique({where: {id_user: decoded.id}});
    let gameP:number = user.games_played + 1;
    let gameW:number = user.wins;
    let gameL:number = user.losses;
    console.log('game_played: ' +user.games_played);
		if (body.won){
      gameW++;
			await this.prisma.user.update({
				where : {id_user: decoded.id},
					data :{
						wins: gameW,
						games_played: gameP,
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
      gameL++;
			await this.prisma.user.update({
				where : {id_user: decoded.id},
					data :{
						losses: gameL,
						games_played: gameP,
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

  @Get('NotFriends')
  async NotFriendsUsers(@Req() req){

    const decoded = this.jwt.verify(req.cookies['cookie']);
    const users = this.prisma.user.findMany({
      where:{
        NOT:{
          freind:{
            some:{
              id_freind : decoded.id,
            },
          },
        },
      },
    });
    const FinalUsers =  (await users).filter((scope => {if (scope.id_user != decoded.id){return (scope)}}));
    console.log(FinalUsers);
    return (FinalUsers);
  }

  @Get('Notifications')
  async GetNotifications(@Req() req){
    const decoded = this.jwt.verify(req.cookies['cookie']);
    const user = await this.prisma.user.findUnique({
      where: {id_user: decoded.id},
      include:{
        notification: true,
      },
    });
    // console.log(user.notification);
    return (user.notification);
  }
}
