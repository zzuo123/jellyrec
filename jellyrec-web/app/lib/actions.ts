'use server';
import 'server-only';
import { createSession, getSession, deleteSession } from '@/app/lib/session';
import { SessionPayload, FormSchema, FormState } from '@/app/lib/definitions';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Jellyfin } from '@jellyfin/sdk';
import { getUserApi } from '@jellyfin/sdk/lib/utils/api/user-api.js';
import { getSessionApi } from '@jellyfin/sdk/lib/utils/api/session-api.js';
import { getItemsApi } from '@jellyfin/sdk/lib/utils/api/items-api.js';

// Create a Jellyfin instance (can be reused)
function createJellyfinInstance() {
  return new Jellyfin({
    clientInfo: {
      name: 'JellyRec',
      version: '1.0.0'
    },
    deviceInfo: {
      name: 'JellyRecBackend',
      id: 'JellyRecBackend'
    }
  });
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
    const errors = parsedData.error.flatten().fieldErrors;
    return {
      errors: {
        username: errors.username,
        password: errors.password,
        baseurl: errors.baseurl,
      },
      message: "Invalid form data. Please check your inputs."
    };
  }

  const { username, password, baseurl, callbackurl } = parsedData.data;

  // Authenticate with Jellyfin
  try {
    const jellyfin = createJellyfinInstance();
    const api = jellyfin.createApi(baseurl);

    const response = await getUserApi(api).authenticateUserByName({
      authenticateUserByName: {
        Username: username,
        Pw: password
      }
    });

    if (!response.data?.AccessToken || !response.data?.User?.Id) {
      return {
        errors: {
          username: ["Authentication failed"],
          password: ["Authentication failed"],
        },
        message: "Invalid response from server. Please try again."
      };
    }

    console.log("Authentication successful for user:", username);
    await createSession(username, response.data.AccessToken, baseurl);

  } catch (error: any) {
    console.error("Authentication error:", error);

    // Handle different types of errors
    if (error.response) {
      // Server responded with an error status
      const status = error.response.status;

      if (status === 401 || status === 400) {
        return {
          errors: {
            username: ["Invalid username or password"],
            password: ["Invalid username or password"],
          },
          message: "Authentication failed. Please check your credentials."
        };
      } else if (status === 403) {
        return {
          errors: {
            username: ["Account access forbidden"],
          },
          message: "Your account does not have permission to access this server."
        };
      } else if (status === 500 || status === 502 || status === 503) {
        return {
          errors: {
            baseurl: ["Server error"],
          },
          message: "The Jellyfin server is experiencing issues. Please try again later."
        };
      } else {
        return {
          errors: {
            baseurl: [`Server error (${status})`],
          },
          message: "An unexpected server error occurred. Please try again."
        };
      }
    } else if (error.request) {
      // Request was made but no response received
      return {
        errors: {
          baseurl: ["Cannot connect to server"],
        },
        message: "Unable to reach the Jellyfin server. Please check the URL and your internet connection."
      };
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      // DNS or connection errors
      return {
        errors: {
          baseurl: ["Invalid server URL"],
        },
        message: "The server URL is invalid or the server is not responding."
      };
    } else if (error.message?.includes('fetch failed') || error.message?.includes('network')) {
      // Network-related errors
      return {
        errors: {
          baseurl: ["Network error"],
        },
        message: "Network error. Please check your connection and the server URL."
      };
    } else {
      // Unknown error
      return {
        errors: {
          username: ["Authentication failed"],
        },
        message: error.message || "An unexpected error occurred. Please try again."
      };
    }
  }

  // Redirect OUTSIDE the try-catch block so NEXT_REDIRECT isn't caught
  if (callbackurl) {
    redirect(callbackurl);
  } else {
    redirect('/dashboard');
  }
}

export async function logoutAction() {
  try {
    // logout user both locally and on the server
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    const payload: SessionPayload | undefined = await getSession();

    // Attempt to logout from Jellyfin server
    if (session && payload) {
      try {
        const jellyfin = createJellyfinInstance();
        const api = jellyfin.createApi(payload.baseurl, payload.token);

        await getSessionApi(api).reportSessionEnded();
        console.log("User logged out from Jellyfin server");
      } catch (error: any) {
        // Don't fail the logout if server logout fails
        // Log the specific error for debugging
        if (error.response?.status === 401) {
          console.warn("Session already expired on server");
        } else if (error.request) {
          console.warn("Unable to reach server for logout - server may be down");
        } else {
          console.warn("Failed to logout from Jellyfin server:", error.message);
        }
      }
    }

    await deleteSession();
    return { success: true };
  } catch (error) {
    console.error("Unexpected error during sign out:", error);
    // Ensure session is deleted even if an error occurs
    await deleteSession();
    return { success: false, error: "Failed to sign out" };
  }
}

export async function getFavoriteMovies() {
  // Get favorite movies for the current user
  const payload: SessionPayload | undefined = await getSession();

  if (!payload) {
    throw new Error("Not authenticated");
  }

  try {
    const jellyfin = createJellyfinInstance();
    const api = jellyfin.createApi(payload.baseurl, payload.token);

    // Get current user info to extract userId
    const userResponse = await getUserApi(api).getCurrentUser();

    if (!userResponse.data?.Id) {
      throw new Error("Failed to get user information");
    }

    const userId = userResponse.data.Id;

    // Get favorite movies
    // In getFavoriteMovies function, update the fields array:
    const response = await getItemsApi(api).getItems({
      userId: userId,
      filters: ['IsFavorite'],
      includeItemTypes: ['Movie'],
      recursive: true,
      fields: [
        'Overview',
        'Genres',
        'DateCreated',
        // 'PremiereDate',
        // 'CommunityRating',
        // 'OfficialRating',
        'Taglines',
        'Studios',
        'People',
        // 'VoteCount',
        // 'RunTimeTicks',
        'ProviderIds'
      ],
      sortBy: ['SortName'],
      sortOrder: ['Ascending']
    });

    return response.data?.Items || [];
  } catch (error: any) {
    console.error("Failed to get favorite movies:", error);

    if (error.response?.status === 401) {
      throw new Error("Session expired. Please log in again.");
    } else if (error.request) {
      throw new Error("Unable to reach the Jellyfin server.");
    } else {
      throw new Error(error.message || "Failed to retrieve favorite movies.");
    }
  }
}