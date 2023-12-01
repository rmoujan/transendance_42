import { IsBoolean, IsNotEmpty } from "class-validator";

export class TFDTO {
  @IsNotEmpty()
  @IsBoolean()
  readonly enable: boolean;
}