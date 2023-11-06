import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
// import { Response } from "express";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
 
  // @Get()
  // root(@Res() res: Response) {
  //     res.send("<h1>Hello World!</h1>");
  // }
}
