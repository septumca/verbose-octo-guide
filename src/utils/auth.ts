import jwt_decode from "jwt-decode";

const TOKEN_KEY: string = 'ZMTWC_TOKEN';

export const saveToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
}

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
}

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
}

export const isLoggedIn = (): boolean => localStorage.getItem(TOKEN_KEY) !== null;

export const getUserId = (): number | null => {
  const token = getToken();
  if (token) {
    let { sub } = jwt_decode(token) as any;
    return parseInt(sub, 10);
  }
  return null;
}
