import { getToken } from "./auth";

async function makePublicFetch<T>(method: string, uri_path: string, body: any): Promise<T | null> {
  const response = await fetch(
    `${import.meta.env.VITE_BE_SERVER}/${uri_path}`,
    {
      method,
      mode: 'cors',
      referrer: 'no-referrer',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : null,
    }
  );
  if (response.status === 200) {
    return await response.json();
  }
  return null;
}

async function makeFetch<T>(method: string, uri_path: string, body: any): Promise<T | null> {
  const token = getToken();
  if (token !== null) {
    const response = await fetch(
      `${import.meta.env.VITE_BE_SERVER}/${uri_path}`,
      {
        method,
        mode: 'cors',
        referrer: 'no-referrer',
        headers: {
          'Content-Type': 'application/json',
          'X-JWT-Token': token,
        },
        body: body ? JSON.stringify(body) : null,
      }
    );
    if (response.status === 200) {
      return await response.json();
    }
  }
  return null;
}

export type AuthResponse = {
  id: number,
  token: string,
};

export const auth = async (login: string, sha256password: string): Promise<AuthResponse | null> => {
  return makePublicFetch('POST', 'authentificate', { username: login, password: sha256password });
}

export type EventSummary = {
  id: number,
  name: string,
  description?: string,
  creator: number,
}

export type User = {
  id: number,
  username: string,
}

export const fetchUser = async (id: number): Promise<User | null> => {
  return await makeFetch<User | null>('GET', `user/${id}`, null);
}

export const fetchUserList = async (): Promise<User[]> => {
  return await makePublicFetch<User[]>('GET', `user`, null) ?? [];
}

export const fetchEventList = async (): Promise<EventSummary[]> => {
  return await makePublicFetch<EventSummary[]>('GET', 'event', null) ?? [];
}