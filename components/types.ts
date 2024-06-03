import { number, object, string } from 'zod';

export const inputBody = object({
  username: string(),
  password: string(),
});

export const addLinkBody = object({
  title: string(),
  link: string(),
  userId: number(),
});

export type LinksType = {
  id: number;
  userId: number;
  title: string;
  link: string;
  status: string;
};
