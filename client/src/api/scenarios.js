import {
	requestGet,
	requestPut,
	requestPost,
	requestDelete,
} from "../utils/request";
import {
	SCENARIOS_URL_API,
	CREATE_SCENARIOS_API,
	UPDATE_SCENARIO_API,
	DELETE_SCENARIO_API,
	DELETE_SCENARIO_VIDEO_API,
} from "../constants.js";

export async function getScenarios() {
	try {
		const response = await requestGet(SCENARIOS_URL_API);
		return response.scenarios; // Assuming the response contains the scenarios as an array
	} catch (error) {
		throw new Error("Failed to fetch scenarios");
	}
}

export async function createScenario(req) {
	try {
		const response = await requestPost(CREATE_SCENARIOS_API, { req });
		return response; // Assuming the response contains the created scenario data
	} catch (error) {
		throw new Error("Failed to create scenario");
	}
}

export async function updateScenario(id, updatedData) {
	try {
		const url = UPDATE_SCENARIO_API.replace(":id", id);
		const response = await requestPut(url, updatedData);
		return response; // Assuming the response contains the updated scenario data
	} catch (error) {
		throw new Error("Failed to update scenario");
	}
}

export async function deleteScenario(id) {
	try {
		const url = DELETE_SCENARIO_API.replace(":id", id);
		const response = await requestDelete(url);
		return response; // Assuming the response contains the success message or status
	} catch (error) {
		throw new Error("Failed to delete scenario");
	}
}

export async function deleteScenarioVideo(id, videoId) {
	try {
		const url = DELETE_SCENARIO_VIDEO_API.replace(":id", id).replace(
			":videoId",
			videoId
		);
		const response = await requestDelete(url);
		return response; // Assuming the response contains the success message or status
	} catch (error) {
		throw new Error("Failed to delete video");
	}
}

export async function checkDuplicateVideo(videoId, videoName) {
	try {
		const scenarios = await getScenarios();

		// Check if any scenario has a matching videoId or videoName
		const duplicateVideo = scenarios.some((scenario) =>
			scenario.videos.some(
				(video) => video.videoId === videoId || video.videoName === videoName
			)
		);

		return duplicateVideo;
	} catch (error) {
		throw new Error("Failed to check duplicate video ID and video Name");
	}
}
