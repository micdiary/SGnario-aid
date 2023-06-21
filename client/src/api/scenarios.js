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

export async function checkDuplicateVideo(videoId, videoName) {
  try {
    const scenarios = await getScenarios();

    // Check if any scenario has a matching videoId or videoName
    const duplicateVideo = scenarios.some((scenario) =>
      scenario.videos.some(
        (video) =>
          video.videoId === videoId || video.videoName === videoName
      )
    );

    return duplicateVideo;
  } catch (error) {
    throw new Error("Failed to check duplicate video ID and video Name");
  }
}


