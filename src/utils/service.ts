import { getToken } from "./auth";

async function makeFetch<T>(method: string, uri_path: string, body: any): Promise<T> {
  let headers: any = {
    'Content-Type': 'application/json'
  };
  try {
    headers['X-JWT-Token'] = getToken();
  } catch (e) {}

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

export type Requirement = {
  id: number,
  name: string,
  description?: string,
  size: number
};

export type EventDetailData = {
  id: number,
  name: string,
  description?: string,
  participants: User[],
  requirements: Requirement[],
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

export type CreateEvent = {
  name: string,
  description?: string
}

export const createEvent = async (data: CreateEvent): Promise<EventSummary> => {
  return await makeFetch<EventSummary>('POST', 'event', data);
}

export type CreateRequirement = {
  name: string,
  description?: string,
  size?: number,
  event: number,
}

export type RequirementResponse = Requirement & { id: number };

export const createRequirement = async (data: CreateRequirement): Promise<RequirementResponse> => {
  return await makeFetch<RequirementResponse>('POST', 'requirement', data);
}
