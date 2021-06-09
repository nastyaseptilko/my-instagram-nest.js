import { User } from 'src/user/interfaces/user.interfaces';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

export type RequestUser = {
    user: User;
    cookies?: {
        token?: string;
    };
};

export type RequestGoogleAuthForUser = {
    user: {
        id: number;
        name: {
            familyName?: string;
            givenName?: string;
        };
        email: string;
    };
    cookies?: {
        token?: string;
    };
};

export type AuthenticatedRequestViaGoogle = Request & RequestGoogleAuthForUser;

export type AuthenticatedRequestViaLocalIDP = Request & RequestUser;

export type AuthenticatedRequest = AuthenticatedRequestViaLocalIDP | AuthenticatedRequestViaGoogle;

export type DecodedUser = {
    user?: User;
};

export type Secret = jwt.Secret | jwt.GetPublicKeyOrSecret;

export type ResolvedDecodedUser = DecodedUser | PromiseLike<DecodedUser>;
