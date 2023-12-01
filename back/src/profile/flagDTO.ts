import { IsNumber, IsNotEmpty } from "class-validator";

export class flagDTO {
  @IsNotEmpty()
  @IsNumber()
  readonly flag: number;
}