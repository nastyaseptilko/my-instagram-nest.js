import { RequestGoogleAuthForUser } from 'src/auth/interfaces/auth.middleware.interfaces';

export type GoogleLoginResult = {
    user: RequestGoogleAuthForUser['user'] & {
        nickname: string;
        idToken: string;
    };
};

export type EmailAndPasswordUser = {
    email: string;
    password: string;
};
