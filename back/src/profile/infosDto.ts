import { IsNumber, IsBoolean, IsNotEmpty } from "class-validator";

export class Infos {
  @IsNotEmpty()
  @IsNumber()
  readonly homie_id: number;

  @IsNotEmpty()
  @IsBoolean()
  readonly invited: boolean;

  @IsNotEmpty()
  @IsBoolean()
  readonly homies: boolean;
}
