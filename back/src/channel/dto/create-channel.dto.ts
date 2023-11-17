import { IsString, Length, IsNotEmpty, IsIn, ValidateIf, IsNumber, IsInt, IsOptional } from "class-validator";

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
// export class CreateMemberDto {

//   @IsNotEmpty({ message: 'Property must not be empty' })
//   @IsNumber()
//   readonly id_channel: number;

//   @IsString()
//   @IsNotEmpty({ message: 'Property must not be empty' })
//   readonly name:string;

//   @IsString()
//   @IsNotEmpty({ message: 'Property must not be empty' })
//   readonly visibility:string;

//   @IsString()
//   readonly password?:string | null;
// }

export class CreateMemberDto {
  @IsInt()
  readonly id_channel: number;

  @IsString()
  readonly name: string;

  @IsString()
  readonly visibility: string;

  @IsOptional()
  @IsString()
  readonly password?: string | null;
}

export class joinDto {
  readonly sendData: CreateMemberDto;
}


export class CreateDmDto {
  id_dm : number
  senderId : number      
  receiverId : number   
  unread : number 
  pinned :Boolean
}