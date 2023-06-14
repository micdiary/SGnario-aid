import { requestGet, requestPost } from "../utils/request";
import { PROFILE_API, EDIT_PROFILE_API } from "../constants.js";
import { getToken } from "../utils/account";

export async function getProfile(req) {
  return requestGet(`${PROFILE_API}/${req}`);
}

export async function editProfile(req) {
  const token = getToken();
  return requestPost(EDIT_PROFILE_API, { req: { token: token, fields: req } });
}