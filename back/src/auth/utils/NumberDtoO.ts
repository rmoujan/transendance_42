import { IsNumber, IsNotEmpty, IsString } from "class-validator";

export class NumberDtoO {
  @IsNotEmpty()
  @IsNumber()
  readonly id_user: number;
}
