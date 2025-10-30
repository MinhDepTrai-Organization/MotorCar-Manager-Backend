import { BaseProfile } from './auth-validate.type';

export interface ProfileFacebook extends BaseProfile {
  gender?: string;
  profileUrl?: string;
}
