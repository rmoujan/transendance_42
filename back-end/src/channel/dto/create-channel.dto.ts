import { IsString, Length, IsNotEmpty, IsIn, ValidateIf } from "class-validator";

// that will be the data that Iam expect by the client when creating a new channel.
export class CreateChannelDto {
    @IsNotEmpty({ message: 'Property must not be empty' })
    @Length(5, 15) 
    readonly name: string;

    @IsNotEmpty({ message: 'Property must not be empty' })
    @IsString()
    @IsIn(['public', 'private', 'protected'])
    readonly visibility:string;
    
    @ValidateIf((o) => o.password !== undefined) 
     @Length(5, 15) 
    readonly password?:string;
  }

// that will be the data that Iam expect by the client when creating a new channel.
export class CreateMemberDto {

  readonly userId: number;
  readonly channelId:number;
  readonly status_UserInChannel:string;
}