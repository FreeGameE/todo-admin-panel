export interface UserRegistration {
  login: string;
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
}

export interface AuthData {
  login: string;
  password: string;
}

export interface RefreshToken {
  refreshToken: string;
}

export interface Profile {
  id: number;
  username: string;
  email: string;
  date: string;
  isBlocked: boolean;
  roles: Role[];
  phoneNumber: string;
}

export type ProfileRequest = Partial<
  Pick<Profile, "username" | "email" | "phoneNumber">
>;

export interface Token {
  access: string;
  refresh: string;
}

export interface AuthState {
  isAuthenticated: boolean;
}

type Role = "ADMIN" | "USER" | "MODERATOR";
