import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import facebookOauthConfig from 'src/config/facebook-oauth.config';
import { ProfileFacebook } from 'src/types/facebook-oaut.type';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: facebookOauthConfig().clientID,
      clientSecret: facebookOauthConfig().clientSecret,
      callbackURL: facebookOauthConfig().callbackURL,
      scope: 'email',
      profileFields: ['emails', 'name', 'profileUrl', 'birthday', 'gender'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: ProfileFacebook, info?: any) => void,
  ): Promise<any> {
    const { name, emails, gender, profileUrl } = profile;
    const { familyName, givenName, middleName } = name;
    const user: ProfileFacebook = {
      email: emails[0]?.value,
      firstName: givenName || '',
      lastName: familyName || '',
      middleName: middleName || '',
      profileUrl: profileUrl || '',
      gender: gender || 'other',
    };
    done(null, user);
  }
}
