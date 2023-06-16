import { requestGet, requestPost } from "../utils/request";
import { SCENARIOS_URL_API, CREATE_SCENARIOS_API } from "../constants.js";

export async function getScenarios(params) {
  try {
    return await requestGet(SCENARIOS_URL_API, params);
  } catch (error) {
    // Handle error appropriately
    console.error("Error fetching scenarios:", error);
    throw error; // Rethrow the error to propagate it
  }
}

export async function createScenario(req) {
  try {
    return await requestPost(CREATE_SCENARIOS_API, { req });
  } catch (error) {
    // Handle error appropriately
    console.error("Error creating scenario:", error);
    throw error; // Rethrow the error to propagate it
  }
}
