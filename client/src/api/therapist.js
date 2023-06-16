import { requestGet, requestPost } from "../utils/request";
import {
  ASSIGN_TASK_API,
  GET_PATIENTS_BY_THERAPIST_API,
} from "../constants.js";
import { getToken } from "../utils/account";

export async function getPatientsByTherapist() {
  const token = getToken();
  return requestPost(GET_PATIENTS_BY_THERAPIST_API, { req: { token: token } });
}

export async function assignTasks(req) {
  const token = getToken();
  return requestPost(ASSIGN_TASK_API, { req: { token: token, fields: req } });
}
