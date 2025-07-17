import * as CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
// export const generateMac = (data: string, key: string) => {
//   const mac = CryptoJS.HmacSHA256(data, key).toString();
//   return mac;
// };
export const generateMac = (data: string, key: string) => {
  const mac = CryptoJS.HmacSHA256(data, key).toString(CryptoJS.enc.Hex);
  return mac;
};

export const filterEmptyFields = <T extends Record<string, any>>(obj: T): T => {
  const cleanedObj = Object.fromEntries(
    Object.entries(obj).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  );
  return cleanedObj as T;
};

export const generateUUIDV4 = (): string => {
  // Generate a random UUID v4
  return uuidv4();
};
