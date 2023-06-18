import { requestGet, requestPost } from "../utils/request";
import { SCENARIOS_URL_API, CREATE_SCENARIOS_API } from "../constants.js";

export async function getScenarios() {
  try {
    const response = await requestGet(SCENARIOS_URL_API);
    return response.scenarios; // Assuming the response contains the scenarios as an array
  } catch (error) {
    throw new Error('Failed to fetch scenarios');
  }
}

export async function createScenario(req) {
  try {
    const response = await requestPost(CREATE_SCENARIOS_API, { req });
    return response; // Assuming the response contains the created scenario data
  } catch (error) {
    throw new Error('Failed to create scenario');
  }
}

export async function checkDuplicateVideoId(videoId) {
  try {
    // Fetch the existing scenarios
    const scenarios = await getScenarios();

    // Check if videoId already exists
    const duplicateScenario = scenarios.find(scenario => scenario.videoId === videoId);
    return !!duplicateScenario;
  } catch (error) {
    throw new Error('Failed to check duplicate video ID');
  }
}

