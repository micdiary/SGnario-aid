import { requestGet, requestPost } from "../utils/request";
import { CREATE_TASK_API, GET_TASKS_BY_PATIENT_API, GET_TASK_BY_ID_API } from "../constants.js";
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
