import { requestGet, requestPost } from "../utils/request";
import {
	CREATE_TASK_API,
	GET_TASKS_BY_PATIENT_API,
	GET_TASK_BY_ID_API,
	TASK_STATUS_API,
	USER_TASK_SUBMISSION_API,
} from "../constants.js";
import { getToken } from "../utils/account";

export async function createTasks(req) {
	const token = getToken();
	return requestPost(CREATE_TASK_API, { req: { token: token, fields: req } });
}

export async function getTasksByToken() {
	const token = getToken();
	return requestGet(`${GET_TASKS_BY_PATIENT_API}/${token}`);
}

export async function getTaskById(req) {
	return requestGet(`${GET_TASK_BY_ID_API}/${req}`);
}

export async function updateTask(req) {
	const token = getToken();
	const formData = new FormData();
	formData.append("token", token);
	formData.append("fields", JSON.stringify(req));
	if (req.file) {
		formData.append("file", req.file.originFileObj);
	}
	return requestPost(
		USER_TASK_SUBMISSION_API,
		{ req: formData },
		"multipart/form-data"
	);
}

export async function updateStatus(req) {
	const token = getToken();
	return requestPost(`${TASK_STATUS_API}`, {
		req: { token: token, fields: req },
	});
}

export async function getTaskStatusCount(req) {
	return requestGet(`${TASK_STATUS_API}/${req}`);
}
