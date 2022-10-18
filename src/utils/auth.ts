import jwt_decode from "jwt-decode";
import { json } from "react-router-dom";

const TOKEN_KEY: string = 'ZMTWC_TOKEN';

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

export const isLoggedIn = (): boolean => localStorage.getItem(TOKEN_KEY) !== null;

export const getUserId = (): number | null => {
  try {
    let { sub } = jwt_decode(getToken()) as any;
    return parseInt(sub, 10);
  } catch(e) {
    console.error('Error getting userId', e);
    return null;
  }
}

export const getUserData = (): { id: number, username: string } => {
  let { sub, username } = jwt_decode(getToken()) as any;
  return {
    id: parseInt(sub, 10),
    username
  };
}
