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
