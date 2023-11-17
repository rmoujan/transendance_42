import { IsNumber, IsNotEmpty } from "class-validator";

export class NumberDto {
  @IsNotEmpty()
  @IsNumber()
  readonly id_user: number;
}
