async function requestHandler(api, body = {}, method = "GET") {
  let requestOptions = {};

  if (method !== "GET") {
    requestOptions = {
      method: method,
      credentials: "include",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body.req),
    };
  }
  const response = await fetch(api, requestOptions);
  return response.json();
}

export async function requestGet(api) {
  return requestHandler(api);
}

export async function requestPost(api, body) {
  return requestHandler(api, body, "POST");
}

export async function requestPut(api, body) {
  return requestHandler(api, body, "PUT");
}

export async function requestDelete(api, body) {
  return requestHandler(api, body, "DELETE");
}