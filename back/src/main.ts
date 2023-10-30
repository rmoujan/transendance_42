import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.use(cookieParser());
  
  // app.use(
  //   session({
  //   secret: 'your-secret-key', // Replace with a strong secret
  //   resave: false,
  //   saveUninitialized: false,
  //   cookie: {
  //     maxAge: 600000000,
  //   },
  // }),
  // );

  // app.use(passport.initialize());
  // app.use(passport.session());
  app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173', // Replace with the domain of your frontend
  }));
  
  
  await app.listen(3000, () => {
		console.log("Server is running on http://localhost:3000");
	});
}

bootstrap();

