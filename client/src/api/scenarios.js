import { requestGet, requestPost } from "../utils/request";
import { SCENARIOS_URL_API, CREATE_SCENARIOS_API } from "../constants.js";

export async function getScenarios(params) {
  return requestGet(SCENARIOS_URL_API, params);
}

export async function createScenario(req) {
  return await requestPost(CREATE_SCENARIOS_API, { req });
}
