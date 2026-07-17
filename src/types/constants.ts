export const FISHEYE_ID = "fisheye-filter";
export const API_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.razeth.com";
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])/;
// /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
export const TOKEN_KEY = "razeth_token";
export const COOKIE_TOKEN_KEY = "set-auth-jwt";
export const VERIFY_ID_PATH = "/verify-id";
export const LANDING_PAGE =
  process.env.NEXT_PUBLIC_LANDING_PAGE || "/dashboard";
