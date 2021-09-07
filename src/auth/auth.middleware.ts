import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import {
    AuthenticatedRequest,
    AuthenticatedRequestViaGoogle,
    AuthenticatedRequestViaLocalIDP,
    DecodedUser,
    Secret,
} from 'src/auth/interfaces/auth.middleware.interfaces';
import { User } from 'src/user/interfaces/user.interfaces';
import { ConfigService } from '@nestjs/config';
import { toPresentation } from '../presentation.response';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly configService: ConfigService) {}

    async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            await this.authenticate(req, res);
            next();
        } catch (e) {
            renderLogin(req, res);
        }
    }

    async authenticate(req: AuthenticatedRequest, res: Response): Promise<void> {
        const idToken = req.cookies.idToken as string;
        const token = req.cookies.token as string;
        const userId = req.cookies.userId as number;

        if (idToken) {
            return await this.authViaGoogle(req, res, idToken, userId);
        } else if (token) {
            return await this.authViaLocalIDP(req, res, token);
        }
        throw new Error('Not Authenticated');
    }

    async authViaGoogle(req: AuthenticatedRequest, res: Response, idToken: string, userId: number) {
        const client = new OAuth2Client(this.configService.get('GOOGLE_CLIENT_ID'));
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: this.configService.get('GOOGLE_CLIENT_ID'),
        });
        const payload = ticket.getPayload();

        if (payload && payload.email) {
            (req as AuthenticatedRequestViaGoogle).user = {
                id: userId,
                fullName: {
                    familyName: payload.family_name,
                    givenName: payload.given_name,
                },
                email: payload.email,
            };
            if (!req.user) {
                throw new Error('There is no user in the request');
            }
        } else {
            throw new Error('No payload from Google');
        }
    }

    async authViaLocalIDP(req: AuthenticatedRequest, res: Response, token: string) {
        const decoded = await verifyToken(token, process.env.JWT_SECRET as Secret);

        if (decoded.user) {
            (req as AuthenticatedRequestViaLocalIDP).user = decoded.user;
        }

        if (!req.user) {
            throw new Error('There is no user in the request');
        }
    }
}

export function generateAccessToken(user: { user: User }, secret: jwt.Secret): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        jwt.sign(user, secret, (err, token) => {
            if (token) resolve(token);
            else reject(err);
        });
    });
}

function verifyToken(token: string, secret: Secret): Promise<DecodedUser> {
    return new Promise<DecodedUser>((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (decoded) resolve(decoded);
            else reject(err);
        });
    });
}

function renderLogin(req: AuthenticatedRequest, res: Response) {
    return toPresentation({
        req,
        res,
        data: { registerLink: true },
        render: {
            viewName: 'login',
            options: {
                title: 'Login',
                layout: 'authorization',
                registerLink: true,
            },
        },
    });
}
