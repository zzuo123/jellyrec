'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}


export async function serverLogout(baseurl: string, token: string) {
  // reports to the server that the user has logged out (leave token handling to the server)
  const url: string = baseurl + "/Sessions/Logout";
  const response: Response = await fetch(url, {
    method: "Post",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        'MediaBrowser Client="JellyRec", Device="JellyRecBackend", DeviceId="JellyRecBackend", Version="1.0.0", Token="' +
        token +
        '"',
    },
  });
  if (response.status != 204) {
    return false;
  }
  return true;
}
