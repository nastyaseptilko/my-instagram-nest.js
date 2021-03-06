import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import * as session from 'express-session';
import * as hbs from 'express-handlebars';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from 'src/logger/logger.service';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const logger = app.get<Logger>(Logger);
    app.useLogger(logger);
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());
    app.useStaticAssets(join(__dirname, '..', 'static'));
    app.useStaticAssets(join(__dirname, '..', 'uploads'));
    app.setBaseViewsDir(join(__dirname, '..', 'views'));

    app.set('view engine', 'hbs');

    app.engine(
        'hbs',
        hbs({
            extname: 'hbs',
            layoutsDir: join(__dirname, '..', 'views/layouts'),
            partialsDir: join(__dirname, '..', 'views/partials'),
        }),
    );

    app.use(session({ secret: process.env.JWT_SECRET as string }));

    const options = new DocumentBuilder()
        .setTitle('INSTAGRAM')
        .setVersion('1.0')
        .setDescription(process.env.DESCRIPTION_FOR_SWAGGER as string)
        .setContact(
            process.env.NAME_AUTHOR as string,
            process.env.APP_URL_SWAGGER as string,
            process.env.EMAIL_AUTHOR as string,
        )
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);

    await app.listen(Number(process.env.APP_PORT));
    logger.log(`Server run: ${process.env.APP_URL}`);
    logger.log(`Swagger documentation: ${process.env.APP_URL_SWAGGER}`);
}
bootstrap();
