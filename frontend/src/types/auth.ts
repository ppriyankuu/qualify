export type UserRole = "student" | "admin";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  hasProfile?: boolean;
  name?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: {
    code: string;
    message: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  role: UserRole;
}
