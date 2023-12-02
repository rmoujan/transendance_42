import { IsNumber, IsNotEmpty, IsString } from "class-validator";

export class NumberDtoO {
  @IsNotEmpty()
  @IsNumber()
  readonly id_user: number;
}

export class deblockDTO {
  @IsNotEmpty()
  @IsNumber()
  readonly id_user: number;
  readonly blocked: number;
}