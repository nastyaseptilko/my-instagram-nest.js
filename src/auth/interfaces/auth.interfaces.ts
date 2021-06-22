import { RequestGoogleAuthForUser } from 'src/middlewares/interfaces/auth.middleware.interfaces';

export type GoogleLoginResult = {
    user: RequestGoogleAuthForUser['user'] & {
        nickname: string;
        idToken: string;
    };
};
