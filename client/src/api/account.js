import { requestPost } from "../utils/request";
import { REGISTER_API, LOGIN_API } from "../constants.js";

export async function register(req) {
  return requestPost(REGISTER_API, { req });
}

export async function login(req) {
  return requestPost(LOGIN_API, { req });
}
