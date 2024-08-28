import { user } from "$lib/stores/user.js";
import { redirect } from "@sveltejs/kit";

export const actions = {
  default: async ({ cookies, request, fetch }) => {
    console.log("login: action called");
    const data = await request.formData();
    const url = data.get("url");
    const name = data.get("name");
    const pw = data.get("pw");

    if (
      typeof url !== "string" ||
      typeof name !== "string" ||
      typeof pw !== "string" ||
      !url ||
      !name ||
      !pw
    ) {
      return {
        status: 400,
        body: {
          success: false,
        },
      };
    }

    const response = await fetch("http://localhost:4001/Auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url,
        username: name,
        password: pw,
      }),
    });

    console.log("login: request sent");

    if (response.ok) {
      console.log("login: response ok");
      cookies.set("user", name, {
        httpOnly: false,
        path: "/",
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 1, // 1 day
      });
      let obj = {
        name: name,
      };
      user.set(obj);

      throw redirect(302, "/home");
    } else {
      console.log("login: response not ok");
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
