export * from './solana';
export const DEHYPE_PROGRAM_PUBKEY = process.env.DEHYPE_PROGRAM_PUBKEY;

export enum API_Header_Content_Type_Format {
  JSON = 'application/json',
  FORM = 'application/x-www-form-urlencoded',
  MULTIPART = 'multipart/form-data',
  TEXT = 'text/plain',
  HTML = 'text/html',
  XML = 'application/xml',
  JAVASCRIPT = 'application/javascript',
  PDF = 'application/pdf',
  ZIP = 'application/zip',
  IMAGE = 'image/*',
  AUDIO = 'audio/*',
  VIDEO = 'video/*',
  ANY = '*/*',
}

export enum DATE_FORMAT {
  TIME_STAMP = 'YYYY-MM-DD HH:mm:ss',
  TIME_STAMP_ISO = 'YYYY-MM-DDTHH:mm:ssZ',
  TIME_STAMP_TZ = 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  DATE = 'DD/MM/YYYY',
}

export enum ProductType {
  CAR = 'car',
  MOTORBIKE = 'motorbike',
}

export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}
