import { IsBoolean, IsNotEmpty } from "class-validator";

export class BooleanDto {
  @IsNotEmpty()
  @IsBoolean()
  readonly status: boolean;
}
