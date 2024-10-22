import { redirect } from "@sveltejs/kit";

// define the routes of we want to be possible to access without auth
const public_paths = [
  '/',
  '/login'
];

// function to verify if the request path is inside the public_paths array
function isPathAllowed(path) {
  return public_paths.some(allowedPath =>
    path === allowedPath || path.startsWith(allowedPath + '/')
  );
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

export const handle = async ({ event, resolve}) => {

  // check if the user is logged in
  let loggedin = false;
  let user = null;
  // check if the cookie exist, and if exists, parse it to the user variable
  if(event.cookies.get('user') != undefined && event.cookies.get('user') != null){
    user = event.cookies.get('user');
  }
  let server_username = await checkLogin();
  if(server_username != null && server_username == user){
    loggedin = true;
  }
  event.locals.user = loggedin;
  event.locals.user = user;

  const url = new URL(event.request.url);

  if (url.pathname == "/") {
    console.log("hook: attempted to access /");
    if (loggedin && user != "null") {
      console.log("hook: redirecting to home");
      throw redirect(302, '/home');
    } else {
      console.log("hook: redirecting to login");
      throw redirect(302, '/login');
    }
  }

  // validate the user existence and if the path is acceesible
  if (!loggedin && !isPathAllowed(url.pathname)) {
    console.log("hook: user not logged in but trying to access a private path");
    throw redirect(302, '/');
  }

  if(loggedin){
    console.log("hook: user logged in");
    event.locals.user = user;

    if(url.pathname == '/login'){
      throw redirect(302, '/home');
    }
  }

  const response = await resolve(event);

  return response;
}
