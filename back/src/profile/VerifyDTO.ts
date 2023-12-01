import { IsBoolean, IsNotEmpty } from "class-validator";

export class VerifyDTO {
  @IsNotEmpty()
  @IsBoolean()
  readonly verify: boolean;
}