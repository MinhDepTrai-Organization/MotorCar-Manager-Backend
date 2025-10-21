import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
export interface User {
  email: string;
  firstName: string;
  lastName: string;
  gender?: string; // Nếu `gender` có thể không có, hãy sử dụng dấu `?`
}

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: '878631717812048',
      clientSecret: 'fde98ee461e97da054d4bf0674314dc7',
      // callbackURL: 'http://localhost:9000/api/v1/auth/facebook/redirect',
      callbackURL: `${process.env.DEPLOYMENT_URL_V2}/api/v1/auth/facebook/redirect`,
      scope: 'email',
      profileFields: ['emails', 'name', 'profileUrl', 'birthday', 'gender'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: User, info?: any) => void,
  ): Promise<any> {
    const { name, emails, profileUrl, gender } = profile;
    const user: User = {
      email: emails[0]?.value,
      firstName: name?.givenName || '',
      lastName: name?.familyName || '',
      gender: gender || 'unknown', // Nếu gender có thể không tồn tại
    };
    // const payload = {
    //   user,
    // };

    //  done(null, payload);
    console.log(user);
    done(null, user);
  }
}
