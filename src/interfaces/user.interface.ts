export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider?: string;
  roles?: string[];
}

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt?: number;
}
