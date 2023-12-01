import { Res, Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
// import { JwtService } from '@nestjs/jwt';
import * as jwt from "jsonwebtoken";
import { JwtService } from "./jwtservice.service";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private readonly JwtService: JwtService
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // Extract the JWT token from cookies
    const token = request.cookies.cookie; // NOTE(XENOBAS): HERE YOU ARE NOT ACCESSING THE request.cookies USING THE ENV VARIABLE `cookie`

    if (!token) {
      response.send("false").status(401);
      return false;
    }
    try {
      const decoded = this.JwtService.verify(token);
      if (!decoded) {
        response.send("false").status(401);
        return false;
      }
      const user = await this.prisma.user.findUnique({
        where: { id_user: decoded.id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
