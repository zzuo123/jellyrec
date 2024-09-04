async function authenticate(baseurl, name, pw) {
  // authenticate user using username and password, returns access token and user id
  try {
    const response = await fetch(baseurl + "/Users/authenticatebyname", {
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

async function logout(baseurl, token) {
  // reports to the server that the user has logged out (leave token handling to the server)
  const url = baseurl + "/Sessions/Logout";
  const response = await fetch(url, {
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

async function auth_using_api_key(baseurl, api_key, name) {
  // authenticate user using api key, returns access token and user id
  const response = await fetch(baseurl + "/Users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        'MediaBrowser Client="JellyRec", Device="JellyRecBackend", DeviceId="JellyRecBackend", Version="1.0.0", Token="' +
        api_key +
        '"',
    },
  });
  if (!response.ok) {
    return null;
  }
  const result = await response.json();
  for (let i = 0; i < result.length; i++) {
    if (result[i].Name === name) {
      return { token: api_key, uid: result[i].Id };
    }
  }
  return null;
}

export default {
  authenticate,
  logout,
  auth_using_api_key,
};
