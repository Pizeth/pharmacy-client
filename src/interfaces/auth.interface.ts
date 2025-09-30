export interface LoginParams {
  // For form login
  credential?: string;
  password?: string;
  // For OIDC callback
  token?: string;
  // Other params
  [key: string]: unknown;
}

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt?: number;
}
