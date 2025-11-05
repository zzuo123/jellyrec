import { z } from 'zod';

export type SessionPayload = {
    username: string;
    token: string;
    baseurl: string;
    expiresAt: Date;
};

export const FormSchema = z.object({
  username: z.string(),
  password: z.string(),
  baseurl: z.url(),
  callbackurl: z.string().optional(),
});

export type UserCredentials = {
    username: string;
    password: string;
    baseurl: string;
};

export type FormState =
  | {
      errors?: {
        username?: string[]
        password?: string[]
        baseurl?: string[]
      }
      message?: string
    }
  | undefined