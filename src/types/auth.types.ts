import type { Role } from './index';

export interface AuthActor {
  address: string;
  name: string;
  role: Role;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  actor: AuthActor | null;
  isAuthenticated: boolean;
}

// API payloads
export interface SiweMessagePayload {
  domain: string;
  address: string;
  uri: string;
  version: string;
  chainId: number;
}

export interface VerifyPayload {
  message: string;
  signature: string;
}

export interface RefreshPayload {
  refreshToken: string;
}

export interface LogoutPayload {
  refreshToken: string;
}

// API responses
export interface AuthResponse {
  status: 'success' | 'fail' | 'error';
  data: {
    accessToken: string;
    refreshToken: string;
    actor: AuthActor;
  };
}

export interface MessageResponse {
  status: 'success';
  data: {
    message: string;
  };
}
