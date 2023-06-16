import { requestPost } from "../utils/request";
import {
  THERAPISTS_PROFILE_API,
  REGISTER_SUPERUSER_API,
} from "../constants.js";
import { getToken } from "../utils/account";

export async function getTherapists() {
  const token = getToken();
  return requestPost(THERAPISTS_PROFILE_API, { req: { token: token } });
}

export async function registerSuperuser(req) {
  return requestPost(REGISTER_SUPERUSER_API, { req });
}
