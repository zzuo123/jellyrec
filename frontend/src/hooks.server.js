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

export const handle = async ({ event, resolve}) => {
  let user = null;
  // check if the cookie exist, and if exists, parse it to the user variable
  if(event.cookies.get('user') != undefined && event.cookies.get('user') != null){
    user = event.cookies.get('user');
  }
  const url = new URL(event.request.url);

  if (url.pathname == "/") {
    console.log("hook: attempted to access /");
    if (user != null && user != "null") {
      console.log("hook: redirecting to home");
      throw redirect(302, '/home');
    } else {
      console.log("hook: redirecting to login");
      throw redirect(302, '/login');
    }
  }

  // validate the user existence and if the path is acceesible
  if (user == "null" && !isPathAllowed(url.pathname)) {
    console.log("hook: user cookie null and trying to access a private path");
    throw redirect(302, '/');
  }

  if(user != null && user != "null"){
    console.log("hook: user cookie not null");
    event.locals.user = user;

    if(url.pathname == '/login'){
      throw redirect(302, '/home');
    }
  }

  const response = await resolve(event);

  return response;
}