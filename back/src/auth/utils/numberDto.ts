import { IsNumber, IsNotEmpty } from "class-validator";

export class NumberDto {
  @IsNotEmpty()
  @IsString()
  readonly id_user: number;
}
