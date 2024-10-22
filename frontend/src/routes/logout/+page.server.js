// logout/+page.server.js
import { redirect } from "@sveltejs/kit";

export const actions = {
  default: async ({ cookies }) => {
    const response = await fetch("http://backend:4001/Auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("logout: request sent");
    if (response.ok) {
      console.log("logout: response ok");
      //set the cookies to null and redirect
      cookies.set("user", null, {
        path: "/",
      });
      throw redirect(302, "/login");
    } else {
      console.log("logout: response not ok");
      const { errors } = await response.json();
      return {
        status: 400,
        body: {
          success: false,
          errors,
        },
      };
    }
  },
};
