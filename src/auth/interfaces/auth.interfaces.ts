import { RequestGoogleAuthForUser } from 'src/middlewares/interfaces/auth.middleware.interfaces';

export type Token = ResolveToken | undefined;

export type ResolveToken = string | PromiseLike<string>;

export type GoogleLoginResult = {
    user: RequestGoogleAuthForUser['user'] & {
        email: string;
        userName: string;
        idToken: string;
    };
};
