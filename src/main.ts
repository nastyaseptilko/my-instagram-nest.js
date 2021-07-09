import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import * as session from 'express-session';
import flash = require('connect-flash');
import * as hbs from 'express-handlebars';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from 'src/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import * as passport from 'passport';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get<ConfigService>(ConfigService);

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

    // app.use(session({ secret: configService.get('JWT_SECRET') as string }));

    app.use(
        session({
            secret: configService.get('SESSION_SECRET') as string,
            resave: false,
            saveUninitialized: false,
            // cookie: { maxAge: 3600000 },
        }),
    );
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    const options = new DocumentBuilder()
        .setTitle('INSTAGRAM')
        .setVersion('1.0')
        .setDescription(
            'There is analog project Instagram. Technologies used: Node.js, Nest.js, MySQL, TypeORM',
        )
        .setContact(
            'Anastasiya Septilko',
            configService.get('APP_URL_SWAGGER') as string,
            'anastasiyaseptilko@gmail.com',
        )
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);

    await app.listen(configService.get('APP_PORT') as number);
    logger.log(`Server run: ${configService.get('APP_URL')}`);
    logger.log(`Swagger documentation: ${configService.get('APP_URL_SWAGGER')}`);
}
bootstrap();
