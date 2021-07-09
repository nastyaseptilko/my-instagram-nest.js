import { Injectable } from '@nestjs/common';
import {
    Strategy,
    Profile,
    GoogleCallbackParameters,
    VerifyCallback,
} from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleAuthStrategyService extends PassportStrategy(Strategy, 'google') {
    constructor(private readonly configService: ConfigService) {
        super(
            {
                clientID: configService.get('GOOGLE_CLIENT_ID'),
                clientSecret: configService.get('GOOGLE_SECRET'),
                callbackURL: configService.get('CALLBACK_URL_GOOGLE_AUTH'),
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
