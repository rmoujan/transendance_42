import { IsNumber, IsNotEmpty, IsString } from "class-validator";

export class NumberDto {
  @IsNotEmpty()
  @IsString()
  readonly inputValue: string;
}
