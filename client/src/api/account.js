import { requestPost } from "../utils/request";
import { REGISTER_API, LOGIN_API } from "../constants.js";

export async function register(username, password) {
  return requestPost(REGISTER_API, { username, password });
}

export async function login(username, password) {
  return requestPost(LOGIN_API, { username, password });
}
