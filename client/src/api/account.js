import { requestGet, requestPost } from "../utils/request";
import { REGISTER_API, LOGIN_API, GET_ALL_THERAPIST_API } from "../constants.js";

export async function register(req) {
  return requestPost(REGISTER_API, { req });
}

export async function getTherapists() {
  return requestGet(GET_ALL_THERAPIST_API);
}

export async function login(req) {
  return requestPost(LOGIN_API, { req });
}
