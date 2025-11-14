'use server';
import 'server-only';
import { createSession, getSession, deleteSession } from '@/app/lib/session';
import { SessionPayload, FormSchema, FormState } from '@/app/lib/definitions';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

async function authenticate(baseurl: string, name: string, pw: string) {
  // authenticate user using username and password, returns access token and user id
  try {
    const response: Response = await fetch(baseurl + "/Users/authenticatebyname", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          'MediaBrowser Client="JellyRec", Device="JellyRecBackend", DeviceId="JellyRecBackend", Version="1.0.0"',
      },
      body: JSON.stringify({ Pw: pw, Username: name }),
    });
    if (!response.ok) {
      return null;
    }
    const result = await response.json();
    return { token: result["AccessToken"], uid: result["User"]["Id"] };
  } catch (error) {
    console.log("Authentication failed:", error);
    return null;
  }
}

async function logout(baseurl: string, token: string) {
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

export async function signIn(state: FormState, formData: FormData) {
  // validate form data, and attempt login to jellyfin server using formData
  const parsedData = FormSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    baseurl: formData.get("baseurl"),
    callbackurl: formData.get("callbackUrl"),
  });

  if (!parsedData.success) {
    throw new Error("Invalid form data");
  }

  const { username, password, baseurl, callbackurl } = parsedData.data;
  const authResult = await authenticate(baseurl, username, password);

  if (!authResult) {
    return {
      errors: {
        username: ["Invalid username or password"],
        password: ["Invalid username or password"],
      },
    };
  }

  console.log("Authentication successful for user:", username);
  await createSession(username, authResult.token, baseurl);
  if (callbackurl) {
    redirect(callbackurl);
  } else {
    redirect('/dashboard');
  }
}

export async function signOut() {
  // logout user both locally and on the server
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  const payload: SessionPayload | undefined = await getSession();

  if (session && payload) {
    await logout(payload.baseurl, payload.token);
  }

  console.log("User logged out");
  await deleteSession();
  redirect('/login');
}