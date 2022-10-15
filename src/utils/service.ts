import { getToken } from "./auth";

async function makeFetch<T>(method: string, uri_path: string, body: any): Promise<T> {
  let headers: any = {
    'Content-Type': 'application/json'
  };
  const token = getToken();
  if (token) {
    headers['X-JWT-Token'] = token;
  }
  const response = await fetch(
    `${import.meta.env.VITE_BE_SERVER}/${uri_path}`,
    {
      method,
      mode: 'cors',
      referrer: 'no-referrer',
      headers,
      body: body ? JSON.stringify(body) : null,
    }
  );
  if (response.status === 200) {
    return await response.json();
  } else {
    throw response;
  }
}

export type AuthResponse = {
  id: number,
  token: string,
};

export const auth = async (login: string, sha256password: string): Promise<AuthResponse> => {
  return makeFetch('POST', 'authentificate', { username: login, password: sha256password });
}

export type User = {
  id: number,
  username: string,
}

export const fetchUser = async (id: number): Promise<User> => {
  return await makeFetch<User>('GET', `user/${id}`, null);
}

export const fetchUserList = async (): Promise<User[]> => {
  return await makeFetch<User[]>('GET', `user`, null) ?? [];
}

export type EventDetailData = {
  id: number,
  name: string,
  description?: string,
  participants: User[],
  requirements: { id: number, name: string, description?: string, size: number }[],
  fullfillments: { requirement: number, user: User }[],
  creator: User,
}

export const fetchEvent = async (id: number): Promise<EventDetailData> => {
  return await makeFetch<EventDetailData>('GET', `event/${id}`, null);
}

export type EventSummary = {
  id: number,
  name: string,
  description?: string,
  creator: User,
}

export const fetchEventList = async (): Promise<EventSummary[]> => {
  return await makeFetch<EventSummary[]>('GET', 'event', null) ?? [];
}
