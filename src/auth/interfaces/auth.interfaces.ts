import { RequestGoogleAuthForUser } from 'src/middlewares/interfaces/auth.middleware.interfaces';

export type ResolvedToken = string | PromiseLike<string>;

export type Token = ResolvedToken | undefined;

export type GoogleLoginResult = {
    user: RequestGoogleAuthForUser['user'] & {
        userName: string;
        idToken: string;
    };
};
