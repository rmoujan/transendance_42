import { IsNumber, IsBoolean, IsNotEmpty } from "class-validator";

export class MixedDto {
  @IsNotEmpty()
  @IsNumber()
  readonly userScore: number;

  @IsNotEmpty()
  @IsNumber()
  readonly botScore: number;

  @IsNotEmpty()
  @IsBoolean()
  readonly won: boolean;
}
