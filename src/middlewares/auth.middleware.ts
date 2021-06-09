import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import {
    AuthenticatedRequest,
    AuthenticatedRequestViaGoogle,
    AuthenticatedRequestViaLocalIDP,
    DecodedUser,
    ResolvedDecodedUser,
    Secret,
} from 'src/middlewares/interfaces/auth.middleware.interfaces';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            await this.authenticate(req, res);
            next();
        } catch (e) {
            renderLogin(res);
        }
    }

    private async authenticate(req: AuthenticatedRequest, res: Response): Promise<void> {
        const idToken = req.cookies.idToken as string;
        const token = req.cookies.token as string;
        const userId = req.cookies.userId as number;

        if (idToken) {
            return await googleAuth(req, res, idToken, userId);
        } else if (token) {
            return await auth(req, res, token);
        }
        throw new Error('Not Authenticated.');
    }
}

function verifyJwt(token: string, secret: Secret): Promise<DecodedUser> {
    return new Promise<DecodedUser>((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) reject(err);
            else resolve(decoded as ResolvedDecodedUser);
        });
    });
}

function renderLogin(res: Response) {
    return res.render('login', {
        title: 'Login',
        layout: 'authorization',
        registerLink: true,
    });
}

async function googleAuth(
    req: AuthenticatedRequest,
    res: Response,
    idToken: string,
    userId: number,
) {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (payload && payload.email) {
        (req as AuthenticatedRequestViaGoogle).user = {
            id: userId,
            name: {
                familyName: payload.family_name,
                givenName: payload.given_name,
            },
            email: payload.email,
        };
        if (!req.user) {
            throw new Error('There is no user in the request.');
        }
    } else {
        throw new Error('No payload from Google.');
    }
}

async function auth(req: AuthenticatedRequest, res: Response, token: string) {
    const decoded = await verifyJwt(token, process.env.JWT_SECRET as Secret);

    if (decoded.user) {
        (req as AuthenticatedRequestViaLocalIDP).user = decoded.user;
    }

    if (!req.user) {
        throw new Error('There is no user in the request.');
    }
}
