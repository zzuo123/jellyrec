import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnLoginPage = nextUrl.pathname.startsWith('/login');
            if (isOnLoginPage) {
                if (isLoggedIn) {
                    return Response.redirect(new URL('/dashboard', nextUrl));
                }
                return true; // Allow access to login page
            }
            return isLoggedIn; // Protect other routes
        },
    },
    providers: [],  // Add providers with an empty array for now
} satisfies NextAuthConfig;
