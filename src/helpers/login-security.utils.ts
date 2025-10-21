import { genSaltSync, hashSync } from 'bcrypt';
import { generateMac } from './utils';
import appConfig from 'src/config/app.config';
// Hàm tạo token reset password
export const generateResetToken = (
  userId: string,
  expiresInHours: number = 1,
): { token: string; expires: Date } => {
  const secret_key = appConfig().RESET_PASSWORD_SECRET;
  const expiresTimestamp = Date.now() + expiresInHours * 60 * 60 * 1000; // Hết hạn sau expiresInHours giờ
  const expires = new Date(expiresTimestamp); // Chuyển timestamp sang Date
  const data = `${userId}.${expiresTimestamp}`; // Vẫn dùng timestamp trong data để tạo token
  const token = generateMac(data, secret_key);
  return { token, expires };
};

// Hàm kiểm tra token
export const verifyResetToken = (
  userId: string,
  token: string,
  expires: Date,
): boolean => {
  if (Date.now() > expires.getTime()) {
    return false; // Token đã hết hạn
  }
  const secret_key = appConfig().RESET_PASSWORD_SECRET;
  const data = `${userId}.${expires.getTime()}`; // Dùng getTime() để lấy timestamp từ Date
  const expectedToken = generateMac(data, secret_key);
  return token === expectedToken;
};

// Hàm hash mật khẩu
export const hashPasswordFunc = ({
  saltRounds = 10,
  password,
}: {
  saltRounds?: number;
  password: string;
}) => {
  const salt = genSaltSync(saltRounds);
  return hashSync(password, salt);
};
