import { IsString, Length, IsNotEmpty, IsIn, ValidateIf, IsNumber, IsInt, IsOptional, IsArray } from "class-validator";

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

// export class CreateDmDto {
//   id_dm : number
//   senderId : number      
//   receiverId : number   
//   unread : number 
//   pinned :Boolean
// }


export class CreateChannelDto {
  @IsOptional()
  @IsString()
  readonly avatar?: string;

  @IsOptional()
  @IsString()
  readonly passwordConfirm?: string | null;

  @IsOptional()
  @IsString()
  readonly password?: string | null;

  @IsArray()
  readonly members: string[];

  @IsString()
  readonly title: string;

  @IsString()
  readonly type: string;

}




class JoinChannelDataDto {
  @IsInt()
  id_channel: number;

  @IsString()
  name: string;

  @IsString()
  visibility: string;

  @IsOptional()
  @IsString()
  password: string | null;
}

export class JoinChannelDto {
  sendData: JoinChannelDataDto;
}
