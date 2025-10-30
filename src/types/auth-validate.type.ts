import { Permission } from 'src/modules/permission/entities/permission.entity';
import { Role } from 'src/modules/role/entities/role.entity';

// Interface cho profile xác thực
export interface BaseProfile {
  email: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  picture?: string;
  gender?: string;
}

// Interface cho thông tin user trả về
export interface UserResponse {
  userId: string;
  username: string;
  email: string;
  Roles: string;
  avatarUrl?: string;
  age?: number;
  gender?: string;
  isActice?: boolean;
  birthday?: Date;
  phoneNumber?: string;
  address?: string;
  permissions?: any;
}

// Interface chung cho User và Customer
export interface BaseUser {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  age?: number;
  gender?: string;
  isActice?: boolean;
  birthday?: Date;
  phoneNumber?: string;
  address?: string;
  password?: string;
  Roles: Role | Role[]; // Roles có thể là Role (Customer) hoặc Role[] (User)
  permissions?: Permission[];
}

// Cấu hình cho hàm xác thực
export interface ValidateConfig {
  isAdmin?: boolean;
  createIfNotExists?: boolean;
  isGenerateToken?: boolean;
}

// Cấu hình cho hàm đăng nhập
export interface LoginConfig {
  isAdmin?: boolean;
}

export interface ForgotPassword {
  email: string;
  config?: ValidateConfig;
}

export interface ResetPassword {
  token: string;
  newPassword: string;
  config?: ValidateConfig;
}

export interface VerifyResetPassword {
  token: string;
  config?: ValidateConfig;
}

export interface GenerateCodeActivationRegisterValidation {
  length?: number;
  expireInMinutes?: number;
}
