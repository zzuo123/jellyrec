import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';

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
    return null;
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
        credentials: {
            baseurl: { label: "Base URL", type: "text", placeholder: "https://your-jellyfin-server" },
            username: { label: "Username", type: "text", placeholder: "Your username" },
            password: { label: "Password", type: "password", placeholder: "Your password" },
            token: { label: "Token", type: "text", placeholder: "Auth token" },
        },
        async authorize(credentials) {
            if (!credentials) return null;
            const schema = z.object({
                baseurl: z.url(),
                username: z.string(),
                password: z.string(),
            });
            const parsed = schema.safeParse(credentials);
            if (!parsed.success) {
                return null;
            }
            const { baseurl, username, password } = parsed.data;
            const authResult = await authenticate(baseurl, username, password);
            if (!authResult) {
                console.log("Invalid credentials provided for user:", username);
                return null;
            }
            return { id: authResult.uid, token: authResult.token, name: username };
        },
    }),
  ],
});