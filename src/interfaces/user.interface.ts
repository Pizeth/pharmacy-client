export interface User {
  // id: string;
  // name: string;
  // email: string;
  // avatar?: string;
  // provider?: string;
  // roles?: string[];
  authenticated: boolean;
}

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt?: number;
}
