import { requestGet, requestPost } from "../utils/request";
import { PROFILE_API, EDIT_PROFILE_API,DRIVE_CREDENTIALS_API } from "../constants.js";
import { getToken } from "../utils/account";

export async function getProfile() {
  const token = getToken();
  return requestGet(`${PROFILE_API}/${token}`);
}

export async function editProfile(req) {
  const token = getToken();
  return requestPost(EDIT_PROFILE_API, { req: { token: token, fields: req } });
}

export async function setStorageConfigurations(req) {
  const token = getToken();
  return requestPost(DRIVE_CREDENTIALS_API, { req: { token: token, fields: req } });
}