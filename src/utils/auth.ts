import jwt_decode from "jwt-decode";
import { json } from "react-router-dom";

const TOKEN_KEY: string = 'ZMTWC_TOKEN';

export type AuthData = {
  id: number,
  username: string,
};

export const saveToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
}

export const getToken = (): string => {
  let token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    throw json({}, { status: 401 });
  }
  return token;
}

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
}

export const getAuthData = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const isLoggedIn = token !== null;

  let data: AuthData | undefined = undefined;
  if (isLoggedIn) {
    const token_data = jwt_decode(token) as any;
    data = {
      id: parseInt(token_data.sub, 10),
      username: token_data.username
    };
  }

  return { isLoggedIn, authData: data };
}
