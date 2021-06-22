import { Injectable } from '@nestjs/common';
import {
    Strategy,
    Profile,
    GoogleCallbackParameters,
    VerifyCallback,
} from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class GoogleAuthStrategyService extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_SECRET,
                callbackURL: process.env.CALLBACK_URL_GOOGLE_AUTH,
                scope: ['email', 'profile'],
            },
            verify,
        );
    }
}
function verify(
    accessToken: string,
    refreshToken: string,
    params: GoogleCallbackParameters,
    profile: Profile,
    done: VerifyCallback,
) {
    const user = {
        email: profile._json.email,
        nickname: `${profile.name?.givenName}` + `${profile.name?.familyName}`,
        idToken: params.id_token,
    };

    done(null, user);
}
