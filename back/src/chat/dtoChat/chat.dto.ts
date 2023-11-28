import { IsString, Length, IsNotEmpty, IsIn, ValidateIf, IsNumber, IsInt, IsOptional } from "class-validator";

// that will be the data that Iam expect by the client when creating a new channel.
export class ChatDto {
    @IsNotEmpty({ message: 'Property must not be empty' })
    readonly to: number;

    @IsNotEmpty({ message: 'Property must not be empty' })
    readonly from:number;

    @IsNotEmpty({ message: 'Property must not be empty' })
    readonly channel_id:number;
  }

//   to: 62669, from: 90652, channel_id: 19