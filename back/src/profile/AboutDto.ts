import { IsString, IsNotEmpty, MaxLength } from "class-validator";

export class ProfileDto {
  @IsNotEmpty({ message: "empty" })
  @IsString({ message: "no number" })
  @MaxLength(150, { message: "too long" })
  readonly About: string;
}
