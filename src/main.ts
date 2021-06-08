import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());

    await app.listen(Number(process.env.APP_PORT));
    console.log(`Server run: ${process.env.APP_URL}`);
    console.log(`Swagger documentation: ${process.env.APP_URL_SWAGGER}`);
}
bootstrap();
