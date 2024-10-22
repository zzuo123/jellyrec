import { redirect } from "@sveltejs/kit";

async function login(url, name, pw) {
  const response = await fetch("http://backend:4001/Auth/login", {
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
  return response;
}

async function checkLogin() {
  let result = await fetch("http://backend:4001/Auth/loggedin", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (result.ok) {
    result = await result.json();
    return result.username;
  } else {
    return null;
  }
}

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

    if (checkLogin() != null) {
      console.log("login: user already logged in");
      fetch("http://localhost:4001/Auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    let response = await login(url, name, pw);

    if (response.ok) {
      console.log("login: response ok");
      cookies.set("user", name, {
        httpOnly: false,
        path: "/",
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 1, // 1 day
      });
      throw redirect(302, "/home");
    } else {
      console.log("login: response not ok");
      return {
        status: 400,
        body: {
          success: false,
          message: "Invalid username or password",
        },
      };
    }
  },
};
