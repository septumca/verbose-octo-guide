import { getToken } from "./auth";

async function makeFetch<T>(method: string, uri_path: string, body: any = null): Promise<Response> {
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

  if (response.status === 200 || response.status === 201 || response.status === 204) {
    return response;
  } else {
    throw response;
  }
}

export async function verifyCaptcha(token: string): Promise<boolean> {
  try {
    await makeFetch('POST', 'verify_captcha', { token })
    return true;
  } catch(e) {
    return false;
  }
}

export type AuthResponse = {
  id: number,
  token: string,
};

export const auth = async (login: string, sha256password: string): Promise<AuthResponse> => {
  return (await makeFetch('POST', 'authentificate', { username: login, password: sha256password })).json();
}

export const register = async (login: string, sha256password: string): Promise<User> => {
  return (await makeFetch('POST', 'register', { username: login, password: sha256password })).json();
}

export type User = {
  id: number,
  username: string,
}

export const fetchUser = async (id: number): Promise<User> => {
  return (await makeFetch('GET', `user/${id}`)).json();
}

export const fetchUserList = async (): Promise<User[]> => {
  return (await makeFetch('GET', `user`)).json() ?? [];
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
  return (await makeFetch('GET', `event/${id}`)).json();
}

export type EventSummary = {
  id: number,
  name: string,
  description?: string,
  creator: User,
}

export const fetchEventList = async (): Promise<EventSummary[]> => {
  return (await makeFetch('GET', 'event')).json() ?? [];
}

export type CreateEvent = {
  name: string,
  description?: string
}

export const createEvent = async (data: CreateEvent): Promise<EventSummary> => {
  return (await makeFetch('POST', 'event', data)).json();
}

export type UpdateEvent = {
  name?: string,
  description?: string
}

export const updateEvent = async (data: UpdateEvent): Promise<void> => {
  await makeFetch('PUT', 'event', data);
}

export type CreateRequirement = {
  name: string,
  description?: string,
  size?: number,
  event: number,
}

export type RequirementResponse = Requirement & { id: number };

export const createRequirement = async (data: CreateRequirement): Promise<RequirementResponse> => {
  return (await makeFetch('POST', 'requirement', data)).json();
}

export const deleteRequirement = async (id: number): Promise<void> => {
  await makeFetch('DELETE', `requirement/${id}`);
}

export type CreateParticipant = {
  user: number,
  event: number,
}

export type CreateParticipantResponse = {
  user: number,
  username: string,
}

export const createParticipant = async (data: CreateParticipant): Promise<CreateParticipantResponse> => {
  return (await makeFetch('POST', 'participant', data)).json();
}

export const deleteParticipant = async (user: number, event: number): Promise<void> => {
  await makeFetch('DELETE', `participant/${user}/${event}`);
}

export type CreateFullfillment = {
  user: number,
  requirement: number,
}

export type CreateFullfillmentResponse = {
  user: User,
  requirement: number,
}

export const createFullfillment = async (data: CreateFullfillment): Promise<CreateFullfillmentResponse> => {
  return (await makeFetch('POST', 'fullfillment', data)).json();
}

export const deleteFullfillment = async (user: number, requirement: number): Promise<void> => {
  await makeFetch('DELETE', `fullfillment/${user}/${requirement}`);
}
