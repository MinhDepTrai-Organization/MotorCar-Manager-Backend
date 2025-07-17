import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    // super({
    //   clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
    //   clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
    //   callbackURL: `${configService.get<string>('DEPLOYMENT_URL_V2')}/api/v1/auth/google/callback`,
    //   scope: ['email', 'profile'],
    // });
    // super({
    //   clientID:
    //     '53907891627-lhdaie0g1h1bneehqbg8ejenpanj78df.apps.googleusercontent.com',
    //   clientSecret: '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',
    //   callbackURL: 'http://localhost:9000/api/v1/auth/google/callback',
    //   scope: ['email', 'profile'],
    // });
    super({
      clientID:
        '53907891627-lhdaie0g1h1bneehqbg8ejenpanj78df.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL:
        'https://hs-backend-8fop.onrender.com/api/v1/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
